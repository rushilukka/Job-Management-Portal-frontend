import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthRoutingModule } from './auth.routes';
import { SignupVerifiedComponent } from './components/signup-verified/signup-verified.component';
import { SignupVerificationPendingComponent } from './components/signup-verification-pending/signup-verification-pending.component';
import { Enable2FAComponent } from './components/enable2fa/enable2fa.component';
 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Login2faComponent } from './components/login2fa/login2fa.component';
// import { Popup2faComponent } from './components/popup2fa/popup2fa.component';
import { PopupComponent } from './components/popup/popup.component';
// import PopUp
@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    SignupVerifiedComponent,
    SignupVerificationPendingComponent,
    Enable2FAComponent,
      
     Login2faComponent,
      PopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule //   Add AuthRoutingModule here
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } //   Provide the interceptor
  ],
  exports:[ ]
})
export class AuthModule { }
