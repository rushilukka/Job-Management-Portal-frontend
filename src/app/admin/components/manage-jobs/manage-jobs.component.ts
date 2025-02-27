import { Component } from '@angular/core';
import {  ROUTES } from '../../constants/Routes.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { Job } from '../../../users/users.interface';
import { AgButtonComponent } from '../ag-button/ag-button.component';

interface JobDetails{  
  jobTitle: string; 
  location: string; 
  jobDescription: string; 
  actions:any
}







@Component({
  selector: 'app-manage-jobs',
  standalone: false,
   templateUrl: './manage-jobs.component.html',
  styleUrl: './manage-jobs.component.scss'
})
export class ManageJobsComponent {

  jobs:JobDetails[]= []; // Store jobs list
 

jobColumn: ColDef[] = [
  { field: "jobTitle", headerName: "Job Title" },
  { field: "jobDescription", headerName: "Job Description" },
  { field: "location", headerName: "Location" },
  { 
    field: 'action',
    headerName: 'Action',
    cellRenderer: AgButtonComponent,
    cellRendererParams: (job: any) => ({
      data: job, // Pass row data
    }),
    filter: false, // No filter needed for action column
    sortable: false,
    cellStyle: { textAlign: "center" }, // ✅ Align text and button center
    cellClass: "center-action-cell" // ✅ Add a CSS class for extra control
  },
  
];

frameworkComponents = {
  agButtonRenderer: AgButtonComponent, // Register framework component
};  

view(){
  console.log("VIEWWW");
  
}

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
        console.log('this.jobs -',this.jobs);
        
        this.jobs = this.jobs.map(job => {
          console.log('job',job);
          
          return {
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          location: job.location,
          actions: job // Placeholder for action buttons (edit/delete)
        }
      })
         // console.log('this.jobs -',this.jobs);
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
    // this.adminService.setJobData( job);
    this.router.navigate([ROUTES.JOB_DETAILS]);
    
    // this.router.navigate([ROUTES.JOB_DETAILS], { state: { jobId: jobId } });

  }
  

  addNewJob(): void {
    this.router.navigate([`${ROUTES.ADD_JOB}`]);
  }
}
