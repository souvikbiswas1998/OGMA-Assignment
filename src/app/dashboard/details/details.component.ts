import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/firestore';
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
  public post: Post;
  public currentUser: User;
  // tslint:disable-next-line: variable-name
  private _postSubs: Subscription;
  private paramSubs: Subscription;
  // tslint:disable-next-line: variable-name
  private _user: Subscription;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private postService: PostService,
    public dialog: MatDialog,
    private aRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this._postSubs?.unsubscribe();
    this.paramSubs?.unsubscribe();
    this._user?.unsubscribe();
  }

  ngOnInit(): void {
    this._user = this.authService.user.subscribe((user) => { this.currentUser = user; this.appService.isFirstTime = false; });
    // this.currentUser = this.authService.currentUser;
    this.paramSubs = this.aRoute.params.subscribe(data => {
      this._postSubs = this.postService.getPost(data.id).subscribe(post => {
        if (!post) { this.router.navigate(['/pages/404']); this.appService.openSnackBar('No Post Found'); }
        this.post = post;
      });
    }, (err) => {console.log(err); });
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
        // tslint:disable-next-line: no-unused-expression
        if (!result) { return; }
        result.id = this.post.id;
        result.time = new Date();
        this.postService.addEditPost(result).then(() => this.appService.openSnackBar('Posted successfully.', 'Dismiss'))
        .catch(error => this.appService.openSnackBar(error.message, 'Dismiss'));
      });
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }

  public delete(): void {
    if (this.authService.currentUser && this.authService.currentUser.uid === this.post.authorId) {
      this.postService.deletePost(this.post.id, this.post?.thumbnail, this.post.isTrash).then(() => this.appService.openSnackBar('Post deleted successfully.', 'Dismiss'));
      this.router.navigate(['/dashboard']);
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }

  public trash(): void {
    if (this.authService.currentUser && this.authService.currentUser.uid === this.post.authorId) {
      this.postService.trashPost(this.post.id).then(() => this.appService.openSnackBar('Post will be deleted after 30 days.', 'Dismiss'));
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }

  public removeTrash(): void {
    if (this.authService.currentUser && this.authService.currentUser.uid === this.post.authorId) {
      this.postService.addEditPost({
        id: this.post.id,
        isTrash: false,
        isTrashDate: firebase.firestore.FieldValue.delete() as any
      }, this.post.isTrash).then(() => {
        this.appService.openSnackBar('Post reuploaded.', 'Dismiss');
        this.post.isTrash = false;
      });
    } else {
      this.appService.openSnackBar('You have to logged in first.', 'Dismiss');
    }
  }
}
