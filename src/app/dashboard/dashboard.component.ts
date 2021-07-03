import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AppService } from '../app.service';
import { Post } from '../models/post';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
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

  public posts: Post[] = [];

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private postService: PostService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => this.isLogin = Boolean(user));
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts;
      this.posts.push(...this.posts);
      this.posts.push(...this.posts);
      this.posts.push(...this.posts);
      this.posts.push(...this.posts);
    });
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

      dialogRef.afterClosed().subscribe((result: Post) => {
        result.time = new Date();
        this.postService.addEditPost(result).then(() => this.appService.openSnackBar('Posted successfully.', 'Dismiss'))
        .catch(error => this.appService.openSnackBar(error.message, 'Dismiss'));
      });
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }
}
