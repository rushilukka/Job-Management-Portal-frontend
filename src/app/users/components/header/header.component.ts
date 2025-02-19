import { Component } from '@angular/core';
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
  constructor(private router: Router,private userService: UserService) {}
  ngOnInit() {

    this.userService.getUserDataFromBackend().subscribe(
      (response: HttpResponse<StandardResponse<UserData>>) => {
        if (response.body?.data) {
          const userData = {
            uuid: response.body.data.uuid,
            roleId: String(response.body.data.roleId), // Ensure roleId is a string
            name: response.body.data.name,
            email: response.body.data.email,
            phoneNumber: response.body.data.phoneNumber,
            password: response.body.data.password,
            isVerifiedEmail: response.body.data.isVerifiedEmail,
            verificationToken: response.body.data.verificationToken ?? null,
            verificationTokenExpiration: response.body.data.verificationTokenExpiration ?? null,
            twoFactorSecret: response.body.data.twoFactorSecret ?? '', // Ensure a string
            isTwoFactorEnabled: response.body.data.isTwoFactorEnabled,
            is2FARemPopUp: response.body.data.is2FARemPopUp,
            createdAt: response.body.data.createdAt,
            updatedAt: response.body.data.updatedAt
          };
    
          console.log('userData----------',userData);
          this.userName = userData?.name?? '';
          
          this.userService.setUserData(userData);
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    // const userDetails = this.userService.getUserData();


  }
  settings() {
    this.router.navigate(['/users/settings']);
    
  }
  myprofile() {
    this.router.navigate(['/users/profile']);
  }

  logout() {
   localStorage.removeItem(environment.LOCALSTORAGE.AUTH_TOKEN); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.VERIFICATION_PENDING); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.JOB_DATA); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.USER_DATA); // 🔥 Clear token
        localStorage.removeItem(environment.LOCALSTORAGE.ADMIN_DATA); // 🔥 Clear token
       
  
    this.router.navigate(['/auth/login']); // 🔄 Redirect to login
  }
}
