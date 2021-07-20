import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { matchPassword } from 'src/app/functions/validators.functions';
import firebase from 'firebase/app';
import 'firebase/firestore';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  public profile: User;
  // tslint:disable: variable-name
  private _user: any;

  private barChart;
  private levelsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public months;

  public from = '0';

  public toMonth;

  private chartData = {
    dataSet1 : []
  };

  public form: FormGroup;

  public file: any;
  public disable = false;

  public percentageChanges = 0;
  public test = false;
  years: any[];
  fromYear = '0';
  toYear: string;

  constructor(private appService: AppService, private auth: AuthService) { }

  ngOnDestroy(): void {
    this._user?.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.showSpinner = true;
    this._user = this.auth.isAnyUser.subscribe((val) => {
      if (Boolean(val)) {
        this.auth.getUserDataPromise(val.uid).then((data) => {
          data.uid = val.uid;
          this.profile = data;
          this.def();
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
  public def(): void {
    this.months = [];
    this.levelsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.from = '0';
    this.fromYear = '0';
    this.toMonth = undefined;
    this.toYear = undefined;
    this.chartData = {
      dataSet1 : []
    };
    const x = (this.test) ? GetStaticValue() : this.profile?.points;
    // const x = GetStaticValue();
    const y = this.levelsArr;
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    const date2 = new Date(x?.fromPoint?.year, x?.fromPoint?.month, 1);
    this.levelsArr = [];
    if (!x) { return; }
    if (+date === +date2) {
      const shortMonth = date.toLocaleString('en-us', { month: 'short' });
      this.levelsArr.push(shortMonth + ' ' + x.fromPoint.year);
    } else if (date.getFullYear() === x.fromPoint.year) {
      this.levelsArr.push(...this.getYearMonth(x.fromPoint.month, x.fromPoint.year, 'between', date.getMonth()));
    } else {
      this.levelsArr = this.getYearMonth(x.fromPoint.month, x.fromPoint.year, 'after');
      for (let i = x.fromPoint.year + 1; i < 2021; i++) {
        this.levelsArr.push(...y.map(m => m + ' ' + i));
      }
      this.levelsArr.push(...this.getYearMonth(date.getMonth(), date.getFullYear(), 'before'));
    }
    let z = 0;
    this.years = [];
    if (this.levelsArr.length > 1) {
      let index = 0;
      this.years.push({year: this.levelsArr[0].slice(4), min: 0, max: 0});
      for (let i = 1; i < this.levelsArr.length; i++)
      {
        const data1 = this.levelsArr[i].slice(4);
        const data2 = this.levelsArr[i - 1].slice(4);
        if (data1 === data2) { this.years[index].max += 1; }
        else {this.years.push({year: data1, min: i, max: i}); index++; }
      }
    } else { this.years.push({year: this.levelsArr[0].slice(4), min: 0, max: 0}); }

    this.months = this.levelsArr.map(m => {const ab =  {month: m, value: z}; z++; return ab; }) as any;
    this.toMonth = this.months.length - 1;
    this.toYear = this.months[this.months.length - 1].value;
    const data: any[] = [];
    if (+date === +date2) {
      data.push((x.points && x.points[0].points && x.points[0].points[0].point) ? x.points[0].points[0].point : 0);
    } else {
      // tslint:disable: no-shadowed-variable
      x.points.forEach(data2 => {
        data.push(...this.getPoints(data2.points, x.fromPoint.month));
      });
    }
    this.chartData.dataSet1 = data;
    this.abc();
  }

  private getYearMonth(month: number, year: number, arg2: string, toMonth?: number): string[] {
    let x = [];
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

    if (arg2 === 'between') {
      if (toMonth > -1) x.push('Jan '+year);
      if (toMonth > 0) x.push('Feb '+year);
      if (toMonth > 1) x.push('Mar '+year);
      if (toMonth > 2) x.push('Apr '+year);
      if (toMonth > 3) x.push('May '+year);
      if (toMonth > 4) x.push('Jun '+year);
      if (toMonth > 5) x.push('Jul '+year);
      if (toMonth > 6) x.push('Aug '+year);
      if (toMonth > 7) x.push('Sep '+year);
      if (toMonth > 8) x.push('Oct '+year);
      if (toMonth > 9) x.push('Nov '+year);
      if (toMonth > 10) x.push('Dec '+year);
      x = x.slice(month--);
    }
    return x;
  }

  private getPoints(points: {month: number, point: number}[], from: number = 0): any {
    const x = [];
    let y = points.shift();
    let length: number = points.length;
    let count = 0;
    for (let i = from; i < 12; i++) {
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
    delete this.barChart;
    if(this.test) {
      this.barChart = new Chart('bar1', {
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
    else this.barChart = new Chart('bar', {
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

  applyYearFilter(): void{
    // tslint:disable-next-line: radix
    this.barChart.data.labels = this.levelsArr.slice(parseInt(this.fromYear), parseInt(this.toYear) + 1);
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
    this.auth.resetPassword(user.password);
    delete user.password;
    this.auth.updateUserData(user).then(() => {
      if (this.form.valid) {
        this.appService.openSnackBar('User Updated Successfully', '');
      }
    })
      .catch((error) => { console.error(error); this.appService.openSnackBar(error.message, 'Dismiss'); });
  }


  // tslint:disable: member-ordering
  private blob: string;

  // tslint:disable-next-line: typedef
  public onSelect(files: FileList) {
    this.disable = true;
    if (files && files.length > 0) {
      this.file = files.item(0);
      this.readFileAsURL(files.item(0))
        .then(blob => {
          this.blob = blob;
          this.upload();
        })
        .catch(error => this.appService.openSnackBar('Error opening file: ' + error.message, ''));
    }
  }

  private async readFileAsURL(file: File | Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => resolve(event.target.result as any);
      reader.onerror = error => reject(error);
    });
  }

  // tslint:disable-next-line: typedef
  public upload() {
    if (this.file.size > 10 * 1024 * 1024) {
      this.appService.openSnackBar('Max limit is 10 mb', '');
      return;
    }
    const x = this.auth.uploadThumbnail(this.blob);
    this.disable = false;
    x.percentageChanges.percentageChanges().subscribe((data: any) => {
      this.percentageChanges = data;
      if(this.percentageChanges === 100) this.appService.openSnackBar('Photo updated Successfully.');
    });
  }

  public remove(): void {
    delete this.profile.photoURL;
    this.auth.updateUserData({ uid: this.profile.uid, photoURL: firebase.firestore.FieldValue.delete() as any });
  }
}

// tslint:disable: no-trailing-whitespace
// tslint:disable-next-line: typedef
function GetStaticValue() {
  const x = { fromPoint: {year: 2019, month: 1},
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
