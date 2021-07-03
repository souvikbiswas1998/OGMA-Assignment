import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../app.service';
import { AuthService } from '../services/auth.service';
import { AddEditPostComponent } from '../shared/add-edit-post/add-edit-post.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
// tslint:disable: no-inferrable-types
export class DashboardComponent implements OnInit {
  public searchedTerm: string = '';

  constructor(
    private authService: AuthService,
    private appService: AppService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public logout(): void {
    this.authService
      .SignOut()
      .then(() =>
        this.appService.openSnackBar('Logged out successfully', 'Dismiss')
      );
  }

  // tslint:disable-next-line: typedef
  public openDialog() {
    if (!this.authService.currentUser) {
      const dialogRef = this.dialog.open(AddEditPostComponent, {
        data: {
          animal: 'panda',
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }
}
