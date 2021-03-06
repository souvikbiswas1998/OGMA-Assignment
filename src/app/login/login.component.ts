import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.maxLength(20),
    Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
    Validators.required]),
  });

  constructor(private appService: AppService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  public onLoginClick(user: any) {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.appService.openSnackBar('Please rectify the errors on the form.', '');
      return;
    }
    // tslint:disable-next-line: max-line-length
    this.authService.loginWithEmail(user.email, user.password).then(() => { this.appService.openSnackBar('Login Successful', ''); this.appService.isFirstTime = true; })
      .catch((error) => { this.appService.openSnackBar(error.message, 'Dismiss'); });
  }

}
