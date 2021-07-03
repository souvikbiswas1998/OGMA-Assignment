import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Post } from 'src/app/models/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { AddEditPostComponent } from 'src/app/shared/add-edit-post/add-edit-post.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private postService: PostService,
    public dialog: MatDialog,
    private aRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(data => {
      this.postService.getPost(data.id).subscribe(post => {
        console.log(post);
      });
    });
  }

  // tslint:disable-next-line: typedef
  public edit() {
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
