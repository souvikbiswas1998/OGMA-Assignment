import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DetailsComponent } from './details/details.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PostService } from '../services/post.service';


@NgModule({
  declarations: [
    DashboardComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    FormsModule, MatInputModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule
  ],
  providers: [ PostService ]
})
export class DashboardModule { }
