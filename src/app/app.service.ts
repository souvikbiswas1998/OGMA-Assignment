import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private snackbar: MatSnackBar) { }

  public showSpinner = false;
  public isFirstTime = true;

  // tslint:disable: typedef
  public openSnackBar(message: string, action: string = 'Dismiss', duration: number = 3000) {
    this.snackbar.open(message, action, { duration });
  }
}
