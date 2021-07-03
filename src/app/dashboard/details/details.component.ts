import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { AddEditPostComponent } from 'src/app/shared/add-edit-post/add-edit-post.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  post: Post;
  currentUser: User;
  // tslint:disable-next-line: variable-name
  private _postSubs: Subscription;
  private paramSubs: Subscription;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private postService: PostService,
    public dialog: MatDialog,
    private aRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this._postSubs?.unsubscribe();
    this.paramSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.paramSubs = this.aRoute.params.subscribe(data => {
      this._postSubs = this.postService.getPost(data.id).subscribe(post => {
        this.post = post;
      });
    });
  }

  // tslint:disable-next-line: typedef
  public edit() {
    if (this.authService.currentUser && this.authService.currentUser.uid === this.post.authorId) {
      const dialogRef = this.dialog.open(AddEditPostComponent, {
        data: {
          post: this.post
        },
      });

      dialogRef.afterClosed().subscribe((result: Post) => {
        result.id = this.post.id;
        result.time = new Date();
        this.postService.addEditPost(result).then(() => this.appService.openSnackBar('Posted successfully.', 'Dismiss'))
        .catch(error => this.appService.openSnackBar(error.message, 'Dismiss'));
      });
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }
}
