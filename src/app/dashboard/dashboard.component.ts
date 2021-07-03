import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
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
  public isLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => this.isLogin = Boolean(user));
    // this.isLogin = Boolean(this.authService?.currentUser?.uid);
  }

  public logout(): void {
    this.authService
      .SignOut()
      .then(() =>
        this.appService.openSnackBar('Logged out successfully', 'Dismiss')
      );
  }

  // tslint:disable-next-line: typedef
  public openDialog() {
    if (this.authService.currentUser) {
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
