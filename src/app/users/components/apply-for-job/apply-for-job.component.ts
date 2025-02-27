import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserService } from '../../user.service';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { Job } from '../../users.interface';
import { take } from 'rxjs';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';

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
    this.jobDetail = this.userService.getJobData();
  }

  applyJob(): void {
    this.userService.applyJob(this.jobDetail?.id??'').pipe(take(1)).subscribe({
      next: (response: HttpResponse<StandardResponse <{ LoginTokenJWT: string }>>) =>{ 
        if(response.status ==201||200){
        this.toasterService.success(TOASTER_MESSAGES.JOB_APPLIED);
        this.router.navigate(['/users/applied-job']);
        }
        else if(response.status === 409){
          this.toasterService.error(MESSAGES.ALREADY_APPLIED);
      }
      else if(response.status === 400){
        this.toasterService.error(MESSAGES.APPLY_JOB_ERROR);
      }
    },
      error: (error) => {
          if(error.status === 409){
            this.toasterService.error(MESSAGES.ALREADY_APPLIED);
          }
          else if(error.status === 400){
            this.toasterService.error(MESSAGES.SKILL_NOT_MATCHED);
          }
         console.error('errrrrr message',MESSAGES.APPLY_JOB_ERROR)
      }
    });
  }
}

