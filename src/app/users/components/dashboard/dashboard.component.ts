import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../user.service';
import { LOCALSTORAGE } from '../../../auth/constants/local-storage.constant';
import { Router } from '@angular/router';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { Job } from '../../users.interface';


interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}

export interface UserData {
  uuid: string;
  roleId: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerifiedEmail: boolean;
  verificationToken?: string;
  verificationTokenExpiration?: string;
  twoFactorSecret?: string;
  isTwoFactorEnabled: boolean;
  is2FARemPopUp: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userEmail:string = '';
  jobs: Job[]|null = null;
    constructor(private userService: UserService,private router: Router) {}
   ngOnInit(){
     console.log("user dashboard");
     
     let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
 
     this.userService.getJobsAvailableJobs().subscribe(//pass admin id
       (response : HttpResponse<StandardResponse<Job[] | null>>) => {
           this.jobs = response.body?response.body.data as Job[]:null;
           //OR Other Way  - 
        //  this.jobs = response.body?.data ?? null;

         this.userEmail = jwtDecode<JwtPayload>(token?token:'').email;
         console.log(response.body?.data);
       },
       (error:any) => {
         console.error(error);
       }
     )
   }
 

   onApply(job:Job) {
      // const jobId = job.jobId;{
      // console.log("Applied for :", jobId); // You can log or handle job details here
    
      //need to 
      // 1 fetch job details 
      // 2 user apply for job

      this.userService.setJobData(job);
      console.log('jobDetail -  ------', this.userService.getJobData());
      
      this.router.navigate(['users/apply']);



    }

  }

 

