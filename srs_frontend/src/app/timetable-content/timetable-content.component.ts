import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CalendarEvent } from 'angular-calendar';
import { ICourse, IUser } from 'src/model/api';
import { ApiService } from '../services/api.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-timetable-content',
  templateUrl: './timetable-content.component.html',
  styleUrls: ['./timetable-content.component.scss']
})
export class TimetableContentComponent implements OnInit {

  viewDate = new Date();
  events: CalendarEvent[] = [];
  courses: ICourse[] = [];

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  async ngOnInit(): Promise<void> {
    this.courses = await this.apiService.getCoursesForUser(this.jwtService.getToken);
    for (const course of this.courses) {
      
    }

  }
}
