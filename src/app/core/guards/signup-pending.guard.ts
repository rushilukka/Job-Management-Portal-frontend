import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LOCALSTORAGE } from '../../auth/constants/local-storage.constant';

@Injectable({
  providedIn: 'root'
})
export class SignupPendingGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    
    const verificationPending = localStorage.getItem(LOCALSTORAGE.VERIFICATION_PENDING); 
    //   Check flag

    if (verificationPending) {
      return true; //   Allow access
    } else {
      this.router.navigate(['/auth/signup']); // Redirect to signup
      return false;
    }
  }
}
