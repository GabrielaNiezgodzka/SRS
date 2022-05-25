import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { IUser } from 'src/model/api';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private jwtHelperService: JwtHelperService) { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  decodeToken(): IUser {
    const token = this.getToken();
    if (!token) throw new Error('No token!');

    return this.jwtHelperService.decodeToken(token);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    return this.jwtHelperService.isTokenExpired(token);
  }
}
