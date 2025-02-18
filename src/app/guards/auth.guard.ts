import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ROUTES } from '../auth/constants/Routes.constant';
import { ToasterService } from '../core/components/toaster.service';
import { ERROR_MESSAGES } from '../auth/constants/errorMessages.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private tosterService:ToasterService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    else{
    // Redirect to login if not authenticated
    // this.router.navigate(['/unauthorized']);
    this.tosterService.warning(ERROR_MESSAGES.SESSIONEXPIRED, 'Redirecting...');
    this.router.navigate(['/auth/login']);
      //  this.router.navigate([ROUTES.AUTH.LOGIN]);
    return false;}
  }
}
