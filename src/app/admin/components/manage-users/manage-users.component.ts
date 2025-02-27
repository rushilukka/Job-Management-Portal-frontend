import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ROUTES } from '../../constants/Routes.constants';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { AdminService } from '../../admin.service';
import { ColDef } from 'ag-grid-community';
import { AgButtonComponent } from '../ag-button/ag-button.component';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { UserData } from '../../../users/user.service';
import { UserActionButtonComponent } from '../user-action-button/user-action-button.component';

interface userData{
  name: string;
  email: string;
  phoneNumber: string;
   
}

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  users: userData[] = []; // Store users list

  //   userData = [
  //     { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  //     { make: "Ford", model: "F-Series", price: 33850, electric: false },
  //     { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  // ];
  
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
    cellStyle: { textAlign: "center" }, // ✅ Align text and button center
    cellClass: "center-action-cell" // ✅ Add a CSS class for extra control
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
    // this.http.get<any>(API_ENDPOINTS.USERS).subscribe({
    this.adminService.fetchUsers().subscribe(
        (response: HttpResponse<StandardResponse<{users:UserData[],number:number}>> ):  void => {
      // next: (response) => {
        
        // this.users = response.data.users;

        response.body?.data?response.body.data:[];
        if(response.body?.data?.users)
        this.users = response.body?.data?.users;
        console.log('this.users -',this.users);
        
        this.users = this.users.map(user => {
          console.log('job - - - - - ',user);
          
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

  viewUserDetails(user: {
    uuid: string;
    roleId: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    isVerifiedEmail: boolean;
    verificationToken: string | null;
    verificationTokenExpiration: string | null;
    twoFactorSecret: string;
    isTwoFactorEnabled: boolean;
    is2FARemPopUp: boolean;
    createdAt: string;
    updatedAt: string;
  }): void {
    this.adminService.setUserData(user);
    const userData = this.adminService.getUserData();
    const userId = userData?.uuid;
    console.log('userId', userId);
    
    this.router.navigate([`${ROUTES.VIEW_USERS}`,{queryParams: { userId: userId }}]);
  }



  
}
