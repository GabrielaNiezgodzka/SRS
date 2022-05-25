import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {

  constructor(private jwtService: JwtService) { }

  ngOnInit(): void {
    this.name;
  }

  get name() {
    return this.jwtService.decodeToken().name;
  }

}
