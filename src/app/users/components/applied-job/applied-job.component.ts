import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { UserService } from '../../user.service';
import { Job } from '../../users.interface';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applied-job',
  standalone: false,
  templateUrl: './applied-job.component.html',
  styleUrl: './applied-job.component.scss'
})
export class AppliedJobComponent {
   
  jobDetail:Job | null = null;
  constructor(private http: HttpClient,
    private userService: UserService, 
    private toasterService:ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.jobDetail = this.userService.getJobData();
    console.log('jobDetail -  ------', this.jobDetail);
   
  }

  deleteApplication(): void {
    if(!this.jobDetail?.id){
      return;
    }else {
      console.log('jobDetail -  ------', this.jobDetail.id);
      
    this.userService.deleteJobApplication(this.jobDetail.id).subscribe(
      (response) => {
        this.toasterService.success(MESSAGES.APPLY_JOB_DELETED);
        this.userService.clearJobData();
        this.router.navigate(['/users/dashboard']);
        // this.userService.deleteJobApplication();
      },
       (error:unknown) => {
        // throw new Error(MESSAGES.APPLY_JOB_ERROR);
        
        console.log('error - ', );
      },
    );
   
  }
  }


}
