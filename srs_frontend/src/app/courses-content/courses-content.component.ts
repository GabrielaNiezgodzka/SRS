import { Component, Inject, OnInit } from '@angular/core';
import { ICourse } from 'src/model/api';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  course: string;
  day: number;
  location: string;
  lecturer: string;
}

@Component({
  selector: 'app-courses-content',
  templateUrl: './courses-content.component.html',
  styleUrls: ['./courses-content.component.scss']
})

export class CoursesContentComponent implements OnInit {

  displayedColumns: string[] = ['course', 'day', 'time', 'location', 'timeperiod', 'lecturer', 'students', 'button'];
  dataSource: ICourse[] = [];
  course: string = "";
  day: number = 0;
  location: string = "";
  lecturer: string = "";

  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.dataSource = await this.apiService.getCourses();

    console.log(this.dataSource);
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(CreateCourseDialog, {
      width: '450px',
      data: {course: this.course, day: this.day, location: this.location, lecturer: this.lecturer},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.course = result;
    });
  }

  formatDay(course: ICourse) {
    return ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][course.day]
  }

  formatTime(course: ICourse) {
    let startHour: number = course.startTime.hour;
    let startMinute: number = course.startTime.minutes;
    let startTime = startHour.toString().padStart(2, "0") + ":" + startMinute.toString().padStart(2, "0");

    let endHour: number = course.endTime.hour;
    let endMinute: number = course.endTime.minutes;
    let endTime = endHour.toString().padStart(2, "0") + ":" + endMinute.toString().padStart(2, "0");

    return startTime + " - " + endTime;
  }

  formatDate(course: ICourse) {
    let startDate = new Date(course.startDate).toLocaleDateString("de-DE");
    let endDate = new Date(course.endDate).toLocaleDateString("de-DE");
    return startDate + " - " + endDate;
  }
}

@Component({
  selector: 'create-course-dialog',
  templateUrl: 'create-course-dialog.html',
})
export class CreateCourseDialog {

  form = new FormGroup(
    {
      course: new FormControl('', [Validators.required, Validators.minLength(3)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      role: new FormControl('', [Validators.required]),
    }
  );

  constructor(
    public dialogRef: MatDialogRef<CreateCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}