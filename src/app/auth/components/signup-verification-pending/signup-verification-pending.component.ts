import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';
import { take } from 'rxjs';
 
@Component({
  selector: 'app-signup-verification-pending',
  standalone: false,
  templateUrl: './signup-verification-pending.component.html',
  styleUrls: ['./signup-verification-pending.component.scss']
})
export class SignupVerificationPendingComponent {
  constructor(private authService: AuthService, private toasterService: ToasterService) {}
  
  ngOnInit() {
    //   Clear flag when user reaches this page
   localStorage.removeItem(LOCALSTORAGE.VERIFICATION_PENDING); 
  }

  resendVerification() {
    this.authService.resendVerificationEmail().pipe(take(1)).subscribe(
      () => {
        this.toasterService.success(TOASTER_MESSAGES.verificationEmailResent, 'Success'); 
      },
      (error) => {
        this.toasterService.error(TOASTER_MESSAGES.verificationResendFailed, 'Error'); 
      }
    );
  }
}
