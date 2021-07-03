import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { isFutureTime, isPastTime, matchPassword } from '../functions/validators.functions';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

// tslint:disable: max-line-length
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  // regex = `^(?=.*[0-9]{2})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,16}$`;
  regex = `^(?=(?:\D*\d){2})(?=.*[A-Z])(?=.*[A-Z])[a-zA-Z0-9](?=.*[#$^+=!*()@%&]).{8,16}`; // final regex pattern
  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[A-Za-z\ \.\']*$'), Validators.required]),
    lastName: new FormControl('', [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[A-Za-z\ \.\']*$'), Validators.required]),
    dateOfBirth: new FormControl('', [isFutureTime(new Date()), isPastTime(new Date((new Date()).setFullYear(1989, 11, 31))), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@gmail.com$')]),
    password: new FormControl('', [Validators.minLength(8), Validators.maxLength(16),
    Validators.pattern('^(?=(?:[^0-9]*[0-9]){2})(?=.*[A-Z])(?=.*[A-Z])[a-zA-Z0-9](?=.*[#$^+=!*()@%&]).{8,16}$'),
    // Validators.pattern(this.regex),
    Validators.required, matchPassword]),
    repeatPassword: new FormControl('', [matchPassword, Validators.required])
  });

  constructor(private appService: AppService, private authService: AuthService) { }

  ngOnInit(): void {
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
      dateOfBirth: userdata.dateOfBirth,
      email: userdata.email,
      password: userdata.password
    };
    this.authService.signUp(user).then(() => {
      if (this.form.valid) {
        this.appService.openSnackBar('User Registered Successfully', '');
      }
    })
      .catch((error) => { console.error(error); this.appService.openSnackBar(error.message, 'Dismiss'); });
  }
}
