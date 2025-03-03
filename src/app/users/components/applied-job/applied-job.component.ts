import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MESSAGES } from '../../constants/Messages.constant';
import { UserService } from '../../user.service';
import { Job, JobApplication } from '../../users.interface';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { jobApplicationStatus } from '../../user.service';
@Component({
  selector: 'app-applied-job',
  standalone: false,
  templateUrl: './applied-job.component.html',
  styleUrl: './applied-job.component.scss'
})
export class AppliedJobComponent {
   
  // jobDetail:Job | null = null;
  jobApplicationDetail:JobApplication | null = null;
  canDeleteApplication: boolean = false;
  constructor(private http: HttpClient,
    private userService: UserService, 
    private toasterService:ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void { 
      this.jobApplicationDetail = this.userService.getJobApplicationData();  
      this.canDeleteApplication = this.jobApplicationDetail?.status === jobApplicationStatus.pending;
  }

  deleteApplication(): void {
    if(!this.jobApplicationDetail?.id){
      return;
    }else {
      
    this.userService.deleteJobApplication(this.jobApplicationDetail.id).pipe(take(1)).subscribe(
      (response) => {
        this.toasterService.success(MESSAGES.APPLY_JOB_DELETED);
        this.userService.clearJobData();
        this.router.navigate(['/users/dashboard']);
      },
       (error:unknown) => { 
        console.error('error - ', error);
      },
    );
   
  }
  }

  


}
