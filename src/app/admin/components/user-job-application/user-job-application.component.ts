import { Component } from '@angular/core';
import { JobApplicationWithJobData } from '../../../users/users.interface';
import { AdminService } from '../../admin.service';
import { UserData } from '../../admin.interface';
import { jobApplicationStatus } from '../../../users/user.service';
import { take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { HttpResponse } from '@angular/common/http';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
@Component({
  selector: 'app-user-job-application',
  standalone: false,
  templateUrl: './user-job-application.component.html',
  styleUrl: './user-job-application.component.scss'
})
export class UserJobApplicationComponent {

  //need to re render cmp after response
  jobApplicationDetail: JobApplicationWithJobData | null = null;
  userDetails: UserData | null = null;
  jobApplicationStatus = jobApplicationStatus;
  isPending: boolean = false;
  isRejecting: boolean = false;
  rejectForm: FormGroup;


  constructor(private adminService: AdminService,private fb: FormBuilder,
    private toasterService: ToasterService
  ) {
    this.jobApplicationDetail = this.adminService.getJobApplicationData();

     

    this.userDetails = this.adminService.getUserData();
    this.isPending = this.jobApplicationDetail?.status === jobApplicationStatus.pending;
    this.rejectForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  approveApplication(): void {
    console.log(this.jobApplicationDetail);
    console.log(this.userDetails);
    const jobId = this.jobApplicationDetail?.id;
    const userId = this.userDetails?.uuid;
    if(!jobId || !userId){
      throw new Error(`Cannot update job application status`);
    }
    this.adminService.updateJobApplicationStatus( jobId, userId,jobApplicationStatus.approved).pipe(take(1)).subscribe({
      next: (response) => {
        this.adminService.setJobApplicationData({
          ...this.jobApplicationDetail, // Keep all existing properties
          status: jobApplicationStatus.approved // Only update status
        } as JobApplicationWithJobData // Type assertion to fix TS error 
      );
        console.log(response);
        this.isPending = false;
        this.toasterService.success(TOASTER_MESSAGES.JOB_APPLICATION_APPROVED);
      },
      error: (error) => {
        console.error('Error updating job application status:', error);
      }
    });
  }


  toggleRejectForm(): void {
    this.isRejecting = !this.isRejecting;
  }

  rejectApplication(): void {
    if (this.rejectForm.invalid) {
      return;
    }
    const comment = this.rejectForm.value.comment;


    console.log(this.jobApplicationDetail);
    console.log(this.userDetails);
    const jobId = this.jobApplicationDetail?.id;
    const userId = this.userDetails?.uuid;
    if(!jobId || !userId){
      throw new Error(`Cannot update job application status`);
    }
    this.adminService.updateJobApplicationStatus( jobId, userId,jobApplicationStatus.rejected,comment).pipe(take(1)).subscribe({
      next: (response) => {
        this.adminService.setJobApplicationData({
          ...this.jobApplicationDetail, // Keep all existing properties
          status: jobApplicationStatus.rejected, // Only update status
          commentByAdmin: comment // Store the rejection comment
          
        } as JobApplicationWithJobData // Type assertion to fix TS error 
      );
        console.log(response);
        this.isRejecting = false; // Hide rejection form after submission
        this.isPending = false;
        this.toasterService.success(TOASTER_MESSAGES.JOB_APPLICATION_REJECTED);
      },
      error: (error) => {
        console.error('Error updating job application status:', error);
      }
    });
  }

   
}
