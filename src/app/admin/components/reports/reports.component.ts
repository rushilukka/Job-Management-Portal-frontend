import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  totalJobs = 50;
  totalUsers = 200;
  totalApplications = 120;
  approvedApplications = 80;
}
