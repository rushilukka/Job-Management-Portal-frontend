import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { ToasterService } from '../../../shared/Toaster/toaster.service';
import { AuthService } from '../../auth.service';
import { ROUTES } from '../../constants/Routes.constant';
import { take } from 'rxjs';

@Component({
  selector: 'app-signup-verified',
  standalone: false,
  templateUrl: './signup-verified.component.html',
  styleUrl: './signup-verified.component.scss'
})
export class SignupVerifiedComponent implements OnInit {
  verificationMessage: string = TOASTER_MESSAGES.emailVerificationFailed;
  isSuccess: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toasterService:ToasterService,
    private authService: AuthService     
  ) {}

  ngOnInit(): void {
    this.verifyEmail();
  }

  verifyEmail(): void {
    const token = this.route.snapshot.queryParamMap.get('token'); 
    // email verification token
    if (!token) {
      this.verificationMessage = TOASTER_MESSAGES.invalidVerificationToken;
      this.isSuccess = false;
      return;
    }
 
    this.authService.verifyEmail(token).pipe(take(1)).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.verificationMessage = TOASTER_MESSAGES.emailVerificationSuccess;
          this.toasterService.success(this.verificationMessage);
          this.isSuccess = true;
        } else {
          this.verificationMessage = response.message;
          this.toasterService.error(this.verificationMessage, 'Error');
          this.isSuccess = false;
        }
      },
      error: (error) => {
        this.toasterService.error(TOASTER_MESSAGES.emailVerificationFailed);
        this.verificationMessage = error.error?.message || TOASTER_MESSAGES.emailVerificationFailed;
        this.isSuccess = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate([`/auth/${ROUTES.AUTH.LOGIN}`]);  
  }
}
