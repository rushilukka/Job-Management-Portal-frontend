import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import {ROUTES} from "../../constants/Routes.constant";
import { ERROR_MESSAGES } from '../../constants/errorMessages.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
import { UserData, UserService } from '../../../users/user.service';
import { JwtPayload } from '../../auth.interface';
import { take } from 'rxjs';

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

   constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private toasterService : ToasterService
  ) {}

  onLogin() {
    this.authService.login(this.email, this.password).pipe(take(1)).subscribe(
      (response: HttpResponse<StandardResponse<{LoginTokenJWT: string}>>) => {
         
        if (response.status === 200 && response.body?.data?.LoginTokenJWT) {
          const token = response.body.data.LoginTokenJWT;
          this.TokenJWT = token;
         
          if (token) {
            const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
            this.toasterService.success(response.body.message);

             if (decoded.isVerifiedEmail) {
              if (decoded.is2FAEnabled) {
                this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN_2FA}`]);
              } else {
                this.userId = decoded.userId;
                this.authService.check2FAPopupStatus().pipe(take(1)).subscribe((res) => {
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
              this.toasterService.warning(ERROR_MESSAGES.EMAILNOTVERIFIED);
              localStorage.setItem(LOCALSTORAGE.VERIFICATION_PENDING, 'true'); 
              this.router.navigate([`/auth/${ROUTES.AUTH.SIGNUP_VERIFICATION_PENDING}`]);
            }
          }
        } else {
          this.toasterService.warning(ERROR_MESSAGES.UNEXPECTEDRESPONSE);
        }
      },
      (error) => {
        if (error.status === 409) {
          this.router.navigate([`/auth/${ROUTES.AUTH.SIGNUP_VERIFICATION_PENDING}`]);
          this.toasterService.warning(ERROR_MESSAGES.EMAILNOTVERIFIED);
        } else if (error.status === 401) {
          this.toasterService.error(ERROR_MESSAGES.INVALIDCREDENTIALS);
        } else if (error.status === 403) {
          this.toasterService.error(ERROR_MESSAGES.UNAUTHORIZEDACCESS);
        } else {
          this.toasterService.error(ERROR_MESSAGES.LOGINFAILED);
        }
      }
    );
  }

  redirectAfterLogin(decoded: JwtPayload) {
     if(decoded.isAdmin){
      this.router.navigate([ROUTES.ADMIN.DASHBOARD]); 
     }
     else {
      this.userService.getUserDataFromBackend().pipe(take(1)).subscribe(
      (response: HttpResponse<StandardResponse<UserData>>) => {
        if (response.body?.data) {
          const userData: UserData = {
            name: response.body.data.name,
            email: response.body.data.email,
            phoneNumber: response.body.data.phoneNumber,
            isVerifiedEmail: response.body.data.isVerifiedEmail,
            isTwoFactorEnabled: response.body.data.isTwoFactorEnabled,
            skills: response.body.data.skills ?? [], // Ensure an array
            resume: response.body.data.resume? {
                  fileName: response.body.data.resume.fileName,
                  storageDirectoryPath: response.body.data.resume.storageDirectoryPath,
                }: { fileName: '', storageDirectoryPath: '' }, // Default empty Resume
          };
          this.userService.setUserData(userData);
        }
      },
      (error) => {
          throw error
      }
    );
    this.router.navigate([ROUTES.USERS.DASHBOARD]);
   }
  }

  closePopup() {
    this.show2FAPopup = false;
    const decoded = jwtDecode<JwtPayload>(localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN)!);
    this.redirectAfterLogin(decoded);
  }
}
