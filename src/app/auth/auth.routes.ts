import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupVerifiedComponent } from './components/signup-verified/signup-verified.component';
import { Enable2FAComponent } from './components/enable2fa/enable2fa.component';
import { SignupVerificationPendingComponent } from './components/signup-verification-pending/signup-verification-pending.component';
import { Login2faComponent } from './components/login2fa/login2fa.component';
import { ROUTES } from "./constants/Routes.constant"; 
import { AuthReverseGuard } from '../core/guards/auth-reverse.guard';
import { SignupPendingGuard } from '../core/guards/signup-pending.guard';

const routes: Routes = [
  { path: ROUTES.AUTH.LOGIN, component: LoginComponent, canActivate: [AuthReverseGuard] },
  { path: ROUTES.AUTH.LOGIN_2FA, component: Login2faComponent, canActivate: [AuthReverseGuard] },
  { path: ROUTES.AUTH.SIGNUP, component: SignupComponent, canActivate: [AuthReverseGuard] },
  { path: ROUTES.AUTH.SIGNUP_VERIFIED, component: SignupVerifiedComponent, canActivate: [AuthReverseGuard] },
  { path: ROUTES.AUTH.SIGNUP_VERIFICATION_PENDING, component: SignupVerificationPendingComponent, canActivate: [AuthReverseGuard ,SignupPendingGuard] 
  },
  { path: ROUTES.AUTH.ENABLE_2FA, component: Enable2FAComponent, canActivate: [AuthReverseGuard] },

  { path: '**', redirectTo: ROUTES.AUTH.LOGIN, pathMatch: 'full' } // Redirect to login by default
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
