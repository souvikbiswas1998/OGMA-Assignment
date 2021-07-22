import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { matchPassword } from 'src/app/functions/validators.functions';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


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

  public from = 0;

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
  fromYear = 0;
  toYear: number;

  constructor(private appService: AppService, private auth: AuthService, public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: { name: this.profile.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.reauthenticate(result.oldPassword).then(() => {
          this.auth.resetPassword(result.password);
          this.appService.openSnackBar('Password updated successfully.', '');
        }).catch(() => this.appService.openSnackBar('Wrong Password or Internal Error.', ''));
      }
    });
  }

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
          });
          this.appService.showSpinner = false;
        });
      }
    });
  }
  public def(): void {
    this.months = [];
    this.levelsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.from = 0;
    this.fromYear = 0;
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
    } else if (date.getFullYear() === date2.getFullYear()) {
      const xyz = x.points[0] ? this.getPoints(x.points[0].points, x.fromPoint.month, date.getMonth() + 1) : null;
      if (xyz) { data.push(...xyz); }
    } else {
      const x2 = x.points.shift();
      const x3 = x.points.pop();
      const abc = this.getPoints(x2.points, x.fromPoint.month);
      if (abc) { data.push(...abc); }
      // tslint:disable: no-shadowed-variable
      x.points.forEach(data2 => {
        data.push(...this.getPoints(data2.points));
      });
      const xyz = x3 ? this.getPoints(x3.points, 0, date.getMonth() + 1) : null;
      if (xyz) { data.push(...xyz); }
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

  private getPoints(points: {month: number, point: number}[], from: number = 0, to: number = 12): any {
    const x = [];
    let y = points.shift();
    let length: number = points.length;
    let count = 0;
    for (let i = from; i < to; i++) {
      if(count > 3) {
        x.push(0);
        // return;
      } else
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
    // delete this.barChart;
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
    // tslint:disable: radix
    this.from = parseInt(this.from as any);
    this.toMonth = parseInt(this.toMonth as any);
    this.barChart.data.labels = this.levelsArr.slice(this.from, this.toMonth + 1);
    this.barChart.data.datasets[0].data = this.chartData.dataSet1.slice(this.from, this.toMonth + 1);
    this.barChart.update();
  }

  applyYearFilter(): void{
    this.fromYear = parseInt(this.fromYear as any);
    this.toYear = parseInt(this.toYear as any);
    this.barChart.data.labels = this.levelsArr.slice(this.fromYear, this.toYear + 1);
    this.barChart.data.datasets[0].data = this.chartData.dataSet1.slice(this.fromYear, this.toYear + 1);
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


  // tslint:disable: member-ordering
  private blob: string;
  public imgUpload = false;

  // tslint:disable: typedef
  public onSelect(files: FileList) {
    this.disable = true;
    if (files && files.length > 0) {
      this.file = files.item(0);
      if (this.file.type !== 'image/jpeg') { this.appService.openSnackBar('Only JPEG images are supported.'); return; }
      this.readFileAsURL(files.item(0))
        .then(blob => {
          this.imgUpload = true;
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

  public upload() {
    if (this.file.size > 10 * 1024 * 1024) {
      this.appService.openSnackBar('Max limit is 10 mb', '');
      return;
    }
    this.profile.photoURL = this.blob;
    const x = this.auth.uploadThumbnail(this.blob);
    x.percentageChanges.then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => { this.profile.photoURL = url; this.disable = false;
      });
    });
    x.percentageChanges.percentageChanges().subscribe((data: any) => {
      this.percentageChanges = data;
      if(this.percentageChanges === 100) this.appService.openSnackBar('Photo updated Successfully.');
    });
  }

  public remove(): void {
    this.auth.deleteStorage(this.profile.photoURL);
    this.imgUpload = false;
    delete this.profile.photoURL;
    this.auth.updateUserData({ uid: this.profile.uid, photoURL: firebase.firestore.FieldValue.delete() as any });
    this.appService.openSnackBar('Photo removed successfully.');
  }

  public someMethod(data: any, isMonth: boolean, index?: number): void {
    if(isMonth && this.toMonth < data) this.toMonth = this.months[data].value;
    else if(this.toYear < data.min) this.toYear = this.years[index].max;
  }
}

// tslint:disable: no-trailing-whitespace
// tslint:disable-next-line: typedef
function GetStaticValue() {
  const x = { fromPoint: {year: 2019, month: 1},
              points: [
                {year: 2019, points: [
                  {month: 6, point: 10},
                  {month: 7, point: 20},
                  {month: 8, point: 15},
                  {month: 9, point: 30}
                ]},
                {year: 2020, points: [
                  {month: 2, point: 10},
                  {month: 4, point: 15},
                  {month: 7, point: 25},
                  {month: 10, point: 30},
                  {month: 11, point: 20}
                ]},
                {year: 2021, points: [
                  {month: 2, point: 10},
                  {month: 3, point: 20},
                  {month: 5, point: 20}
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

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class DialogOverviewExampleDialog {
  public form2: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, @Inject(MAT_DIALOG_DATA) public data, private appService: AppService) {
      this.form2 = new FormGroup({
        password: new FormControl('', [Validators.minLength(8), Validators.maxLength(16),
          Validators.pattern('^(?=(?:[^0-9]*[0-9]){2})(?=.*[A-Z])(?=.*[A-Z])[a-zA-Z0-9](?=.*[#$^+=!*()@%&]).{8,16}$'),
          // Validators.pattern(this.regex),
          Validators.required, matchPassword]),
        repeatPassword: new FormControl('', [matchPassword, Validators.required]),
        oldPassword: new FormControl('', [Validators.required])
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    if (!this.form2.valid) {
      this.appService.openSnackBar('Please rectify the errors on the form.', '');
      this.form2.markAllAsTouched();
      return;
    }
    if (this.form2.value.oldPassword === this.form2.value.password) {
      this.appService.openSnackBar('Old and new password is same.', '');
      return;
    }
    this.dialogRef.close(this.form2.value);
  }
}
