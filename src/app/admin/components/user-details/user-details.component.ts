import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environments';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ROUTES } from '../../constants/Routes.constants';
import { JobDetails, UserData } from '../../admin.interface';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: false,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent { 
  user: UserData | null = null;
  skills: string[] = [];
  appliedJobs: JobDetails[] = [];
  resumeUrl: SafeUrl = '';
  userData : UserData | null = null;
  constructor(private sanitizer: DomSanitizer,private route: ActivatedRoute, private http: HttpClient,private adminService: AdminService,private router: Router) {}

  ngOnInit(): void {
    
    this.userData = this.adminService.getUserData();
    const userId = this.userData?.uuid;
    if (userId) {
      this.fetchUserDetails();
      this.fetchUserSkills(userId);
      this.fetchUserResume(userId);
      this.fetchUserAppliedJobs(userId);
    }
  }

  fetchUserDetails(): void {
      this.user = this.adminService.getUserData();
  }


  fetchUserSkills(userId: string): void {
    this.adminService.fetchUserSkills(userId).subscribe({
      next: (response: HttpResponse<StandardResponse<string[]>>) => {
        console.log('response skills -  ------', response?.body?.data);
  
        // Ensure response.data exists and is an array before checking length
        this.skills = response?.body?.data && response?.body?.data.length > 0 ? response?.body?.data : ['No Skills Added'];
      },
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }
  
  fetchUserResume(userId: string): void {
    this.adminService.fetchUserResume(userId).pipe(take(1)).subscribe({
      next: (response) => {
        if(response?.body?.data?.storageDirectoryPath){
          const pdfUrl = `${environment.backendUrl}/${response?.body?.data.storageDirectoryPath}`;
           this.resumeUrl = this.sanitizer.bypassSecurityTrustUrl(pdfUrl);    
        }
        else this.resumeUrl = 'No Resume Found';
      },  
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }

  fetchUserAppliedJobs(userId: string): void {
    this.adminService.fetchUserAppliedJob(userId).pipe(take(1)).subscribe({
       next: (response) => {
         if(response?.body?.data?.length??0 > 0){
          this.appliedJobs = response?.body?.data??[];
        }
        else this.appliedJobs =[];
      },
      error: (error) => {
        console.error("Error fetching applied jobs:", error);
      }
    });
  }



  // Navigate to job details page
  // viewJobDetails(jobId: string) {
  //   this.router.navigate(['/job-details', jobId]);
  // }
    viewJobDetails(job: {id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[]}): void {
      console.log('Job ----vID:', job);
      
      // this.router.navigate([ROUTES.JOB_DETAILS], { queryParams: { jobId: jobId } });
      this.adminService.setJobData(job);
      this.router.navigate([ROUTES.JOB_DETAILS]);
      
      // this.router.navigate([ROUTES.JOB_DETAILS], { state: { jobId: jobId } });
  
    }
}
