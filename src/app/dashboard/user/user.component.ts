import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  paramSubs: any;
  // tslint:disable: variable-name
  _postSubs: any;
  post: any;

  constructor(private appService: AppService, private postService: PostService, private authService: AuthService, private aRoute: ActivatedRoute) { }

  ngOnDestroy(): void {
    this._postSubs?.unsubscribe();
    this.paramSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.paramSubs = this.aRoute.params.subscribe(data => {
      console.log(data);
      
      // this._postSubs = this.postService.getPostByUser(data.id).subscribe(post => {
      //   this.post = post;
      // });
    });
  }

}
