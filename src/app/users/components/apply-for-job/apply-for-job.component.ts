import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { ToasterService } from '../../../core/components/toaster.service';


interface Job 
  { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string }


@Component({
  selector: 'app-apply-for-job',
  standalone: false,
  templateUrl: './apply-for-job.component.html',
  styleUrl: './apply-for-job.component.scss'
})
export class ApplyForJobComponent {

  jobId: string | null = null;
  job : Job| null = null;
  jobDetail: Job | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient,private userService: UserService,private toasterService:ToasterService, private router: Router) {}

  ngOnInit(): void {
    // this.jobId = this.route.snapshot.queryParamMap.get('jobId');
    // this.job = this.userService.getJobData();
    this.jobDetail = this.userService.getJobData();
    console.log('jobDetail - ______ ------', this.jobDetail);
    
  }

  applyJob(): void {
 
    console.log('jobId_-_-__',{ jobId: this.jobDetail?.id });
    
    this.http.post(API_ENDPOINTS.APPLY_JOB, { jobId: this.jobDetail?.id },{ observe: 'response' }).subscribe({
      next: (response) =>{ 
        if(response.status === 200){
        this.toasterService.success(TOASTER_MESSAGES.JOB_APPLIED);
        console.log(response, "response");
        console.log(TOASTER_MESSAGES.JOB_APPLIED);
        this.router.navigate(['/users/applied-jobs']);
        }
        else if(response.status === 409){
          console.error('ewfsdjbvbc message',MESSAGES.APPLY_JOB_ERROR)
          this.toasterService.error(MESSAGES.ALREADY_APPLIED);
      }
    },
      error: (error) => {
      if(error.statusCode === 409){
        this.toasterService.error(MESSAGES.ALREADY_APPLIED);
      }
        console.error('errrrrr message',MESSAGES.APPLY_JOB_ERROR)
      }
    });
  }
}

