import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../user.service';
import { LOCALSTORAGE } from '../../../auth/constants/local-storage.constant';
import { Router } from '@angular/router';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';


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
  jobs: any = [];
    constructor(private userService: UserService,private router: Router) {}
   ngOnInit(){
     console.log("user dashboard");
     
     let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    //  this.userService.getUserDataFromBackend().subscribe(
    //   (response: HttpResponse<StandardResponse<UserData>>) => {
    //     if (response.body?.data) {
    //       const userData = {
    //         uuid: response.body.data.uuid,
    //         roleId: String(response.body.data.roleId), // Ensure roleId is a string
    //         name: response.body.data.name,
    //         email: response.body.data.email,
    //         phoneNumber: response.body.data.phoneNumber,
    //         password: response.body.data.password,
    //         isVerifiedEmail: response.body.data.isVerifiedEmail,
    //         verificationToken: response.body.data.verificationToken ?? null,
    //         verificationTokenExpiration: response.body.data.verificationTokenExpiration ?? null,
    //         twoFactorSecret: response.body.data.twoFactorSecret ?? '', // Ensure a string
    //         isTwoFactorEnabled: response.body.data.isTwoFactorEnabled,
    //         is2FARemPopUp: response.body.data.is2FARemPopUp,
    //         createdAt: response.body.data.createdAt,
    //         updatedAt: response.body.data.updatedAt
    //       };
    
    //       console.log('userData----------',userData);
          
    //       this.userService.setUserData(userData);
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching user data:', error);
    //   }
    // );
     
        

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

 

