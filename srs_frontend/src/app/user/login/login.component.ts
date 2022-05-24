import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { sha256 } from 'sha.js';
import { UserService } from 'src/app/services/user.service';

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

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  matcher = new MyErrorStateMatcher();

  constructor(private httpClient: HttpClient, private router: Router, private userService: UserService) { }

  async login() {
    const hasher = new sha256();
    const password = this.passwordFormControl.value;
    const hashedPassword = hasher.update(password).digest('hex');

    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      let user: any = await firstValueFrom(this.httpClient.get('http://localhost:3000/user/' + this.emailFormControl.value));
      this.userService.user = {
        ...user
      }
      if (this.userService.user.password === hashedPassword) {
        if (user.role === "lecturer" && user.activated == false) {
          this.router.navigateByUrl("/users/dashboard")
        } else {
          this.router.navigateByUrl("/users/user-info")
        }
      } else {
        return console.error('passwort ist falsch');
      }
    }
  }

}
