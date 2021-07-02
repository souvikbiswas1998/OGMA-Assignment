import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { isFutureTime, matchPassword } from '../functions/validators.functions';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

// tslint:disable: max-line-length
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[A-Za-z\ \.\']*$'), Validators.required]),
    lastName: new FormControl('', [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[A-Za-z\ \.\']*$'), Validators.required]),
    dateOfBirth: new FormControl('', [isFutureTime(new Date()), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.maxLength(16),
    Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
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
      return;
    }
    const user: User = {
      name: userdata.name,
      phoneNo: userdata.phone,
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
