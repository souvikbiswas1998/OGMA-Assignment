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
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { HighlightPipe } from '../custom-pipes/highlight.pipe';
import { SearchPipe } from '../custom-pipes/search.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgsavatarModule } from 'ngs-avatar';
import { MatMenuModule } from '@angular/material/menu';
import { UserComponent } from './user/user.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DashboardComponent,
    DetailsComponent,
    SearchPipe, HighlightPipe, UserComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    FormsModule, MatInputModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule, MatDialogModule,
    SharedModule,
    MatPaginatorModule,
    NgsavatarModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [ PostService ]
})
export class DashboardModule { }
