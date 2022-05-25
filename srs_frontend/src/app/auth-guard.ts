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
    if (!this.jwtService.isTokenExpired()) {
      return true;
    }

    return this.router.parseUrl('');
  }
}
