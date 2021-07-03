import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
// tslint:disable: no-inferrable-types
export class DashboardComponent implements OnInit {
  public searchedTerm: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
