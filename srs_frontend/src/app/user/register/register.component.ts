import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { sha256 } from 'sha.js';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  surnameFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  passwordFormControl = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
  confirmPasswordFormControl = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
  roleFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  samePassword(control: FormControl): boolean {
    const password = this.passwordFormControl.value;
    const controlValue = control.value

    if (password !== controlValue) {
      return false;
    } else {
      return true;
    }
  }


  constructor(private httpClient: HttpClient, private router: Router, private userService: UserService) { }

  sleep(millis: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => resolve(), millis);
    });
  }

  async register() {
    const name = this.nameFormControl.value;
    const surname = this.surnameFormControl.value;
    const email = this.emailFormControl.value;
    const password = this.confirmPasswordFormControl.value;
    const role = this.roleFormControl.value;
    

    const hasher = new sha256();
    const hashedPassword = hasher.update(password).digest("hex")

    this.userService.user = {
      "password": hashedPassword,
      "name": name,
      "surname": surname,
      "email": email,
      "role": role,
      "activated": false
    }

    if (this.emailFormControl.valid && this.nameFormControl.valid && this.passwordFormControl.valid && this.confirmPasswordFormControl.value === this.passwordFormControl.value) {
      await firstValueFrom(this.httpClient.post('http://localhost:3000/user', this.userService.user));
      this.router.navigateByUrl("/dashboard")
    } else
      console.error('irgendwas stimmt nicht!');
  };

}
