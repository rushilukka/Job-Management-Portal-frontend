import { Component } from '@angular/core';
 import { ICellRendererAngularComp } from 'ag-grid-angular';
  import { ICellRendererParams } from 'ag-grid-community';
import { AdminService } from '../../admin.service';
import { Route, Router } from '@angular/router';
import { ROUTES } from '../../constants/Routes.constants';
  
@Component({
  // selector: 'app-ag-button',
  selector: 'app-button-cell-renderer',
  standalone: false,
  // templateUrl: './ag-button.component.html',
  template: `
      <button (click)="onClick()" 
       class="bg-secondary text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-all">
        View Details
      </button>
    `,
  styleUrl: './ag-button.component.scss'
})
export class AgButtonComponent implements ICellRendererAngularComp  {
  
  constructor(private adminService:AdminService, private router :Router){}
  rowData: any; // This will hold the row data
   agInit(params: ICellRendererParams): void {
    this.rowData = params.data; // Receive row data from cellRendererParams
  }  
    refresh(): boolean {
      return false;
    }
  
    onClick(): void {
      // alert(`Button clicked for ID: ${this.params.data}`);
      // console.log(this.params);
      console.log("this  s s s 0, 0",this.rowData.actions.id);
      
      const job =this.rowData.actions;
      this.viewJobDetails(job);
      // You can emit an event or call a service here.
    }
    viewJobDetails(job: any): void {
        console.log('Job ID:', job);
                // this.router.navigate([ROUTES.JOB_DETAILS], { queryParams: { jobId: jobId } });
        this.adminService.setJobData( job);
        this.router.navigate([ROUTES.JOB_DETAILS]);
        
        // this.router.navigate([ROUTES.JOB_DETAILS], { state: { jobId: jobId } });
    
      }
  
  
}
