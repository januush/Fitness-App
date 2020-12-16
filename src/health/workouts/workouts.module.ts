import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

// containers
import { WorkoutsComponent } from '../workouts/containers/workouts/workouts.component';
import { WorkoutComponent } from '../workouts/containers/workout/workout.component';

// components
import { WorkoutFormComponent } from '../workouts/components/workout-form/workout-form.component';
import { WorkoutTypeComponent } from '../workouts/components/workout-type/workout-type.component';


export const ROUTES: Routes = [
  { path: '', component: WorkoutsComponent },
  { path: 'new', component: WorkoutComponent },
  { path: ':id', component: WorkoutComponent },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule
  ],
  declarations: [
    WorkoutsComponent,
    WorkoutComponent,
    WorkoutFormComponent,
    WorkoutTypeComponent
  ]
})
export class WorkoutsModule {}