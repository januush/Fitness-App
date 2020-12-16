import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Workout, WorkoutsService } from '../../../shared/services/workouts/workouts.service';


@Component({
  selector: 'workout',
  styleUrls: ['workout.component.scss'],
  template: `
    <div class="workout">
      <div class="workout__title">
        <h1>
          <img src="../../../../assets/img/workout.svg">
          <span *ngIf="workout$ | async as workout; else title;">
            {{ workout.name ? 'Edit' : 'Create' }} workout
          </span>
          <ng-template #title>
            Loading...
          </ng-template>
        </h1>
      </div>
      <div *ngIf="workout$ | async as workout; else loading;">
        <workout-form
          [workout]="workout"
          (create)="addWorkout($event)"
          (update)="updateWorkout($event)"
          (remove)="removeWorkout($event)">
        </workout-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="../../../../assets/img/loading.svg">
          Fetching workout
        </div>
      </ng-template>
    </div>
  `
})
export class WorkoutComponent implements OnInit, OnDestroy {

  // for updating window
  workout$: Observable<Workout>;
  subscription: Subscription;

  constructor(
    private workoutsService: WorkoutsService,
    private router: Router,
    private route: ActivatedRoute // gives a kind of snapshot of where we are
  ) {}

  ngOnInit() {
    // subscribe again to the workouts list
    this.subscription = this.workoutsService.workouts$.subscribe();
    this.workout$ = <Observable<Workout>> this.route.params.pipe(
      switchMap(param => this.workoutsService.getWorkout(param.id))
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  async addWorkout(event: Workout) {
      await this.workoutsService.addWorkout(event);
      this.backToWorkouts();
  }

  async updateWorkout(event: Workout) {
    // gives id from url staticly
    const key = this.route.snapshot.params.id;
    await this.workoutsService.updateWorkout(key, event);
    this.backToWorkouts(); 
  }

  async removeWorkout(event: Workout) {
    const key = this.route.snapshot.params.id;
    await this.workoutsService.removeWorkout(key);
    this.backToWorkouts(); 
  }

  backToWorkouts() {
    this.router.navigate(['workouts']);
  }
}