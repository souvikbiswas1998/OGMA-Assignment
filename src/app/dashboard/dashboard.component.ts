import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
// tslint:disable: no-inferrable-types
export class DashboardComponent implements OnInit {
  public searchedTerm: string = '';

  constructor(private authService: AuthService, private appService: AppService) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.authService.SignOut().then(() => this.appService.openSnackBar('Logged out successfully', 'Dismiss'))
  }

  public create(): void {

  }
}
