import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPostComponent } from './add-edit-post/add-edit-post.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    AddEditPostComponent
  ],
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    FormsModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule, MatProgressBarModule
  ],
  exports: [ AddEditPostComponent ]
})
export class SharedModule { }
