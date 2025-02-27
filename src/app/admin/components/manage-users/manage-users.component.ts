import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ROUTES } from '../../constants/Routes.constants';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { AdminService } from '../../admin.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  users: any[] = []; // Store users list

    rowData = [
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];
  
  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
      { field: "make" },
      { field: "model" },
      { field: "price" },
      { field: "electric" }
  ];
  

  constructor(private http: HttpClient, private router: Router,private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();

  }

  fetchUsers(): void {
    this.http.get<any>(API_ENDPOINTS.USERS).subscribe({
      next: (response) => {
        this.users = response.data.users;
      },
      error: (error) => {
        console.error("Error fetching users:", error);
      }
    });
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
