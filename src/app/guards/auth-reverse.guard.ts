import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';


interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}

@Injectable({
  providedIn: 'root'
})
export class AuthReverseGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      console.log('Redirect authenticated users to dashboard');
      console.log('token', localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN));
      const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token?token:'');
        
        if(decoded.isAdmin){
             console.log('decoded.is2FAEnabled -----',decoded.is2FAEnabled);
            
          // if(decoded.is2FAEnabled){
          //   this.router.navigate(['/auth/login-2fa']); //   Redirect authenticated users to dashboard
          //   return false;   
          // }
          // else {
          // this.router.navigate(['/admin/dashboard']); //   Redirect authenticated users to dashboard
          // return false; 
          // } 
        }
      else if (!decoded.isAdmin){
        console.log('decoded.is2FAEnabled -----',decoded.is2FAEnabled);
          
        // if(decoded.is2FAEnabled){
        //   this.router.navigate(['/auth/login-2fa']); //   Redirect authenticated users to dashboard
        //   return true;   
        // }
        // else {
        //   this.router.navigate(['/users/dashboard']); //   Redirect authenticated users to dashboard
        //   return false;
        //   }

      
      }
      else if(!decoded.isVerifiedEmail){
        console.log('isVerifiedEmail----------------  for sign up verification pending to not access , redirect to login');
        
        this.router.navigate(['/auth/login']); 
        return false;
      }

    }
    return true;
  }
}
