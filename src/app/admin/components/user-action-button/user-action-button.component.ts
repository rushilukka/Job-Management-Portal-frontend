import { Component } from '@angular/core'; 
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/Routes.constants';
import { UserData } from '../../admin.interface';
  

@Component({
  selector: 'app-user-action-button',
  standalone: false,
  templateUrl:'./user-action-button.component.html',
  styleUrl: './user-action-button.component.scss'
})
export class UserActionButtonComponent implements ICellRendererAngularComp  {
   
  constructor(private adminService:AdminService, private router :Router){}
  rowData: UserData|null = null; // This will hold the row data
   agInit(params: ICellRendererParams): void {
    this.rowData = params.data.actions; // Receive row data from cellRendererParams
  }  
    refresh(): boolean {
      return false;
    }
  
    onClick(): void {
      const user =this.rowData;
      this.viewJobDetails(user);
    }
    viewJobDetails(user: any): void {
        this.adminService.setUserData(user);
        this.router.navigate([ROUTES.VIEW_USERS]);
      }  
}
