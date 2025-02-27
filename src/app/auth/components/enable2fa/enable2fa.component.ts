import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { Router } from '@angular/router';
// import ROUTES
import { ROUTES } from "../../constants/Routes.constant";
import { MESSAGES } from '../../constants/Messages.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
@Component({
  selector: 'app-enable2fa',
  standalone: false,
  templateUrl: './enable2fa.component.html',
  styleUrl: './enable2fa.component.scss'
})
export class Enable2FAComponent {
  qrCodeUrl = '';
  totp = '';
  private toasterService = inject(ToasterService);
  Token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
       

  constructor(private authService: AuthService,private router: Router) {
    this.authService.enable2FA(this.Token ? this.Token : '').subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          // console.log(response.data.qrCode);
          this.qrCodeUrl = response.data?.qrCode?response.data.qrCode:'';
           }
      },
      error: (error) => {
        this.toasterService.error(error.error?.message || 'Failed to enable 2FA', 'Error'); // Handle error
      },
    });
  

  };
// 
  async verify() {
    this.Token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    await this.authService.verify2FA(this.totp,this.Token?this.Token:'').subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
           this.toasterService.success(response.message, MESSAGES.TWO_FA.ENABLE_SUCCESS); // Show success message
            this.router.navigate([`${ROUTES.USERS.DASHBOARD}`]); // Redirect to 
        
        }
      },
      error: (error) => {
        this.toasterService.error(error.error?.message || MESSAGES.TWO_FA.ENABLE_FAILED, 'Error'); // Handle error
      },
    });

  }
   
}

