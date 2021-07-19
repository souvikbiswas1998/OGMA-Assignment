import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { isFutureTime, isPastTime, matchPassword } from 'src/app/functions/validators.functions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  public profile: User;
  // tslint:disable: variable-name
  private _user: any;

  barChart;
  levelsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months;

  from = '0';

  toMonth;

  chartData = {
    dataSet1 : Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10)
  };

  form: FormGroup;

  constructor(private appService: AppService, private auth: AuthService) { }

  ngOnDestroy(): void {
    this._user?.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.showSpinner = true;
    this._user = this.auth.isAnyUser.subscribe((val) => {
      if (Boolean(val)) {
        this.auth.getUserDataPromise(val.uid).then((data) => {
          this.def();
          this.abc();
          data.uid = val.uid;
          this.profile = data;
          const x = data.name.lastIndexOf(' ');
          this.form = new FormGroup({
            // tslint:disable: max-line-length
            firstName: new FormControl(data.name.slice(0, x), [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[A-Za-z\ \.\']*$'), Validators.required]),
            lastName: new FormControl(data.name.slice(x + 1), [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[A-Za-z\ \.\']*$'), Validators.required]),
            email: new FormControl({value: data.email, disabled: true}),
            password: new FormControl('', [Validators.minLength(8), Validators.maxLength(16),
            Validators.pattern('^(?=(?:[^0-9]*[0-9]){2})(?=.*[A-Z])(?=.*[A-Z])[a-zA-Z0-9](?=.*[#$^+=!*()@%&]).{8,16}$'),
            // Validators.pattern(this.regex),
            Validators.required, matchPassword]),
            repeatPassword: new FormControl('', [matchPassword, Validators.required])
          });
          this.appService.showSpinner = false;
        });
      }
    });
  }
  private def(): void {
    const x = GetStaticValue();
    const y = this.levelsArr;
    this.levelsArr = [];
    this.levelsArr = this.getYearMonth(x.from.month, x.from.year, 'after');
    for (let i = x.from.year + 1; i < 2021; i++) {
      this.levelsArr.push(...y.map(m => m + ' ' + i));
    }
    this.levelsArr.push(...this.getYearMonth(6, 2021, 'before'));
    let z = 0;

    this.months = this.levelsArr.map(m => {const ab =  {month: m, value: z}; z++; return ab; }) as any;
    this.toMonth = this.months.length - 1;
    const data: any[] = [];
    // tslint:disable-next-line: no-shadowed-variable
    x.points.forEach(data2 => {
      data.push(...this.getPoints(data2.points));
    });
    this.chartData.dataSet1 = data;
  }

  private getYearMonth(month: number, year: number, arg2: string): string[] {
    const x = [];
    if (arg2 === 'before') {
      // tslint:disable: whitespace
      // tslint:disable: curly
      if (month > -1) x.push('Jan '+year);
      if (month > 0) x.push('Feb '+year);
      if (month > 1) x.push('Mar '+year);
      if (month > 2) x.push('Apr '+year);
      if (month > 3) x.push('May '+year);
      if (month > 4) x.push('Jun '+year);
      if (month > 5) x.push('Jul '+year);
      if (month > 6) x.push('Aug '+year);
      if (month > 7) x.push('Sep '+year);
      if (month > 8) x.push('Oct '+year);
      if (month > 9) x.push('Nov '+year);
      if (month > 10) x.push('Dec '+year);
    }
    if (arg2 === 'after') {
      if (month < 12) x.unshift('Dec '+year);
      if (month < 11) x.unshift('Nov '+year);
      if (month < 10) x.unshift('Oct '+year);
      if (month < 9) x.unshift('Sep '+year);
      if (month < 8) x.unshift('Aug '+year);
      if (month < 7) x.unshift('Jul '+year);
      if (month < 6) x.unshift('Jun '+year);
      if (month < 5) x.unshift('May '+year);
      if (month < 4) x.unshift('Apr '+year);
      if (month < 3) x.unshift('Mar '+year);
      if (month < 2) x.unshift('Feb '+year);
      if (month < 1) x.unshift('Jan '+year);
    }
    return x;
  }

  private getPoints(points: {month: number, point: number}[]): any {
    const x = [];
    let y = points.shift();
    let length: number = points.length;
    let count = 0;
    for (let i = 0; i < 12; i++) {
      if(count > 3) {
        x.push(0);
        break;
      }
      if(y.month === i) {
        x.push(y?.point || 0);
        if(points.length > 0) {
        y = points.shift();
        length = points.length;
        } else {count = 4;}
      } else x.push(0);
    }
    return x;
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
        labels: this.levelsArr,
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

  // tslint:disable: typedef
  onsignUp() {
    const userdata = this.form.value;
    if (!this.form.valid) {
      this.appService.openSnackBar('Please rectify the errors on the form.', '');
      this.form.markAllAsTouched();
      return;
    }
    const user: User = {
      name: userdata.firstName + ' ' + userdata.lastName,
      password: userdata.password,
      uid: this.profile.uid
    };
    user.name = user.name.trim();
    this.auth.updateUserData(user).then(() => {
      if (this.form.valid) {
        this.appService.openSnackBar('User Updated Successfully', '');
      }
    })
      .catch((error) => { console.error(error); this.appService.openSnackBar(error.message, 'Dismiss'); });
  }
}

// tslint:disable: no-trailing-whitespace
// tslint:disable-next-line: typedef
function GetStaticValue() {
  const x = { from: {year: 2019, month: 1},
              points: [
                {year: 2019, points: [
                  {month: 6, point: 10},
                  {month: 7, point: 10},
                  {month: 8, point: 10},
                  {month: 9, point: 10}
                ]},
                {year: 2020, points: [
                  {month: 2, point: 10},
                  {month: 4, point: 10},
                  {month: 7, point: 10},
                  {month: 10, point: 10},
                  {month: 11, point: 10}
                ]},
                {year: 2021, points: [
                  {month: 2, point: 10},
                  {month: 3, point: 10}
                ]}
              ]
            };
  return x;
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
