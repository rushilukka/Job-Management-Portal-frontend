import { Component } from '@angular/core';
import {  ROUTES } from '../../constants/Routes.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
 
@Component({
  selector: 'app-manage-jobs',
  standalone: false,
   templateUrl: './manage-jobs.component.html',
  styleUrl: './manage-jobs.component.scss'
})
export class ManageJobsComponent {

  jobs:any[]= []; // Store jobs list

  constructor(private http: HttpClient, private router: Router,private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchJobs();
  }


  fetchJobs(): void {
    //give admin id 
    // this.http.get<any>(API_ENDPOINTS.JOBS)
    this.adminService.fetchJobs().subscribe(
      (response: HttpResponse<StandardResponse<[]>> ):  void => {
        this.jobs = response.body?.data?response.body.data:[];
      },
      (error) => {
        console.error("Error fetching jobs:", error);
      }
    );
  }

  // viewJobDetails(jobId: string): void {
  //   this.router.navigate([`${ROUTES.JOB_DETAILS}`, { queryParams: {  jobId }}]);
  // }
  //   viewJobDetails( ): void {
  //   this.router.navigate([`${ROUTES.JOB_DETAILS}/job`]);
  // }

  viewJobDetails(job: any): void {
    console.log('Job ID:', job);
    
    // this.router.navigate([ROUTES.JOB_DETAILS], { queryParams: { jobId: jobId } });
    this.adminService.setJobData( job);
    this.router.navigate([ROUTES.JOB_DETAILS]);
    
    // this.router.navigate([ROUTES.JOB_DETAILS], { state: { jobId: jobId } });

  }
  

  addNewJob(): void {
    this.router.navigate([`${ROUTES.ADD_JOB}`]);
  }
}
