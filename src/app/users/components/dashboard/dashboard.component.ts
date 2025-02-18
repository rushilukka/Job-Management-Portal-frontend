import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../user.service';
import { LOCALSTORAGE } from '../../../auth/constants/local-storage.constant';
import { Router } from '@angular/router';


interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userEmail:string = '';
  jobs: any = [];
 
   constructor(private userService: UserService,private router: Router) {}
   ngOnInit(){
     console.log("admin dashboard");
     
     let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
     
     this.userService.getJobsAvailableJobs().subscribe(//pass admin id
       (response : HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
         this.jobs = response.body?.data;
         this.userEmail = jwtDecode<JwtPayload>(token?token:'').email;
         console.log(response.body?.data);
       },
       (error:any) => {
         console.error(error);
       }
     )
   }
 

   onApply(job:{jobId: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string}){
      // const jobId = job.jobId;{
      // console.log("Applied for :", jobId); // You can log or handle job details here
    
      //need to 
      // 1 fetch job details 
      // 2 user apply for job

      this.router.navigate(['users/apply'], { queryParams: { job: job} });



    }

  }

 

