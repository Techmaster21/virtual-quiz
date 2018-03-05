import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatListModule, MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule
  ]
})
export class MaterialModule { }
