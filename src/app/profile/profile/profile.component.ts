import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  public profile: User;
  // tslint:disable: variable-name
  private _user: any;

  lessThanOrGreaterThan = 'lessThan';
  filterLimit = 100;
  barChart;
  levelsArr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug'];
  months = [{month: 'Jan', value: '0'},
  {month: 'Feb', value: '1'},
  {month: 'Mar', value: '2'},
  {month: 'Apr', value: '3'},
  {month: 'May', value: '4'},
  {month: 'Jun', value: '5'},
  {month: 'Jul', value: '6'},
  {month: 'Aug', value: '7'}];

  from = '0';

  toMonth = '7';

  chartData = {
    dataSet1 : Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10)
  };

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
          this.abc();
        }
      });
    }
  }


  private abc(): void {
    this.barChart = new Chart('bar', {
      type: 'bar',
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Your Points',
        },
      },
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug'],
        datasets: [
          {
            type: 'bar',
            label: 'Point',
            data: this.chartData.dataSet1,
            backgroundColor: 'blue',
            borderColor: 'blue',
            fill: false,
          }
        ]
      }
    });
  }

  applyDateFilter(): void{
    // tslint:disable-next-line: radix
    this.barChart.data.labels = this.levelsArr.slice(parseInt(this.from), parseInt(this.toMonth) + 1);
    this.barChart.update();
  }

}

  // removeData(chart): void {
  //   chart.data.labels.pop();
  //   chart.data.datasets.forEach((dataset) => {
  //     dataset.data.pop();
  //   });
  //   chart.update();
  // }

  // updateChartData(chart, data, dataSetIndex): void {
  //   chart.data.datasets[dataSetIndex].data = data;
  //   chart.update();
  // }
