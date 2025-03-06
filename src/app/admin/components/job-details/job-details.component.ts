import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { take } from 'rxjs';
import { Job, JobApplicationWithJobData, JobApplicationWithUserDetails } from '../../../users/users.interface';
import { JobApplicationsByJobId } from '../../admin.interface';
import { ROUTES } from '../../constants/Routes.constants';

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
  appliedJobs: JobApplicationWithJobData[] = [];
  jobApplicationDetails: JobApplicationWithJobData|null =null;
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
        console.log('job applications',this.jobApplications);
        console.log('job applications',this.jobApplications[0].jobApplication);
        
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      }
    });
  }



  /*
  viewApplication(application: JobApplicationsByJobId): void {
    
     
    // fetchUserAppliedJob(userId:string):Observable<HttpResponse<StandardResponse<JobApplicationDetails[]>>>{
    //     return this.http.get<StandardResponse<JobApplicationDetails[]>>(`${API_ENDPOINTS.USER_APPLIED_JOBS}?userId=${userId}`,
    
    //       { observe: 'response' }
    //     )
    //   }
    console.log('application',application.jobApplication);
    console.log('application',application.name);
    console.log('application',application.jobApplication);
    
    const jobApplication1 = application.jobApplication;
   console.log('jobApplication1',jobApplication1.userId);
   
   this.adminService.fetchUserAppliedJobWithJobId(jobApplication1?.userId,jobApplication1?.jobId).subscribe({
     next: (response) => {
       if(response?.body?.data?.length??0 > 0){
         this.appliedJobs = response?.body?.data??[];
         console.log('applied jobs',this.appliedJobs);
         
       }
       else this.appliedJobs =[];
     }      
   })

  //  let job: JobApplicationWithJobData = ;
    // this.adminService.fetchUserAppliedJob(jobApplication1?.userId).subscribe({
    //   next: (response) => {
    //     if(response?.body?.data?.length??0 > 0){
    //       this.appliedJobs = response?.body?.data??[];
    //       console.log('applied jobs',this.appliedJobs);
          
    //     }
    //     else this.appliedJobs =[];
    //   },
    //   error: (error) => {
    //     console.error("Error fetching applied jobs:", error);
    //   }
    // })
     this.router.navigate(['/admin/user/job-application']);
  }

  */


   viewJobApplicationDetails(job: JobApplicationsByJobId): void {
    
    /* required -
    export interface JobApplicationWithJobData{
  //this is job id, not application id,
    id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[],status:string,commentByAdmin?:string,updatedBy?:string
}

    
    */

/* have -
export interface JobApplicationsByJobId{  
  jobApplication:JobApplication,
  name?:string,
  email?:string,
  phoneNumber?:string
}

interface JobApplication{
  id: string;
  jobId: string;
  userId: string;
  status: string;
  commentByAdmin?:string;
  updatedBy?:string
  
}

so get  JobApplicationWithUserAndJobData by -
    using jobApplicationID

    /job-application-id

  */

 console.log('application',job);
    console.log('application',job.jobApplication);
    console.log('application',job.jobApplication.id);
    
        this.adminService.fetchJobApplicationByJobApplicationId(job.jobApplication.id).subscribe({
          next: (response) => {
            if(response?.body?.data){
              this.jobApplicationDetails = response?.body?.data??null;
              console.log('Application recieved -',this.jobApplicationDetails);
              
            }
            else this.jobApplicationDetails =null;
          }
        })
/*need to fetch -

*/
        const jobApplication = job.jobApplication;  
          console.log('jobData',this.jobData);
          
        /*
          export interface JobApplicationWithJobData{
            //this is job id, not application id,
            id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[],status:string,commentByAdmin?:string,updatedBy?:string
          }
        */
        const njobData = {
          id:jobApplication.jobId,
          jobTitle:this.jobData?.jobTitle??'',
          location:this.jobData?.location??'',
          jobDescription:this.jobData?.jobDescription??'',
          salaryRange:this.jobData?.salaryRange??'',
          skills:this.jobData?.skills??[],
          status:jobApplication.status,
          commentByAdmin:jobApplication.commentByAdmin,
          updatedBy:jobApplication.updatedBy
        }
        this.adminService.setJobApplicationData(njobData);
        this.router.navigate([ROUTES.JOB_APPLICATION_DETAILS]);
      }
  
}
