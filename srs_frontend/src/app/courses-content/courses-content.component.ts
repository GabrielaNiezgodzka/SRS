import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ICourse } from 'src/model/api';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../services/jwt.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { RowContext } from '@angular/cdk/table';

export interface DialogData {
  edit: ICourse | null;
}

@Component({
  selector: 'app-courses-content',
  templateUrl: './courses-content.component.html',
  styleUrls: ['./courses-content.component.scss']
})
export class CoursesContentComponent implements OnInit {

  displayedColumns: string[] = ['course', 'day', 'time', 'location', 'timeperiod', 'lecturer', 'students', 'button'];
  dataSource: ICourse[] = [];
  clickedRows = new Set<ICourse>();
  course: string = "";
  day: number = 0;
  location: string = "";
  lecturer: string = "";

  constructor(private apiService: ApiService, public dialog: MatDialog, private jwtService: JwtService, private _snackBar: MatSnackBar) { }

  get role() {
    return this.jwtService.decodeToken().role;
  }

  get email() {
    return this.jwtService.decodeToken().email;
  }

  async ngOnInit(): Promise<void> {
    this.dataSource = await this.apiService.getCourses();
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(CreateCourseDialog, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.course = result;
    });
  }

  openEditDialog(row: ICourse) {
    this.dialog.open(CreateCourseDialog, {
      width: '450px',
      data: { edit: row } as DialogData,
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

  async addStudentToCourse(row: any) {
    let studentMail = this.email;
    let courseID = row._id;
    let message = ""
    let studentData = {
      _id: courseID,
      student: studentMail
    };

    message = "Sie wurden erfolgreich für den Kurs " + row.course + " angemeldet!";
    await this.apiService.addStudent(studentData)
      .then(() =>
        this.openSnackBar(message, "green-snack-bar"))
      .catch((error) => {
        console.log(error);
        message = "Sie sind bereits für den Kurs " + row.course + " angemeldet!";
        this.openSnackBar(message, "yellow-snack-bar");
      });
    this.reloadTable();
  }

  async reloadTable() {
    this.dataSource = await this.apiService.getCourses();
  }


  openSnackBar(message: string, colorClass: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: [colorClass]
    });
  }

  async deleteCourse(row: any) {
    let courseID = row._id;
    let message = "Der Kurs " + row.course + " wurde erfolgreich gelöscht!";
    let course = {
      _id: courseID
    }
    await this.apiService.deleteCourse(course).then(() =>
      this.openSnackBar(message, "green-snack-bar"))
      .catch((error) => {
        console.log(error);
        message = "Irgendwas ist schief gelaufen";
        this.openSnackBar(message, "red-snack-bar");
      });

    this.sendEmailOnDelete(row);
    this.reloadTable();
  }


  async sendEmailOnDelete(row: any) {
    let courseName = row.course;
    let courseStudentsList = row.students;
    let day = this.formatDay(row);
    let location = row.location;
    let time = this.formatTime(row)
    let date = new Date(row.startDate).toLocaleDateString("de-DE") + " - " + new Date(row.endDate).toLocaleDateString("de-DE");
    let courseLecturer = row.lecturer;

    let subject = "Email aus der Uni - eine deiner Kurse wurde abgesagt";
    let html = "<h3>Hallo, einer deiner Kurse wurde gelöscht.</h3> <p>Hier sind die Informationen:</p> <p>Kursbezeichnung: " + courseName + "</p> <p>Wochentag: " + day + "</p> <p> Uhrzeit: " + time + "</p> <p> Ort: " + location + "</p> <p> Zeitraum: " + date + "</p> <p> Leitung: " + courseLecturer + "</p> <br> <p>Für mehr Informationen wende dich an sekretariat@uni.de</p>"

    const messageData = {
      studentsMails: courseStudentsList,
      subject: subject,
      html: html
    }

    await this.apiService.sendEmail(messageData);
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
      day: new FormControl(),
      location: new FormControl('', [Validators.required, Validators.minLength(3)]),
      startTime: new FormControl(),
      endTime: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      lecturer: new FormControl('', [Validators.required, Validators.minLength(3)]),
    }
  );
  edit: boolean = false;

  async addCourse() {
    let startArr = this.form.value.startTime.split(':');
    let startHour = parseInt(startArr[0]);
    let startMin = parseInt(startArr[1]);

    let endArr = this.form.value.endTime.split(':');
    let endHour = parseInt(endArr[0]);
    let endMin = parseInt(endArr[1]);

    if (!this.form.valid) return;

    const course: ICourse = {
      startTime: {
        hour: startHour,
        minutes: startMin
      },
      endTime: {
        hour: endHour,
        minutes: endMin,
      },
      startDate: this.form.value.startDate.toISOString(),
      endDate: this.form.value.endDate.toISOString(),
      day: this.form.value.day,
      course: this.form.value.course,
      location: this.form.value.location,
      lecturer: this.form.value.lecturer,
      students: []
    };

    await this.apiService.addCourse(course);
    this.dialogRef.close();
    window.location.reload();
  }

  constructor(
    public dialogRef: MatDialogRef<CreateCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiService: ApiService,
  ) {
    if (data?.edit) {
      this.edit = true;
      const { _id, students, ...rest } = data.edit as any;
      rest.startTime = this.formatTime(rest.startTime);
      rest.endTime = this.formatTime(rest.endTime);
      rest.startDate = new Date(rest.startDate);
      rest.endDate = new Date(rest.endDate);
      this.form.setValue(rest);
    }
  }

  formatTime(time: any) {
    let hour: number = time.hour;
    let minute: number = time.minutes;
    return hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0");
  }

  async editCourse() {
    let startArr = this.form.value.startTime.split(':');
    let startHour = parseInt(startArr[0]);
    let startMin = parseInt(startArr[1]);

    let endArr = this.form.value.endTime.split(':');
    let endHour = parseInt(endArr[0]);
    let endMin = parseInt(endArr[1]);

    if (!this.form.valid) return;

    const course: ICourse = {
      _id: this.data.edit?._id,
      startTime: {
        hour: startHour,
        minutes: startMin
      },
      endTime: {
        hour: endHour,
        minutes: endMin,
      },
      startDate: this.form.value.startDate.toISOString(),
      endDate: this.form.value.endDate.toISOString(),
      day: this.form.value.day,
      course: this.form.value.course,
      location: this.form.value.location,
      lecturer: this.form.value.lecturer,
      students: this.data.edit?.students
    };

    await this.apiService.editCourse(course);
    this.sendEmailOnChange(course);
    this.dialogRef.close();
    window.location.reload();
  }

  async sendEmailOnChange(row: ICourse) {
    let courseName = row.course;
    let courseStudentsList = row.students;
    let day = this.formatDay(row.day);
    let location = row.location;
    let time = this.formatTime(row.startTime) + " - " + this.formatTime(row.endTime);
    let date = new Date(row.startDate).toLocaleDateString("de-DE") + " - " + new Date(row.endDate).toLocaleDateString("de-DE");
    let courseLecturer = row.lecturer;
    let subject = "Email aus der Uni - eine deiner Kurse wurde angepasst";
    let html = "<h3>Hallo, es gibt Änderungen bei deinem Kurs.</h3> <p>Hier sind die Informationen:</p> <p>Kursbezeichnung: " + courseName + "</p> <p>Wochentag: " + day + "</p> <p> Uhrzeit: " + time + "</p> <p> Ort: " + location + "</p> <p> Zeitraum: " + date + "</p> <p> Leitung: " + courseLecturer + "</p> <br> <p>Für mehr Informationen wende dich an sekretariat@uni.de</p>"

    const messageData = {
      studentsMails: courseStudentsList,
      subject: subject,
      html: html
    }

    await this.apiService.sendEmail(messageData);
  }

  formatDay(day: number) {
    return ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][day]
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

function studentsMails(studentsMails: any) {
  throw new Error('Function not implemented.');
}
