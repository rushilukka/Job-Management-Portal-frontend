import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constant';
import { MESSAGES } from '../../constants/Messages.constant';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../admin/admin.service';
import { environment } from '../../../../environments/environments';
import { Resume, UserData, UserService } from '../../user.service';
import { ROUTES } from '../../constants/Routes.constant';
import { Job } from '../../users.interface';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AUTH_STORAGE_KEY } from '../../../auth/constants';
   
 
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
  appliedJobs: Job[] = [];
  resumeUrl: string = '';
  isResume:boolean = false;
  userData : UserData|null = null;

  userForm: FormGroup = {} as FormGroup;
  updatedJob: any = {}; // Store updated values
  newSkill: string = ''; // Track new skill to be added
  jobSkills: string[] = []; // Track job skills in edit mode
  isEditing: boolean = false; // Toggle edit mode



  constructor(private fb: FormBuilder,private sanitizer: DomSanitizer,private route: ActivatedRoute, private http: HttpClient,private userService: UserService,private router: Router) {}

  ngOnInit(): void {
      this.userData = this.userService.getUserData();
      // const userDataFromBackend = this.userService.getUserDataFromBackend();
      // console.log('userDataFromBackend',userDataFromBackend);
      
      const AUTH_TOEKN = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);

    // const userId = '6f770236-3d24-45d1-88c6-edba6a9d0894';
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
        console.log('this.userData', this.userForm.value);

        // const id = this.userData ? this.userData.id : null;
        // this.id = id;
        // console.log('Job ID from service:', id);
    
        // Initialize updatedJob with userData if userData is available
        // if (this.userData) {
        //   this.updatedJob = { ...this.userData };
        //   // this.jobSkills = [...this.userData.skills]; // Initialize jobSkills with existing data
        // }

  }

  fetchUserDetails(): void {
      this.userData = this.userService.getUserData();
      this.skills = this.userData?.skills??[];
     console.log('profile data  - ',this.userData);
     
  }
getResumePath(resume: string): SafeResourceUrl {
    // this.resumeUrl;
    return this.sanitizer.bypassSecurityTrustResourceUrl(resume+ '#toolbar=1&scrollbar=1&navpanes=1');
    
  }
 
  fetchUserResume(): void {
    this.http.get<any>(`${API_ENDPOINTS.USER_RESUME}`).subscribe({
      next: (response) => {
         if(response.data.fileUrl){
            this.isResume = !this.isResume;
            this.resumeUrl = response.data.fileUrl;
           
        }
       },  
      error: (error) => {
        console.error("Error fetching user skills:", error);
      }
    });
  }

   fetchUserAppliedJobs(): void {
       this.http.get<any>(`${environment.backendUrl}/job-applications/user`).subscribe({
        next: (response) => {
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
  
    viewJobDetails(job: Job): void {
        this.userService.setJobData(job);
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
      if(!localStorage.getItem(AUTH_STORAGE_KEY)) return; 
    
        // console.log('Updated Job:', this.updatedJob);
    
        // const ObjectofSkills = this.userForm.value.skills;
        // const ArrayofSkills:string[] = this.userForm.value.skills;
         
            
        // Array.from(this.userForm.value.skills).forEach((skill: string) => {
    
        // })
        // Call the service to update the job
        // this.updatedJob = this.userForm.value;
        this.updatedJob = { ...this.userForm.value, skills: this.userForm.value.skillsEdit};
    
        console.log('Updated Job:', this.updatedJob);
        
        this.userService.updateUser(this.updatedJob).subscribe(
          (response: HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>) => {
            console.log('User updated:', response);
            this.isEditing = false;
    
            this.userForm.reset();
            this.userForm = this.fb.group({
              name: ['', [Validators.required, Validators.maxLength(50)]],
              phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
              
              skillsEdit: []
            });
            
    
            this.userData = this.updatedJob;
            console.log('this.userData to submit ----', this.userData);
            

            let data: UserData |null = this.userService.getUserData();
            console.log('data 1 1 1  11 ',data);
            
            // // data = {}
            // if (this.userData) this.userService.setUserData({...data,name:this.userData.name});

            if (this.userData) {
              this.userService.setUserData({
                name: this.userData.name,
                email: data?.email??'',
                phoneNumber: this.userData.phoneNumber,
                isVerifiedEmail: data?.isVerifiedEmail??false,
                isTwoFactorEnabled: data?.isTwoFactorEnabled??false,
                skills: this.userData.skills,
                resume: data?.resume??{fileName:'',storageDirectoryPath:''},
                // ...(this.userService.getUserData() as UserData), // Ensure all required fields exist
                // ...this.userData, // Update only available fields
                // name: data?.name??'',
                // skills: data?.skills ?? this.userData.skills,
                // phoneNumber: data?.phoneNumber ?? this.userData.phoneNumber
              });
            }
            console.log(this.userService.getUserData());
            
          },
          (error :unknown) => {
            console.error('Error updating job:', error);
          }
        );
      }
    



     addSkill(skill: string): void {
        console.log('skill', skill);
        if (skill.trim()) {
          this.skillsEditingFun.push(this.fb.control(skill.trim(), Validators.required));
        }
        console.log('this.skills.value-----', this.skillsEditingFun.value);
        
      }
      
      removeSkill(index: number): void {
        this.skillsEditingFun.removeAt(index);
        console.log(index);
        console.log('this.skills.value-----', this.skillsEditingFun.value);
        
      }
}
