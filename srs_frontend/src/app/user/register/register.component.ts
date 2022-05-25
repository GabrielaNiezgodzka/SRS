import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { JwtService } from 'src/app/services/jwt.service';
import { IRegisterUserData } from 'src/model/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      role: new FormControl('', [Validators.required]),
    },
    { validators: this.checkPasswords },
  );


  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private router: Router,
  ) { }

  checkPasswords(group: AbstractControl): ValidationErrors | null {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value;
    return pass === confirmPass ? null : { passwordsNotMatching: true };
  }

  async register() {
    if (!this.form.valid) return;

    const user: IRegisterUserData = {
      email: this.form.value.email,
      name: this.form.value.name,
      surname: this.form.value.surname,
      password: this.form.value.password,
      role: this.form.value.role
    };

    const response = await this.apiService.register(user);
    this.jwtService.saveToken(response.token);

    console.log("user", this.jwtService.decodeToken());

    this.router.navigateByUrl("/dashboard")
  }

  get email() { return this.form.get('email')!; }
  get name() { return this.form.get('name')!; }
  get surname() { return this.form.get('surname')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }
  get role() { return this.form.get('role')!; }
}
