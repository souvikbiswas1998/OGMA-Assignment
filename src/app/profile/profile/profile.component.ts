import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  public profile: User;
  // tslint:disable-next-line: variable-name
  private _user: any;

  constructor(private auth: AuthService) { }

  ngOnDestroy(): void {
    this._user?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.auth.currentUser) { this.profile = this.auth.currentUser; }
    else {
      this._user = this.auth.isAnyUser.subscribe((val) => {
        if (Boolean(val)) {
          this.auth.getUserDataPromise(val.uid).then((data) => this.profile = data);
        }
      });
    }
  }

}
