import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';



interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  is2FALogin: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}
@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = 'admin';
    // route.data['roles'] as string[];
    const userRole = this.authService.getUserRole(); // Get user role from AuthService
    let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    // let decoded = jwtDecode
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token?token:'');
              
           console.log('role guard -----------------------',decoded.isAdmin);
           
    if (!decoded.isAdmin) {
        if(decoded.is2FAEnabled && !(decoded.is2FALogin?decoded.is2FALogin:false)) {
            this.router.navigate(['/auth/login-2fa']);
    
            return false;
        }
 
      return true;
    }
    else {
    // Redirect to unauthorized page if role not allowed
    this.router.navigate(['/unauthorized']);
    return false;
    }
  }
}
