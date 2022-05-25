import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtService } from './services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private router: Router,
  ) { }

  canActivate(): boolean | UrlTree {
    let isLoggedIn = false;
    if (this.jwtService.getToken != null && !this.jwtService.isTokenExpired()) {
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
    }
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/landing']);
      return false;
    }
  }
}
