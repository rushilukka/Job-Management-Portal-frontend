import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../admin/admin.service';
import { environment } from '../../../../environments/environments';
import { UserService } from '../../user.service';
import { ROUTES } from '../../constants/Routes.constant';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
// export class UserProfileComponent {

//   userResume: {} = {};
//   userSkills: [] = [];
//   appliedJobs: [] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchUserProfile();
//   }

//   fetchUserProfile(): void {
//     this.http.get<any>(API_ENDPOINTS.USER_RESUME).subscribe({
//       next: (response) => (this.userResume = response.data),
//       error: () => console.error(MESSAGES.USER_PROFILE_FETCH_ERROR)
//     });

//     this.http.get<any>(API_ENDPOINTS.USER_SKILLS).subscribe({
//       next: (response) => (this.userSkills = response.data),
//       error: () => console.error(MESSAGES.USER_PROFILE_FETCH_ERROR)
//     });

//     this.http.get<any>(API_ENDPOINTS.USER_APPLIED_JOBS).subscribe({
//       next: (response) => (this.appliedJobs = response.data),
//       error: () => console.error(MESSAGES.USER_PROFILE_FETCH_ERROR)
//     });

//   }
// }


export class UserProfileComponent {

  user: any;
  skills: any[] = [];
  appliedJobs: any[] = [];
  // resumeUrl: string = '';
  resumeUrl: SafeUrl = '';

    userData : {
      uuid: string;
      roleId: string;
      name: string;
      email: string;
      phoneNumber: string;
      password: string;
      isVerifiedEmail: boolean;
      verificationToken: string | null;
      verificationTokenExpiration: string | null;
      twoFactorSecret: string;
      isTwoFactorEnabled: boolean;
      is2FARemPopUp: boolean;
      createdAt: string;
      updatedAt: string;
    }|null =null;
  constructor(private sanitizer: DomSanitizer,private route: ActivatedRoute, private http: HttpClient,private userService: UserService,private router: Router) {}

  ngOnInit(): void {
      this.userData = this.userService.getUserData();
    // const userId = this.route.snapshot.paramMap.get('id');
    const userId = this.userData?.uuid;
    console.log('userId -  ------', userId);
    
    // const userId = '6f770236-3d24-45d1-88c6-edba6a9d0894';
    if (userId) {
      this.fetchUserDetails(userId);
      this.fetchUserSkills(userId);
      this.fetchUserResume(userId);
      this.fetchUserAppliedJobs(userId);
    }
  }

  fetchUserDetails(userId: string): void {
      this.user = this.userService.getUserData();
    // this.http.get<any>(`${API_ENDPOINTS.USER_DETAILS}/${userId}`).subscribe({
    //   next: (response) => {
    //     this.user = response.data;
    //   },
    //   error: (error) => {
    //     console.error("Error fetching user details:", error);
    //   }
    // });
    
  }

  fetchUserSkills(userId: string): void {
    this.http.get<any>(`${API_ENDPOINTS.USER_SKILLS}?userId=${userId}`).subscribe({
      next: (response) => {
        console.log('response skills -  ------', response.data);
        if(response.data.length > 0){
          
          this.skills = response.data;
        }
        else this.skills = ['No Skills Added'];
      },
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }

  fetchUserResume(userId: string): void {
    this.http.get<any>(`${API_ENDPOINTS.USER_RESUME}?userId=${userId}`).subscribe({
      next: (response) => {
        console.log('response RESUMEEEEE -  ------', response.data);
        if(response.data.fileUrl){
          console.log('response resume url  -  ------', response.data);
          
          const pdfUrl = response.data.fileUrl;
          // const pdfUrl = 'http://localhost:3000/uploads/resumes/1739769414987.pdf';
            
           this.resumeUrl = this.sanitizer.bypassSecurityTrustUrl(pdfUrl);
          // this.resumeUrl = pdfUrl;
          console.log('response resume url  -  ------', this.resumeUrl);
          
        }
       else  this.resumeUrl = 'No Resumme Found';
      },  
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }

  // fetchUserAppliedJobs(userId: string): void {
  //   this.http.get<any>(`${API_ENDPOINTS.USER_APPLIED_JOBS}?userId=${userId}`).subscribe({
  //     next: (response) => {
  //       console.log('fetchUserAppliedJobs-------------------------',response);
  //       if(response.data.length > 0){
  //         this.appliedJobs = response.data;
          
  //       }
  //       // else this.appliedJobs =['Not Applied to any job'];
  //       console.log('fetchUserAppliedJobs-------------------------',response.data);
        

  //     },
  //     error: (error) => {
  //       console.error("Error fetching applied jobs:", error);
  //     }
  //   });
  // }
   fetchUserAppliedJobs(userId: string): void {
      // this.http.get<any>(`${API_ENDPOINTS.USER_APPLIED_JOBS}?userId=${userId}`).subscribe({
      this.http.get<any>(`${environment.backendUrl}/job-applications/user`).subscribe({
        next: (response) => {
          // console.log('fetchUserAppliedJobs-------------------------',response);
          console.log('fetchUser AppliedJobs-------------------------',response.data);
          if(response.data.length > 0){
            this.appliedJobs = response.data;
            
          }
          else this.appliedJobs =[];
          
  
        },
        error: (error) => {
          console.error("Error fetching applied jobs:", error);
        }
      });
    }
  
    viewJobDetails(job: {id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string}): void {
          console.log('Job ----vID:', job);
          
          // this.router.navigate([ROUTES.JOB_DETAILS], { queryParams: { jobId: jobId } });
          this.userService.setJobData(job);
          // this.router.navigate([ROUTES.APPLIED_JOB_DETAILS]);
          // this.router.navigate([ROUTES.APPLIED_JOB_DETAILS]);
          setTimeout(() => {
            this.routeToAppliedJobDetails();
            // this.router.navigate([ROUTES.APPLIED_JOB_DETAILS]);
          }, 10); // Small delay ensures the data is available before navigation
          // this.router.navigate([ROUTES.JOB_DETAILS], { state: { jobId: jobId } });
      
        }

        routeToAppliedJobDetails(): void {
          this.router.navigate([ROUTES.APPLIED_JOB_DETAILS]);
        }
}
