import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { ToasterService } from '../../../core/components/toaster.service';
import { AUTH_STORAGE_KEY } from '../../constants';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import {ROUTES} from "../../constants/Routes.constant";
import { ERROR_MESSAGES } from '../../constants/errorMessages.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
import { UserData, UserService } from '../../../users/user.service';
import { AdminService } from '../../../admin/admin.service';

interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  is2FALogin:boolean;
  exp?: number; // Optional expiration timestamp
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  totp = '';
  requires2FA = false;
  userId: string = '';
  show2FAPopup = false;
  TokenJWT = '';

  private toasterService = inject(ToasterService);

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private adminService : AdminService
  ) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (response: HttpResponse<StandardResponse<{LoginTokenJWT: string}>>) => {
         
        if (response.status === 200 && response.body?.data?.LoginTokenJWT) {
          const token = response.body.data.LoginTokenJWT;
          this.TokenJWT = token;
         
          if (token) {
            const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
            this.toasterService.success(response.body.message);

             if (decoded.isVerifiedEmail) {
              if (decoded.is2FAEnabled) {
                
                // this.router.navigate([AUTH_ROUTES.login2FA]);
                this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN_2FA}`]);
              } else {
                this.userId = decoded.userId;
                this.authService.check2FAPopupStatus().subscribe((res) => {
                  if (res.data) {
                    this.ngZone.run(() => {
                      this.show2FAPopup = true;
                      this.changeDetectorRef.detectChanges();
                    });
                  } else {
                    this.redirectAfterLogin(decoded);
                  }
                });
              }
            } else {
              this.toasterService.warning(ERROR_MESSAGES.emailNotVerified);
              
              // Set flag when visiting signup
              //  localStorage.setItem('verificationPending', 'true'); 
               localStorage.setItem(LOCALSTORAGE.VERIFICATION_PENDING, 'true'); 
 
              // this.router.navigate([AUTH_ROUTES.signupVerificationPending]);
              // /auth/signup-verification-pending
              this.router.navigate([`/auth/${ROUTES.AUTH.SIGNUP_VERIFICATION_PENDING}`]);
            }
          }
        } else {
          this.toasterService.warning(ERROR_MESSAGES.unexpectedResponse);
        }
      },
      (error) => {
        if (error.status === 409) {
          this.router.navigate([`/auth/${ROUTES.AUTH.SIGNUP_VERIFICATION_PENDING}`]);
          this.toasterService.warning(ERROR_MESSAGES.emailNotVerified);
        } else if (error.status === 401) {
          this.toasterService.error(ERROR_MESSAGES.invalidCredentials);
        } else if (error.status === 403) {
          this.toasterService.error(ERROR_MESSAGES.unauthorizedAccess);
        } else {
          this.toasterService.error(ERROR_MESSAGES.loginFailed);
        }
      }
    );
  }

  redirectAfterLogin(decoded: JwtPayload) {
    // this.router.navigate([decoded.isAdmin ? DASHBOARD_ROUTES.admin : DASHBOARD_ROUTES.user]);
     if(decoded.isAdmin){
      this.router.navigate([ROUTES.ADMIN.DASHBOARD]); 
      // this.adminService.setAdminDashboard(true);
      // this.userS
      

 
   }
   else if (!decoded.isAdmin){

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
          
    
          console.log('userData----------',userData);
          
          this.userService.setUserData(userData);
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );



     this.router.navigate([ROUTES.USERS.DASHBOARD]);
   }
    // this.router.navigate([decoded.isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.USERS.DASHBOARD]);
  
  }

  closePopup() {
    this.show2FAPopup = false;
    // const decoded = jwtDecode<JwtPayload>(localStorage.getItem(AUTH_STORAGE_KEY)!);
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN)!);
    this.redirectAfterLogin(decoded);
  }
}
