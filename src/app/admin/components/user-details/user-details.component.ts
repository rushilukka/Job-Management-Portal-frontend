import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environments';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
 
@Component({
  selector: 'app-user-details',
  standalone: false,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {

  
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
  constructor(private sanitizer: DomSanitizer,private route: ActivatedRoute, private http: HttpClient,private adminService: AdminService) {}

  ngOnInit(): void {
      this.userData = this.adminService.getUserData();
    // const userId = this.route.snapshot.paramMap.get('id');
    const userId = this.userData?.uuid;
    // const userId = '6f770236-3d24-45d1-88c6-edba6a9d0894';
    if (userId) {
      this.fetchUserDetails();
      this.fetchUserSkills(userId);
      this.fetchUserResume(userId);
      this.fetchUserAppliedJobs(userId);
    }
  }

  fetchUserDetails(): void {
      this.user = this.adminService.getUserData();
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
        this.skills = ['No Skills Added'];
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
        if(response.data.storageDirectoryPath){
          console.log('response resume url  -  ------', response.data);
          
          const pdfUrl = `${environment.backendUrl}/${response.data.storageDirectoryPath}`;
          // const pdfUrl = 'http://localhost:3000/uploads/resumes/1739769414987.pdf';
            
           this.resumeUrl = this.sanitizer.bypassSecurityTrustUrl(pdfUrl);
          // this.resumeUrl = pdfUrl;
          console.log('response resume url  -  ------', this.resumeUrl);
          
        }
        this.resumeUrl = 'No Resumme Found';
      },  
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }

  fetchUserAppliedJobs(userId: string): void {
    this.http.get<any>(`${API_ENDPOINTS.USER_APPLIED_JOBS}?userId=${userId}`).subscribe({
      next: (response) => {
        console.log('fetchUserAppliedJobs-------------------------',response);
        if(response.data.length > 0){
          this.appliedJobs = response.data;
          
        }
        // else this.appliedJobs =['Not Applied to any job'];
        console.log('fetchUserAppliedJobs-------------------------',response.data);
        

      },
      error: (error) => {
        console.error("Error fetching applied jobs:", error);
      }
    });
  }
}
