import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesContentComponent } from './courses-content/courses-content.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TimetableContentComponent } from './timetable-content/timetable-content.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';

const routes: Routes = [
  { path: 'user/register', component: RegisterComponent },
  { path: 'user/login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { outlet: 'dashboard', path: 'timetable', component: TimetableContentComponent },
      { outlet: 'dashboard', path: 'courses', component: CoursesContentComponent },
      { outlet: 'dashboard', path: '**', component: DashboardContentComponent },
    ]
  },

  { path: '**', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
