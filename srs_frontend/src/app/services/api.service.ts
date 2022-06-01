import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICourse, ILoginRequest, ILoginResponse, IRegisterUserData, IUser } from 'src/model/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getCourses() {
    return firstValueFrom(this.httpClient.get<ICourse[]>(environment.backendUrl + 'api/courses'));
  }

  getCoursesForUser() {
    return firstValueFrom(this.httpClient.get<ICourse[]>(environment.backendUrl + 'api/getcoursesforuser'));
  }

  register(data: IRegisterUserData) {
    return firstValueFrom(this.httpClient.post<ILoginResponse>(environment.backendUrl + 'register', data));
  }

  addCourse(data: ICourse) {
    return firstValueFrom(this.httpClient.post(environment.backendUrl + 'api/addcourse', data));
  }

  editCourse(data: ICourse) {
    return firstValueFrom(this.httpClient.post(environment.backendUrl + 'api/editcourse', data));
  }

  deleteCourse(data: any) {
    return firstValueFrom(this.httpClient.post(environment.backendUrl + 'api/deletecourse', data));
  }

  sendEmail(data: any) {
    return firstValueFrom(this.httpClient.post(environment.backendUrl + 'api/sendemail', data ));
  }

  addStudent(data: any) {
    return firstValueFrom(this.httpClient.post(environment.backendUrl + 'api/addstudent', data));
  }

  login(data: ILoginRequest) {
    return firstValueFrom(this.httpClient.post<ILoginResponse>(environment.backendUrl + 'login', data));
  }
}
