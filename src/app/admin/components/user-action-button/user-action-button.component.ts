import { Component } from '@angular/core'; 
 import { ICellRendererAngularComp } from 'ag-grid-angular';
  import { ICellRendererParams } from 'ag-grid-community';
import { AdminService } from '../../admin.service';
import { Route, Router } from '@angular/router';
import { ROUTES } from '../../constants/Routes.constants';
  

@Component({
  selector: 'app-user-action-button',
  standalone: false,
  template: `
  <button (click)="onClick()" 
   class="bg-secondary text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-all">
    View Details
  </button>
`,  styleUrl: './user-action-button.component.scss'
})
export class UserActionButtonComponent implements ICellRendererAngularComp  {

   
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
      const user =this.rowData.actions;
      this.viewJobDetails(user);
      // You can emit an event or call a service here.
    }
    viewJobDetails(user: any): void {
        console.log('Job ID:', user);
                // this.router.navigate([ROUTES.JOB_DETAILS], { queryParams: { jobId: jobId } });
        this.adminService.setUserData( user);
        console.log( this.adminService.getUserData( ));
        
        // this.router.navigate([ROUTES.VIEW_USERS]);
        this.router.navigate([ROUTES.VIEW_USERS]);
 
        // this.router.navigate([ROUTES.JOB_DETAILS], { state: { jobId: jobId } });
    
      }
  
  
}
