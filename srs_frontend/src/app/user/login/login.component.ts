import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email,]),
    password: new FormControl('', [Validators.required,]),
  });

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  async login() {
    if (!this.form.valid) return;

    try {
      const result = await this.apiService.login({
        email: this.form.value.email,
        password: this.form.value.password,
      });
      this.jwtService.saveToken(result.token);
      const user = this.jwtService.decodeToken();
      console.log("user", user);
      // if (user.role === "lecturer" && user.activated == false) {
      //   this.router.navigateByUrl("/users/dashboard")
      // } else {
      //   this.router.navigateByUrl("/users/user-info")
      // }
      this.router.navigateByUrl("dashboard");
    } catch (error) {
      return console.error('passwort ist falsch');
    }
  }
}
