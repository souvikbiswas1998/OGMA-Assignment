import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Post } from 'src/app/models/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  paramSubs: any;
  posts: Post[];
  public searchedTerm = '';

  // MatPaginator Inputs
  public length = 0;
  public pageSize = 0;
  public pageSizeOptions: number[] = [15];

  // MatPaginator Output
  public pageEventSubject: Subject<PageEvent> = new Subject();
  // tslint:disable: variable-name
  private _postsSubs: Subscription;
  private _user: Subscription;

  public isPagination = false;
  _posts: Post[];

  // tslint:disable-next-line: max-line-length
  constructor(private appService: AppService, private postService: PostService, private aRoute: ActivatedRoute) { }

  ngOnDestroy(): void {
    this._postsSubs?.unsubscribe();
    this.paramSubs?.unsubscribe();
    this.pageEventSubject?.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.showSpinner = true;
    this.paramSubs = this.aRoute.params.subscribe(data => {
      this.postService.getPostByUser(data.id).then((posts) => {
        this._posts = posts;
        this.length = this._posts.length;
        this.pageSize = 15;
        this.posts = this._posts.slice(0, this.pageSize);
        this.isPagination = true;
        this.appService.showSpinner = false;
      });

      this.pageEventSubject.subscribe(pageEvent => {
        const x = pageEvent.pageSize * pageEvent.pageIndex;
        this.posts = this._posts.slice(x, x + pageEvent.pageSize);
      });
      // this._postSubs = this.postService.getPostByUser(data.id).subscribe(posts => {
      //   this.posts = posts;
      // });
    });
  }

}
