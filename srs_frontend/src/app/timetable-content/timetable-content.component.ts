import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ICourse } from 'src/model/api';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-timetable-content',
  templateUrl: './timetable-content.component.html',
  styleUrls: ['./timetable-content.component.scss']
})
export class TimetableContentComponent implements OnInit {

  viewDate = new Date();
  events: CalendarEvent[] = [];
  courses: ICourse[] = [];

  constructor(private apiService: ApiService) { }

  async ngOnInit(): Promise<void> {
    this.courses = await this.apiService.getCoursesForUser();
    this.updateEvents();
  }

  previousWeek(): void {
    this.viewDate = new Date(this.viewDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.updateEvents();
  }

  nextWeek(): void {
    this.viewDate = new Date(this.viewDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.updateEvents();
  }

  weekStart(date: Date): Date {
    return new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
  }

  updateEvents(): void {
    this.events = [];
    for (const course of this.courses) {
      const courseStartDate = this.weekStart(this.viewDate);
      courseStartDate.setDate(courseStartDate.getDate() + course.day);
      courseStartDate.setHours(course.startTime.hour);
      courseStartDate.setMinutes(course.startTime.minutes);
      courseStartDate.setSeconds(0);
      courseStartDate.setMilliseconds(0);

      if (courseStartDate.getTime() < new Date(course.startDate).getTime()
        || courseStartDate.getTime() > new Date(course.endDate).getTime()) {
        continue;
      }

      const courseEndDate = new Date(courseStartDate.getTime());
      courseEndDate.setHours(course.endTime.hour);
      courseEndDate.setMinutes(course.endTime.minutes);

      this.events.push({
        title: course.course,
        start: courseStartDate,
        end: courseEndDate,
        color: {
          primary: '#e3bc08',
          secondary: '#FDF1BA'
        }
      });
    }
  }
}