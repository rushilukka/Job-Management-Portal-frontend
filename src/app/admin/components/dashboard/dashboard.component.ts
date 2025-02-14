import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { HttpResponse } from '@angular/common/http';
import { LOCALSTORAGE } from '../../../auth/constants/local-storage.constant';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 
  jobs: any = [];

  constructor(private adminService: AdminService) {}
  ngOnInit(){
    console.log("admin dashboard");
    
    let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    
    this.adminService.getJobsPosted().subscribe(//pass admin id
      (response : HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
        this.jobs = response.body?.data;
        console.log(response.body?.data);
      },
      (error:any) => {
        console.error(error);
      }
    )
  }
}
