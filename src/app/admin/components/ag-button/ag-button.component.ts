import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/Routes.constants';
import {JobDetails } from '../../admin.interface'  

@Component({
  selector: 'app-ag-button',
  standalone: false,
  templateUrl: './ag-button.component.html',
  styleUrl: './ag-button.component.scss'
})
export class AgButtonComponent implements ICellRendererAngularComp  {
  constructor(private adminService:AdminService, private router :Router){}
  
  rowData: JobDetails|null = null; // This will hold the row data
  
  agInit(params: ICellRendererParams): void {
    this.rowData = params.data.actions; // Receive row data from cellRendererParams 
  }  
  refresh(): boolean {
    return false;
  }

  onClick(): void {
    const job:JobDetails =this.rowData??{
      id:'',
      jobTitle: '', 
      location: '',
      jobDescription: '',
      salaryRange:'',
      skills : []
    };
    this.viewJobDetails(job);
  }
  
  viewJobDetails(job: JobDetails): void {
      this.adminService.setJobData(job);
      this.router.navigate([ROUTES.JOB_DETAILS]);
  }
  
}
