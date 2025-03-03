import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { UserData, UserService } from '../../user.service';
import { ROUTES } from '../../constants/Routes.constant';
import { Job, JobApplication } from '../../users.interface';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
 
@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
}) 
export class UserProfileComponent {

  //need to use signal for userData
  user: UserData |null = null;
  skills: string[] = [];
  appliedJobs: JobApplication[] = [];
  resumeUrl: string = '';
  isResume:boolean = false;
  userData : UserData|null = null;

  userForm: FormGroup = {} as FormGroup;
  updatedJob: any = {}; // Store updated values
  newSkill: string = ''; // Track new skill to be added
  jobSkills: string[] = []; // Track job skills in edit mode
  isEditing: boolean = false; // Toggle edit mode



  constructor(private fb: FormBuilder,private sanitizer: DomSanitizer,private route: ActivatedRoute, private http: HttpClient,private userService: UserService,private router: Router,private toasterService:ToasterService) {}

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    const AUTH_TOEKN = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);

    if (AUTH_TOEKN) {
      this.fetchUserDetails();
      this.fetchUserResume();
      this.fetchUserAppliedJobs();
    }
    this.userForm = this.fb.group({
      name: [this.userData?.name, [Validators.required, Validators.maxLength(50)]],
      phoneNumber: [this.userData?.phoneNumber, [Validators.required, Validators.maxLength(10)]],
      skillsEdit: this.fb.array(this.userData?.skills?.map(skill => this.fb.control(skill, Validators.required)) || [])
    });
  }

  fetchUserDetails(): void {
      this.userData = this.userService.getUserData();
      this.skills = this.userData?.skills??[];
      
  }
getResumePath(resume: string): SafeResourceUrl {
     return this.sanitizer.bypassSecurityTrustResourceUrl(resume+ '#toolbar=1&scrollbar=1&navpanes=1'); 
  }
 
  fetchUserResume(): void {
    this.http.get<any>(`${API_ENDPOINTS.USER_RESUME}`).subscribe({
      next: (response) => {
         if(response?.data?.fileUrl){
            this.isResume = !this.isResume;
            this.resumeUrl = response.data.fileUrl;  
        }
       },  
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }

  deleteResume(): void {
    this.userService.deleteResume().subscribe({
      next: () => {
        this.isResume = !this.isResume;
        this.resumeUrl = '';
        this.toasterService.success(TOASTER_MESSAGES.RESUME_DELETED);
      },
      error: (error) => {
        console.error("Error deleting resume:", error);
      }
    })
    
  }

   fetchUserAppliedJobs(): void {
       this.http.get<any>(`${environment.backendUrl}/job-applications/user`).pipe(take(1)).subscribe({
        next: (response) => {
           if(response.data.length > 0){
            console.log('applied jobs',response.data);
            
            this.appliedJobs = response.data;
          }
          else this.appliedJobs =[];
        },
        error: (error) => {
          console.error("Error fetching applied jobs:", error);
        }
      });
    }
  
    viewJobApplicationDetails(job: JobApplication): void {
        this.userService.setJobApplicationData(job);
        setTimeout(() => {
          this.routeToAppliedJobDetails();
        }, 10); // Small delay ensures the data is available before navigation
        
      }

    routeToAppliedJobDetails(): void {
      this.router.navigate([ROUTES.APPLIED_JOB_DETAILS]);
    }

    get skillsEditingFun(): FormArray {
        return this.userForm.get('skillsEdit') as FormArray;
      }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
        if (this.isEditing && this.userData) {
          this.updatedJob = { ...this.userData };
          this.userForm = this.fb.group({
            name: [this.userData?.name, [Validators.required, Validators.maxLength(50)]],
            phoneNumber: [this.userData?.phoneNumber, [Validators.required, Validators.maxLength(10)]],
            
            skillsEdit: this.fb.array(this.userData?.skills?.map(skill => this.fb.control(skill, Validators.required)) || [])
          });
        }
      }

     updateUser(): void { 
      if(!localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN)) return; 
        this.updatedJob = { ...this.userForm.value, skills: this.userForm.value.skillsEdit};  
        this.userService.updateUser(this.updatedJob).pipe(take(1)).subscribe(
          (response: HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
            this.isEditing = false;
            this.userForm.reset();
            this.userForm = this.fb.group({
              name: ['', [Validators.required, Validators.maxLength(50)]],
              phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],            
              skillsEdit: []
            });
         
            this.userData = this.updatedJob;
            let data: UserData |null = this.userService.getUserData();
            if (this.userData) {
              this.userService.setUserData({
                name: this.userData.name,
                email: data?.email??'',
                phoneNumber: this.userData.phoneNumber,
                isVerifiedEmail: data?.isVerifiedEmail??false,
                isTwoFactorEnabled: data?.isTwoFactorEnabled??false,
                skills: this.userData.skills,
                resume: data?.resume??{fileName:'',storageDirectoryPath:''},
              });
            }
          },
          (error :unknown) => {
            console.error('Error updating job:', error);
          }
        );
      }

      addSkill(skill: string): void {
        if (skill.trim()) {
          this.skillsEditingFun.push(this.fb.control(skill.trim(), Validators.required));
        }
      }
      
      removeSkill(index: number): void {
        this.skillsEditingFun.removeAt(index);    
      }
}
