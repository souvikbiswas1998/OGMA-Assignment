import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Post } from '../models/post';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { AddEditPostComponent } from '../shared/add-edit-post/add-edit-post.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
// tslint:disable: no-inferrable-types
export class DashboardComponent implements OnInit, OnDestroy {

  public searchedTerm: string = '';
  public isLogin: boolean = false;

  public posts: Post[] = [];
  // tslint:disable-next-line: variable-name
  private _posts: Post[] = [];

  // MatPaginator Inputs
  public length = 0;
  public pageSize = 0;
  public pageSizeOptions: number[] = [15];

  // MatPaginator Output
  public pageEventSubject: Subject<PageEvent> = new Subject();
  // tslint:disable: variable-name
  private _postsSubs: Subscription;
  private _user: Subscription;

  public isPagination: boolean = false;

  public user: User;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private postService: PostService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this._postsSubs?.unsubscribe();
    this.pageEventSubject?.unsubscribe();
    this._user?.unsubscribe();
  }

  ngOnInit(): void {
    this._user = this.authService.isAnyUser.subscribe((val) => {
      this.isLogin = Boolean(val);
      if (this.isLogin) {
        this.authService.getUserDataPromise(val.uid).then((data) => this.user = data);
      }
    });
    this._postsSubs = this.postService.getPosts().subscribe((posts) => {
      this._posts = posts;
      this.length = this._posts.length;
      this.pageSize = 15;
      this.posts = this._posts.slice(0, this.pageSize);
      this.isPagination = true;
    });

    this.pageEventSubject.subscribe(pageEvent => {
      const x = pageEvent.pageSize * pageEvent.pageIndex;
      this.posts = this._posts.slice(x, x + pageEvent.pageSize);
    });
  }

  // tslint:disable-next-line: member-ordering
  private isTest: boolean = false;
  public check(): void {
    this.isTest = !this.isTest;
    if (this.isTest) {
      this._posts.push(...this._posts);
      this._posts.push(...this._posts);
      this.length = this._posts.length;
      this.posts = this._posts.slice(0, this.pageSize);
    } else {
      this._postsSubs?.unsubscribe();
      this.isPagination = false;
      this._postsSubs = this.postService.getPosts().subscribe((posts) => {
        this._posts = posts;
        this.length = this._posts.length;
        this.posts = this._posts.slice(0, this.pageSize);
        this.isPagination = true;
      });
    }
  }

  public logout(): void {
    this.authService
      .SignOut()
      .then(() => {
        this.isLogin = false;
        this.appService.openSnackBar('Logged out successfully', 'Dismiss');
      });
  }

  // tslint:disable-next-line: typedef
  public openDialog() {
    if (this.authService.currentUser) {
      const dialogRef = this.dialog.open(AddEditPostComponent);

      dialogRef.afterClosed().subscribe((result: Post) => {
        // tslint:disable-next-line: no-unused-expression
        if (!result) { return; }
        result.time = new Date();
        this.postService.addEditPost(result).then(() => this.appService.openSnackBar('Posted successfully.', 'Dismiss'))
        .catch(error => this.appService.openSnackBar(error.message, 'Dismiss'));
      });
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }

  public login(): void {
    this.router.navigate(['/login']);
  }
}
