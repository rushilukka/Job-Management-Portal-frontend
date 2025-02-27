import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { AUTH_STORAGE_KEY, } from '../../constants';
import { ERROR_MESSAGES } from '../../constants/errorMessages.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { AuthService } from '../../auth.service';
import { ROUTES } from '../../constants/Routes.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';

@Component({
  selector: 'app-login2fa',
  standalone: false,
  templateUrl: './login2fa.component.html',
  styleUrls: ['./login2fa.component.scss'],
})

export class Login2faComponent {
  totp: string = '';
  authToken: string | null = null;
  email: string = '';

  private toasterService = inject(ToasterService);

  constructor(private router: Router, private http: HttpClient,private authService: AuthService) {}

  ngOnInit() {
    // this.authToken = localStorage.getItem(AUTH_STORAGE_KEY);
    this.authToken = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    if (this.authToken) {
      try {
        const decoded: any = jwtDecode(this.authToken);
        this.email = decoded.email || '';
      } catch (error) {
        this.toasterService.error(ERROR_MESSAGES.invalidToken, 'Authentication Error');
        // this.router.navigate([AUTH_ROUTES.login]);
        
        this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]);
        // console.error('Error decoding token:', error);
      }
    } else {
      this.toasterService.warning(ERROR_MESSAGES.noAuthToken, 'Redirecting...');
      this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]);

  
    }
  }

  onVerifyTOTP() {
    if (!this.totp || this.totp.length !== 6) {
      this.toasterService.warning(ERROR_MESSAGES.invalidTOTP, 'Invalid Input');
      return;
    }

 
 
    this.authService.loginWith2FA(this.totp)
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.data?.LoginTokenJWT) {
            const newToken = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
             const decoded: any = jwtDecode(newToken?newToken:'');
             this.toasterService.success(TOASTER_MESSAGES.totpVerified);
      
             if(decoded.isAdmin){
              this.router.navigate([ROUTES.ADMIN.DASHBOARD]); 
           }
           else if (!decoded.isAdmin){
             this.router.navigate([ROUTES.USERS.DASHBOARD]);
           }
            // this.router.navigate([decoded.isAdmin ? DASHBOARD_ROUTES.admin : DASHBOARD_ROUTES.user]);
            // this.router.navigate([decoded.isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.USERS.DASHBOARD]);
         
          } else {
            this.toasterService.error(ERROR_MESSAGES.invalidTOTP, 'Verification Failed');
       
               }
        },
        (error) => {
          this.toasterService.error(ERROR_MESSAGES.totpVerificationError, 'Error');

              }
      );
  }
}
