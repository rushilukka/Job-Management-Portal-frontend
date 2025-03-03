import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserData, UserService } from '../../user.service';
import { environment } from '../../../../environments/environments';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName:string = '';
  isDropdownVisible: boolean = false;
  

  constructor(private router: Router,private userService: UserService) {}
  ngOnInit() {
    this.userService.getUserDataFromBackend().subscribe(
      (response: HttpResponse<StandardResponse<UserData>>) => {
        if (response.body?.data) {
          const userData: UserData = {
            name: response.body.data.name,
            email: response.body.data.email,
            phoneNumber: response.body.data.phoneNumber,
            isVerifiedEmail: response.body.data.isVerifiedEmail,
            isTwoFactorEnabled: response.body.data.isTwoFactorEnabled,
            skills: response.body.data.skills ?? [], // Ensure an array
            resume: response.body.data.resume
              ? {
                  fileName: response.body.data.resume.fileName,
                  storageDirectoryPath: response.body.data.resume.storageDirectoryPath,
                }
              : { fileName: '', storageDirectoryPath: '' }, // Default empty Resume
          };
          this.userName = userData?.name?? '';
          this.userService.setUserData(userData);
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  
    @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;
  
    toggleDropdown(event: Event): void {
      event.stopPropagation(); // Prevents the event from bubbling up
      this.isDropdownVisible = !this.isDropdownVisible;
    }
  
    @HostListener('document:click', ['$event'])
    closeDropdown(event: Event): void {
      if (this.dropdownMenu && !this.dropdownMenu.nativeElement.contains(event.target)) {
        this.isDropdownVisible = false;
      }
    }
  settings() {
    this.router.navigate(['/users/settings']);
    
  }
  myprofile() {
    this.router.navigate(['/users/profile']);
  }

  logout() {
   localStorage.removeItem(environment.LOCALSTORAGE.AUTH_TOKEN); 
        localStorage.removeItem(environment.LOCALSTORAGE.VERIFICATION_PENDING); 
        localStorage.removeItem(environment.LOCALSTORAGE.JOB_DATA); 
        localStorage.removeItem(environment.LOCALSTORAGE.USER_DATA); 
        localStorage.removeItem(environment.LOCALSTORAGE.ADMIN_DATA); 
       
  
    this.router.navigate(['/auth/login']); //  Redirect to login
  }
}
