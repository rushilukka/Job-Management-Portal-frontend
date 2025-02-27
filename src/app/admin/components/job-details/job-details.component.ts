import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ToasterService } from '../../../shared/Toaster/toaster.service';

@Component({
  selector: 'app-job-details',
  standalone: false,
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  id: string | null = null;
  jobForm: FormGroup = {} as FormGroup;
  jobData: 
  { 
    id: string; 
    jobTitle: string; 
    location: string; 
    jobDescription: string; 
    salaryRange: string;
    skills: string[]; // Add skills property
  } | null = null;
  
  isEditing: boolean = false; // Toggle edit mode
  updatedJob: any = {}; // Store updated values
  newSkill: string = ''; // Track new skill to be added
  jobSkills: string[] = []; // Track job skills in edit mode


  constructor(private fb: FormBuilder, private router: Router, private adminService: AdminService,private toaster: ToasterService) {}


  
  ngOnInit(): void {
    this.jobData = this.adminService.getJobData();

    // this.jobForm = this.fb.group({
    //   jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
    //   jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
    //   salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
    //   location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]]
    // });
    console.log('this.jobData?.skills', this.jobData);
    
    this.jobForm = this.fb.group({
      jobTitle: [this.jobData?.jobTitle, [Validators.required, Validators.maxLength(100)]],
      jobDescription: [this.jobData?.jobDescription, [Validators.required, Validators.maxLength(500)]],
      salaryRange: [this.jobData?.salaryRange, [Validators.required, this.salaryRangeValidator]],
      location: [this.jobData?.location, [Validators.required, Validators.maxLength(100)]],
      skills: this.fb.array(this.jobData?.skills?.map(skill => this.fb.control(skill, Validators.required)) || [])
    });



    console.log('this.jobData', this.jobForm.value);

    const id = this.jobData ? this.jobData.id : null;
    this.id = id;
    console.log('Job ID from service:', id);

    // Initialize updatedJob with jobData if jobData is available
    if (this.jobData) {
      this.updatedJob = { ...this.jobData };
      // this.jobSkills = [...this.jobData.skills]; // Initialize jobSkills with existing data
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

    // console.log('Updated Job:', this.updatedJob);

    const ObjectofSkills = this.jobForm.value.skills;
    const ArrayofSkills:string[] = this.jobForm.value.skills;
     
        
    // Array.from(this.jobForm.value.skills).forEach((skill: string) => {

    // })
    // Call the service to update the job
    this.updatedJob = this.jobForm.value;
    this.updatedJob = { ...this.jobForm.value, id: this.id, skills: this.jobForm.value.skills};

    console.log('Updated Job:', this.updatedJob);
    
    this.adminService.updateJob(this.updatedJob).subscribe(
      (response: HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
        console.log('Job updated:', response);
        this.isEditing = false;

        this.jobForm.reset();
        this.jobForm = this.fb.group({
          jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
          jobDescription: ['', [Validators.required, Validators.maxLength(500)]],
          salaryRange: ['', [Validators.required, this.salaryRangeValidator]],
          location: ['', [Validators.required, Validators.maxLength(100)]]
        });

        this.jobData = this.updatedJob;
        console.log('this.jobData to submit ----', this.jobData);
        
        if (this.jobData) this.adminService.setJobData(this.jobData);
      },
      (error) => {
        console.error('Error updating job:', error);
      }
    );
  }

 


  addSkill(skill: string): void {
    console.log('skill', skill);
    if (skill.trim()) {
      this.skills.push(this.fb.control(skill.trim(), Validators.required));
    }
    console.log('this.skills.value-----', this.skills.value);
    
  }
  
  removeSkill(index: number): void {
    this.skills.removeAt(index);
    console.log(index);
    console.log('this.skills.value-----', this.skills.value);
    
  }
  
 
}
