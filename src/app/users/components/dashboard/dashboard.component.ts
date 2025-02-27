import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../user.service';
import { LOCALSTORAGE } from '../../../auth/constants/local-storage.constant';
import { Router } from '@angular/router';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { Job } from '../../users.interface';
import { take } from 'rxjs';

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
  jobs: Job[]|null = null;
    constructor(private userService: UserService,private router: Router) {}
   ngOnInit(){
     let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
   this.userService.getJobsAvailableJobs().pipe(take(1)).subscribe(//pass admin id
       (response : HttpResponse<StandardResponse<Job[] | null>>) => {
         this.jobs = response.body?response.body.data as Job[]:null;
         this.userEmail = jwtDecode<JwtPayload>(token?token:'').email;
       },
       (error:any) => {
         console.error(error);
       }
     )
   } 

   onApply(job:Job) {
      this.userService.setJobData(job);
      this.router.navigate(['users/apply']);
    }
  }

 

