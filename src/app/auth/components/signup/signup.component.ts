import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/components/toaster.service';
// import {  TOASTER_MESSAGES } from '../../';
import { TOASTER_MESSAGES } from '../../constants/toasterMessages.constant';
import { StandardResponse } from '../../../../interfaces/standard-response.interface';
import { ROUTES } from '../../constants/Routes.constant';
import { LOCALSTORAGE } from '../../constants/local-storage.constant';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  passwordMismatch = false; //   Flag for password mismatch
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private toasterService = inject(ToasterService);

  constructor(private authService: AuthService, private router: Router) {}

 
   // Toggle password visibility
   togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Toggle confirm password visibility
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
 
  onSignup() {
    if(this.name ==''){
      this.toasterService.error(TOASTER_MESSAGES.ENTER_NAME, 'Error');
 
    }
    if(this.email ==''){
      this.toasterService.error(TOASTER_MESSAGES.ENTER_EMAIL, 'Error');
 
    }
    if(this.phoneNumber ==''){
      this.toasterService.error(TOASTER_MESSAGES.ENTER_PHONE_NUMBER, 'Error');
 
    }
    if(this.password ==''){
      this.toasterService.error(TOASTER_MESSAGES.ENTER_PASSWORD, 'Error');
 
    }
    if(this.confirmPassword ==''){
      this.toasterService.error(TOASTER_MESSAGES.ENTER_CONFIRM_PASSWORD, 'Error');
 
    }
    if(this.password.length<8 ){
      this.toasterService.error(TOASTER_MESSAGES.PASSWORD_LENGTH, 'Error');
      
    }
    else if (this.password !== this.confirmPassword) {
      this.toasterService.error(TOASTER_MESSAGES.PASSWORD_MISMATCH, 'Error');
      return;
    }
     else{
       

    const signupData = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password
    };

      this.authService.signup(signupData).subscribe(
        (response: StandardResponse) => {
          if (response.statusCode === 201) {
            // console.log('Signup Successful:', response.message);
            // console.log('User Data:', response.data);
        
            //to access signup verification pending
            // localStorage.setItem('verificationPending', 'true'); 
            localStorage.setItem(LOCALSTORAGE.VERIFICATION_PENDING, 'true'); 
            //   Set flag when visiting signup
  
            this.toasterService.success(TOASTER_MESSAGES.signupSuccess, 'Success');
            // this.router.navigate([AUTH_ROUTES.signupVerificationPending]);
            this.router.navigate([`/auth/${ROUTES.AUTH.SIGNUP_VERIFICATION_PENDING}`]);
     
          }
        },
        (error) => {
          let errorMessage = TOASTER_MESSAGES.UNEXPECTED_ERROR; // Default message
        
          switch (error.status) {
            case 400:
              errorMessage = TOASTER_MESSAGES.BAD_REQUEST;
              break;
            case 401:
              errorMessage = TOASTER_MESSAGES.UNAUTHORIZED;
              break;
            case 403:
              errorMessage = TOASTER_MESSAGES.FORBIDDEN;
              break;
            case 404:
              errorMessage = TOASTER_MESSAGES.NOT_FOUND;
              break;
            case 409:
              errorMessage = TOASTER_MESSAGES.ALREADY_EXISTS;
              break;
            case 500:
              errorMessage = TOASTER_MESSAGES.SERVER_ERROR;
              break;
            case 503:
              errorMessage = TOASTER_MESSAGES.SERVICE_UNAVAILABLE;
              break;
          }
        
          this.toasterService.error(errorMessage, 'Error');
        }      
      );
  }
}
}
