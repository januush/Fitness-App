import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '../../../../store';

import { Meal } from '../meals/meals.service';
import { Workout } from '../workouts/workouts.service';

import { AngularFirestore } from '@angular/fire/firestore';

export interface ScheduleItem {
    meals: Meal[],
    workouts: Workout[],
    section: string,
    timestamp: number,
    $key?: string
}

export interface ScheduleList {
    morning?: ScheduleItem,
    lunch?: ScheduleItem,
    evening?: ScheduleItem,
    snacks?: ScheduleItem,
    [key: string]: any
}

@Injectable()
export class ScheduleService {

    private date$ = new BehaviorSubject(new Date());
    private section$ = new Subject();
    private itemList$ = new Subject();

    items$ = this.itemList$.pipe(
        withLatestFrom(this.section$),
        map(([ items, section ]: any[]) => {
           
            console.log(section.data$)

            const id = section.data.$key;

            const defaults: ScheduleItem = {
                workouts: null,
                meals: null,
                section: section.section,
                timestamp: new Date(section.day).getTime()
            };

            const payload = {
                ...(id ? section.data : defaults),
                ...items
            };

            if (id) {
                return this.updateSection(id, payload);
            } else {
                return this.createSection(payload);
            }

        })
    );

    selected$ = this.section$.pipe(
        tap((next: any) => this.store.set('selected', next))
    )

    list$ = this.section$.pipe(
        map((value: any) => this.store.value[value.type]),
        tap((next: any) => this.store.set('list', next))
    );

    schedule$: Observable<any> = this.date$.pipe(
        tap((next) => this.store.set('date', next)),
        map((day: any) => {
            
            const startAt = (
                new Date(day.getFullYear(), day.getMonth(), day.getDate())
            ).getTime();

            const endAt = (
                new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
            ).getTime() - 1;

            return { startAt, endAt };
        }),
        switchMap(({ startAt, endAt }: any) => this.getSchedule(startAt, endAt)),
        map((data: any) => {

            const mapped: ScheduleList = {};

            for (const prop of data) {
                if (!mapped[prop.section]) {
                    mapped[prop.section] = prop;
                }
            }

            return mapped;
        }),
        tap((next: any) => this.store.set('schedule', next))
    );

    constructor(
        private store: Store,
        private fireStore: AngularFirestore
    ) {}

    updateItems(items: string[]) {
        this.itemList$.next(items);
    }

    updateDate(date: Date) {
        this.date$.next(date);
    }

    selectSection(event: any) {
        this.section$.next(event);
    }

    private createSection(payload: ScheduleItem) {
        return this.fireStore.collection("schedule").doc("users").collection(`${this.store.uid}`).add(payload);
    }

    private updateSection(key: string, payload: ScheduleItem) {
        return this.fireStore.collection("schedule").doc("users").collection(`${this.store.uid}`).doc(key).update(payload);
    }

    private getSchedule(startAt: number, endAt: number) {
        return this.fireStore.collection("schedule").doc("users").collection(`${this.store.uid}`,
            ref => ref.orderBy('timestamp').startAt(startAt).endAt(endAt)
            ).valueChanges({ idField: '$key' });
    }

}