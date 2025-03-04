import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { take } from 'rxjs';
import { Job } from '../../../users/users.interface';
import { JobApplicationsByJobId } from '../../admin.interface';

@Component({
  selector: 'app-job-details',
  standalone: false,
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  id: string | null = null;
  jobForm: FormGroup = {} as FormGroup;
  jobData: Job | null = null;  
  isEditing: boolean = false; // Toggle edit mode
  updatedJob: any = {}; // Store updated values
  newSkill: string = ''; // Track new skill to be added
  jobSkills: string[] = []; // Track job skills in edit mode
  
  jobApplications: JobApplicationsByJobId[] = []; // Store fetched applications
  isLoading: boolean = false;
  isError: boolean = false;
  

  constructor(private fb: FormBuilder, private router: Router, private adminService: AdminService,private toaster: ToasterService) {}
  
  ngOnInit(): void {
    this.jobData = this.adminService.getJobData();
    
    this.jobForm = this.fb.group({
      jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
      jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
      salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
      location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]],
      skills: this.fb.array(this.jobData?.skills?.map(skill => this.fb.control(skill, Validators.required)) || [])
    });


    const id = this.jobData ? this.jobData.id : null;
    this.id = id;
    
    // Initialize updatedJob with jobData if jobData is available
    if (this.jobData) {
      this.updatedJob = { ...this.jobData };
    }
  }


  get skills(): FormArray {
    return this.jobForm.get('skills') as FormArray;
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
    if (this.isEditing && this.jobData) {
      this.updatedJob = { ...this.jobData };
      this.jobForm = this.fb.group({
        jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
        jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
        salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
        location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]],
        skills: this.fb.array(this.jobData?.skills?.map(skill => this.fb.control(skill, Validators.required)) || [])
      });
    }
  }

  updateJob(): void {
    if (!this.id) return;
  
    // Call the service to update the job
    this.updatedJob = this.jobForm.value;
    this.updatedJob = { ...this.jobForm.value, id: this.id, skills: this.jobForm.value.skills};
  
    this.adminService.updateJob(this.updatedJob).pipe(take(1)).subscribe(
      (response: HttpResponse<StandardResponse< [] >>) => {
        this.isEditing = false;
        this.jobForm.reset();
        this.jobForm = this.fb.group({
          jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
          jobDescription: ['', [Validators.required, Validators.maxLength(500)]],
          salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
          location: ['', [Validators.required, Validators.maxLength(100)]]
        });
        this.jobData = this.updatedJob;       
        if (this.jobData) this.adminService.setJobData(this.jobData);
      },
      (error) => {
        console.error('Error updating job:', error);
      }
    );
  }

  addSkill(skill: string): void {
    if (skill.trim()) {
      this.skills.push(this.fb.control(skill.trim(), Validators.required));
    }    
  }
  
  removeSkill(index: number): void {
    this.skills.removeAt(index); 
  }


  viewUserApplication(): void {
    const jobId = this.jobData ? this.jobData.id : null;
    if (!jobId) return;

    this.isLoading = true;
    this.isError = false;

    this.adminService.fetchUserDetailsByJobId(jobId).subscribe({
      next: (response) => {
        this.jobApplications = response.body?.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      }
    });
  }

  
}
