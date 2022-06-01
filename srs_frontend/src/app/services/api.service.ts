import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ICourse, ILoginRequest, ILoginResponse, IRegisterUserData, IUser } from 'src/model/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getCourses() {
    return firstValueFrom(this.httpClient.get<ICourse[]>('http://localhost:3000/api/courses'));
  }

  register(data: IRegisterUserData) {
    return firstValueFrom(this.httpClient.post<ILoginResponse>('http://localhost:3000/register', data));
  }

  addCourse(data: ICourse) {
    return firstValueFrom(this.httpClient.post('http://localhost:3000/api/addcourse', data));
  }

  editCourse(data: ICourse) {
    return firstValueFrom(this.httpClient.post('http://localhost:3000/api/editcourse', data));
  }

  deleteCourse(data: any) {
    return firstValueFrom(this.httpClient.post('http://localhost:3000/api/deletecourse', data));
  }

  sendEmail(data: any) {
    return firstValueFrom(this.httpClient.post('http://localhost:3000/api/sendemail', data ));
  }

  addStudent(data: any) {
    return firstValueFrom(this.httpClient.post('http://localhost:3000/api/addstudent', data));
  }

  login(data: ILoginRequest) {
    return firstValueFrom(this.httpClient.post<ILoginResponse>('http://localhost:3000/login', data));
  }
}
