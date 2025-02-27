import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http'; 
import { ERROR_MESSAGES } from '../../constants/errorMessages.constant';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { AuthService } from '../../auth.service';
import { ROUTES } from '../../constants/Routes.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
import { take } from 'rxjs';

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
 
  constructor(private router: Router, private http: HttpClient,private authService: AuthService,private toasterService:ToasterService) {}

  ngOnInit() {
    this.authToken = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    if (this.authToken) {
      try {
        const decoded: any = jwtDecode(this.authToken);
        this.email = decoded.email || '';
      } catch (error) {
        this.toasterService.error(ERROR_MESSAGES.INVALIDTOKEN, 'Authentication Error');     
        this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]);
      }
    } else {
      this.toasterService.warning(ERROR_MESSAGES.NOAUTHTOKEN, 'Redirecting...');
      this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]); 
    }
  }

  onVerifyTOTP() {
    if (!this.totp || this.totp.length !== 6) {
      this.toasterService.warning(ERROR_MESSAGES.INVALIDTOTP, 'Invalid Input');
      return;
    }
 
    this.authService.loginWith2FA(this.totp).pipe(take(1)).subscribe(
        (response) => {
          if (response.statusCode === 200 && response.data?.LoginTokenJWT) {
              const newToken = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
              const decoded: any = jwtDecode(newToken?newToken:'');
              this.toasterService.success(TOASTER_MESSAGES.totpVerified);
              if(decoded.isAdmin)
                this.router.navigate([ROUTES.ADMIN.DASHBOARD]); 
              else
                this.router.navigate([ROUTES.USERS.DASHBOARD]);
          } 
          else {
            this.toasterService.error(ERROR_MESSAGES.INVALIDTOTP, 'Verification Failed');
          }
        },
        (error) => {
          this.toasterService.error(ERROR_MESSAGES.TOTPVERIFICATIONERROR, 'Error');
        }
      );
  }
}
