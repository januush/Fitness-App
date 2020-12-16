import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from 'src/store';

import { WorkoutsService, Workout } from '../../../shared/services/workouts/workouts.service';

@Component({
  selector: 'workouts',
  styleUrls: ['workouts.component.scss'],
  template: `
    <div class="workouts">
      <div class="workouts__title">
        <h1>
          <img src="../../../../assets/img/food.svg">
          Your workouts
        </h1>
        <a 
          class="btn__add"
          [routerLink]="['../workouts/new']">
          <img src="../../../../assets/img/add-white.svg">
          New workout
        </a>
      </div>
      <div *ngIf="workouts$ | async as workouts; else loading;">
        <div class="message" *ngIf="!workouts.length">
        <img src="../../../../assets/img/face.svg">
        No workouts, add a new workout to start
        </div>
        <!-- workouts -->
        <list-item
          *ngFor="let workout of workouts"
          [item]="workout"
          (remove)="removeWorkout($event)">
        </list-item>
      </div>
      <ng-template #loading>
        <div class="message">
        <img src="../../../../assets/img/loading.svg">
          Fetching workouts...
        </div>
      </ng-template>
    </div>
  `
})
export class WorkoutsComponent implements OnInit, OnDestroy {

  workouts$: Observable<Workout[]>;
  subscription: Subscription;

  constructor(
    private store: Store,
    private workoutsService: WorkoutsService
  ) {}

  ngOnInit() {
    console.log("workouts.component NgOnInit");
    this.workouts$ = this.store.select<Workout[]>('workouts');
    this.subscription = this.workoutsService.workouts$.subscribe();
    this.workouts$.subscribe(console.log);
  }

  ngOnDestroy() {
    console.log("workouts.component NgOnDestroy");
    this.subscription.unsubscribe();
  }

  async removeWorkout(event: Workout) {
    await this.workoutsService.removeWorkout(event.$key);
  }
}