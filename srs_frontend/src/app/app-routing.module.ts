import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { CoursesContentComponent } from './courses-content/courses-content.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TimetableContentComponent } from './timetable-content/timetable-content.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UsersContentComponent } from './user/users-content/users-content.component';

const routes: Routes = [  
  { path: 'landing', component: LandingPageComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { outlet: 'dashboard', path: 'timetable', component: TimetableContentComponent },
      { outlet: 'dashboard', path: 'courses', component: CoursesContentComponent },
      { outlet: 'dashboard', path: 'users', component: UsersContentComponent},
      { outlet: 'dashboard', path: '', component: DashboardContentComponent },
      { outlet: 'dashboard', path: '**', component: DashboardContentComponent },
    ]
  },

  { path: 'user/register', component: RegisterComponent },
  { path: 'user/login', component: LoginComponent },
  

  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
