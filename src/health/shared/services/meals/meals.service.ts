import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';


import { AuthService } from 'src/auth/shared/services/auth/auth.service';
import { Store } from '../../../../store';

export interface Meal {
    name: string,
    ingredients: string[],
    timestamp: number,
    $key: string,
    $exists: () => boolean
}

@Injectable()
export class MealsService {
    
    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService,
        private anStore: AngularFirestore
    ) {}

    meals$: Observable<any[]> = this.anStore.collection("meals").doc("users").collection(`${this.store.uid}`)
        .valueChanges({ idField: '$key' }).pipe(
                tap((next) => this.store.set('meals', next))
            );

    getMeal(key: string) {
        if (!key) return of({});
        // the data is already in the store
        return this.store.select<Meal[]>('meals').pipe(
            filter<Meal[]>(Boolean),
            map(meals => meals.find((meal: Meal) => meal.$key === key)),
        );
    }
    
    addMeal(meal: Meal) {
        return this.anStore.collection("meals").doc("users").collection(`${this.store.uid}`).add(meal);
    }

    removeMeal(key: string) {
        return this.anStore.collection("meals").doc("users").collection(`${this.store.uid}`).doc(key).delete();
    }

    updateMeal(key: string, meal: Meal) {
        return this.anStore.collection("meals").doc("users").collection(`${this.store.uid}`).doc(key).update(meal);
    }
}