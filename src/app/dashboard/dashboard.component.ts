import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
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
  // tslint:disable-next-line: variable-name
  private _posts: Post[] = [];

  // MatPaginator Inputs
  length = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [16];

  // MatPaginator Output
  pageEvent: PageEvent;
  pageEventSubject: Subject<PageEvent> = new Subject();

  // tslint:disable-next-line: typedef
  public setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private postService: PostService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => this.isLogin = Boolean(user));
    this.postService.getPosts().subscribe((posts) => {
      this._posts = posts;
      this._posts.push(...this._posts);
      this._posts.push(...this._posts);
      this._posts.push(...this._posts);
      this._posts.push(...this._posts);
      this.length = this._posts.length;
      this.posts = this._posts.slice(0, this.pageSize);
      this.pageSize = 16;
    });

    this.pageEventSubject.subscribe(pageEvent => {
      const x = pageEvent.pageSize * pageEvent.pageIndex;
      this.posts = this._posts.slice(x, x + pageEvent.pageSize);
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
