import { Component } from '@angular/core';
import {  ROUTES } from '../../constants/Routes.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { Job } from '../../../users/users.interface';
import { AgButtonComponent } from '../ag-button/ag-button.component';
import { JobMange } from '../../admin.interface';
import { take } from 'rxjs';


@Component({
  selector: 'app-manage-jobs',
  standalone: false,
   templateUrl: './manage-jobs.component.html',
  styleUrl: './manage-jobs.component.scss'
})
export class ManageJobsComponent {

  jobs:JobMange[]= []; // Store jobs list
 

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
    cellStyle: { textAlign: "center" }, //  Align text and button center
    cellClass: "center-action-cell" // Add a CSS class for extra control
  },
  
];

frameworkComponents = {
  agButtonRenderer: AgButtonComponent, // Register framework component
};  

  constructor(private http: HttpClient, private router: Router,private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchJobs();
  }


  fetchJobs(): void {
      this.adminService.fetchJobs().pipe(take(1)).subscribe(
      (response: HttpResponse<StandardResponse<[]>> ):  void => {
        this.jobs = response.body?.data?response.body.data:[];
        
        this.jobs = this.jobs.map(job => {        
          return {
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          location: job.location,
          actions: job // Placeholder for action buttons (edit/delete)
        }
      })
      },
      (error) => {
        console.error("Error fetching jobs:", error);
      }
    );
  }  

  addNewJob(): void {
    this.router.navigate([`${ROUTES.ADD_JOB}`]);
  }
}
