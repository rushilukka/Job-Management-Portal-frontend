import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ROUTES } from '../../constants/Routes.constants'; 
import { AdminService } from '../../admin.service';
import { ColDef } from 'ag-grid-community'; 
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { UserData } from '../../admin.interface';
import { UserActionButtonComponent } from '../user-action-button/user-action-button.component';
import {UserMange} from '../../admin.interface'
import { take } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  users: UserMange[] = []; // Store users list

  // Column Definitions: Defines the columns to be displayed.
  userColumn: ColDef[] = [
  { field: "name", headerName: "Name" },
  { field: "email", headerName: "Email" },
  { field: "phoneNumber", headerName: "Phone Number" },
  { 
    field: 'action',
    headerName: 'Action',
    cellRenderer: UserActionButtonComponent,
    cellRendererParams: (job: any) => ({
      data: job, // Pass row data
    }),
    filter: false, // No filter needed for action column
    sortable: false,
    cellStyle: { textAlign: "center" }, // Align text and button center
    cellClass: "center-action-cell" // Add a CSS class for extra control
  },
];

frameworkComponents = {
  agButtonRenderer: UserActionButtonComponent, // Register framework component
};  

  constructor(private http: HttpClient, private router: Router,private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
     this.adminService.fetchUsers().pipe(take(1)).subscribe(
    (response: HttpResponse<StandardResponse<{users:UserData[],number:number}>> ):  void => {
        response.body?.data?response.body.data:[];
        if(response.body?.data?.users) this.users = response.body?.data?.users;
        this.users = this.users.map(user => {
          return {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          actions: user // Placeholder for action buttons (edit/delete)
        }
      })
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
     
  );
  }
 
}
