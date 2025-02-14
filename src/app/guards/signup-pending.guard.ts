import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignupPendingGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    
    const verificationPending = localStorage.getItem('verificationPending'); //   Check flag

    // const signupStarted = localStorage.getItem('signupStarted'); //   Check flag

    if (verificationPending) {
      return true; //   Allow access
    } else {
      this.router.navigate(['/auth/signup']); // 🔄 Redirect to signup
      return false;
    }
  }
}
