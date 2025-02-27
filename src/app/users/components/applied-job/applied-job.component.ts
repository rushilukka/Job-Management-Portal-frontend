import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MESSAGES } from '../../constants/Messages.constant';
import { UserService } from '../../user.service';
import { Job } from '../../users.interface';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

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
  }

  deleteApplication(): void {
    if(!this.jobDetail?.id){
      return;
    }else {
      
    this.userService.deleteJobApplication(this.jobDetail.id).pipe(take(1)).subscribe(
      (response) => {
        this.toasterService.success(MESSAGES.APPLY_JOB_DELETED);
        this.userService.clearJobData();
        this.router.navigate(['/users/dashboard']);
      },
       (error:unknown) => { 
        console.log('error - ', error);
      },
    );
   
  }
  }


}
