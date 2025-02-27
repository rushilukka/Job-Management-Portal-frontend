import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { HttpResponse } from '@angular/common/http';
import { JobDetails } from '../../admin.interface';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 
  jobs: JobDetails[] = [];

  constructor(private adminService: AdminService) {}
  ngOnInit(){
    this.adminService.getJobsPosted().pipe(take(1)).subscribe(
      (response : HttpResponse<StandardResponse<JobDetails[]>>) => {
        this.jobs = response.body?.data??[];
       },
      (error:unknown) => {
        console.error(error);
      }
    )
  }
}
