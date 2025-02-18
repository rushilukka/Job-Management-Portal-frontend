import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-job-details',
  standalone: false,
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  id: string | null = null;
  jobForm:FormGroup = {} as FormGroup;
  jobData: 
  { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string } | null = null;
  isEditing: boolean = false; // Toggle edit mode
  updatedJob: any = {}; // Store updated values

  constructor(private fb: FormBuilder,private router: Router, private adminService: AdminService) {}
  
  ngOnInit(): void {
    
    
  this.jobData = this.adminService.getJobData();
    
    this.jobForm = this.fb.group({
      jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
      jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
      salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
      location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]]
    });

 
    console.log('this.jobData',this.jobData);
    
    const id= this.jobData ? this.jobData.id : null;
    this.id = id;
    console.log('Job ID from service:', this.adminService.getJobData()?.id);

    // Initialize updatedJob with jobData if jobData is available
    if (this.jobData) {
      this.updatedJob = { ...this.jobData };
      this.jobForm = this.fb.group({
        jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
        jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
        salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
        location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]]
      });
    }
  }

  salaryRangeValidator(control: any) {
    const regex = /^(\d+)-(\d+)$/;
    if (!control.value || !regex.test(control.value)) {
      return { invalidSalaryFormat: true };
    }
    const [lower, upper] = control.value.split('-').map(Number);
  if (lower < 30000 || upper > 200000 || lower >= upper) {
    return { invalidSalaryRange: true };
  }

  return null;
} 

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    // If switching to edit mode, pre-fill the values from jobData
    if (this.isEditing && this.jobData) {
      this.updatedJob = { ...this.jobData };
      this.jobForm = this.fb.group({
        jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
        jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
        salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
        location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]]
      });
    }
  }

  updateJob(): void {
    if (!this.id) return;

    console.log('Updated Job-_---__:', this.updatedJob);
    
    // Call the service to update the job
    this.updatedJob = this.jobForm.value;
    this.updatedJob = {...this.jobForm.value, id: this.id };
    
    this.adminService.updateJob(this.updatedJob).subscribe(
      (response : HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>

      ) => {
        console.log('Job updated:', response);
        this.isEditing = false;

        console.log(response.body?.data);
        console.log('Form Submitted:', this.jobForm.value);
        this.jobForm.reset();
        this.jobForm = this.fb.group({
         jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
         jobDescription: ['', [Validators.required, Validators.maxLength(500)]], 
         salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
         location: ['', [Validators.required, Validators.maxLength(100)]]
       });
      
        // Optionally update jobData with the latest data
        this.jobData = { ...this.updatedJob };
        if(this.jobData)
        this.adminService.setJobData(this.jobData);
        // Optionally fetch the latest jobs or refresh the data
        // this.fetchJobs();
      },
      (error) => {
        console.error('Error updating job:', error);
      }
    );
    
    // // Call the service to update the job
    // this.adminService.updateJob(this.updatedJob).subscribe(
    //   (response) => {
    //     console.log('Job updated:', response);
    //     this.isEditing = false;

    //     // Optionally update jobData with the latest data
    //     this.jobData = { ...this.updatedJob };
    //     // Optionally fetch the latest jobs or refresh the data
    //     // this.fetchJobs();
    //   },
    //   (error) => {
    //     console.error('Error updating job:', error);
    //   }
    // );
  }
}
