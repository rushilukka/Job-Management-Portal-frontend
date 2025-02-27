import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
 import { Router } from '@angular/router';

 
@Component({
  selector: 'app-signup-verification-pending',
  standalone: false,
  templateUrl: './signup-verification-pending.component.html',
  styleUrls: ['./signup-verification-pending.component.scss']
})
export class SignupVerificationPendingComponent {
  constructor(private authService: AuthService, private toasterService: ToasterService,private router: Router) {}
ngOnInit() {
 
  localStorage.removeItem('verificationPending'); //   Clear flag when user reaches this page

}
  resendVerification() {
    this.authService.resendVerificationEmail().subscribe(
      () => {
        this.toasterService.success(TOASTER_MESSAGES.verificationEmailResent, 'Success'); //   Show success message
      },
      (error) => {
      
        this.toasterService.error(TOASTER_MESSAGES.verificationResendFailed, 'Error'); //   Show error message
      }
    );
  }
}
