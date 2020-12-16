import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';


import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Store } from '../../../../store';

export interface Workout {
    name: string,
    type: string,
    strength: any,
    endurance: any,
    timestamp: number,
    $key: string,
    $exists: () => boolean
}

@Injectable()
export class WorkoutsService {
    
    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService,
        private anStore: AngularFirestore
    ) {}

    workouts$: Observable<any[]> = this.anStore.collection("workouts").doc("users").collection(`${this.store.uid}`)
        .valueChanges({ idField: '$key' }).pipe(
                tap((next) => this.store.set('workouts', next))
            );

    getWorkout(key: string) {
        if (!key) return of({});
        // the data is already in the store
        return this.store.select<Workout[]>('workouts').pipe(
            filter<Workout[]>(Boolean),
            map(workouts => workouts.find((workout: Workout) => workout.$key === key)),
        );
    }
    
    addWorkout(workout: Workout) {
        return this.anStore.collection("workouts").doc("users").collection(`${this.store.uid}`).add(workout);
    }

    removeWorkout(key: string) {
        return this.anStore.collection("workouts").doc("users").collection(`${this.store.uid}`).doc(key).delete();
    }

    updateWorkout(key: string, workout: Workout) {
        return this.anStore.collection("workouts").doc("users").collection(`${this.store.uid}`).doc(key).update(workout);
    }
}