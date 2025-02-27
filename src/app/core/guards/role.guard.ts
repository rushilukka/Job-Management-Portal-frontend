import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../../auth/constants/local-storage.constant';

interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  is2FALogin: boolean;
  exp?: number; // Optional expiration timestamp
}
@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = 'admin';
    const userRole = this.authService.getUserRole(); // Get user role from AuthService
    let token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token?token:'');
    let x = decoded.is2FALogin?decoded.is2FALogin:false;
    if (decoded.isAdmin) {
      if(decoded.is2FAEnabled && !(decoded.is2FALogin?decoded.is2FALogin:false)) {
        this.router.navigate(['/auth/login-2fa']);
        return false;
      }     
      return true;
    }
    else{
     this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
