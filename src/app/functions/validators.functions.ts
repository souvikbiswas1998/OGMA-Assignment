import { AbstractControl, ValidatorFn } from '@angular/forms';
import { timeStringToDate } from './date-time.functions';
import { firestoreDate } from './firebase.functions';

export const matchPassword = (c: AbstractControl) => {
  const p1 = c.root.get('password');
  const p2 = c.root.get('repeatPassword');
  if (p1 && p2) {
    // tslint:disable-next-line: triple-equals
    if (p1.value != p2.value) {
      p2.setErrors({ notMatched: true });
      if (c === p2) { return { notMatched: true }; }
      return (null);
    }
    if (c === p1) { p2.setErrors(null); }
  }
  return null;
};

export const isFutureTime = (date: Date): ValidatorFn => {
  return (control: AbstractControl): { futureTime: boolean } => {
    // tslint:disable-next-line: curly
    if (control.value && new Date(control.value) > date) return { futureTime: true };
    else { return null; }
  };
};

export const isPastTime = (date: Date): ValidatorFn => {
  console.log(date);
  
  return (control: AbstractControl): { pastTime: boolean } => {
    // tslint:disable-next-line: curly
    if (control.value && new Date(control.value) < date) return { pastTime: true };
    else { return null; }
  };
};
