import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';
import { ToasterService } from '../core/components/toaster.service';
import { ERROR_MESSAGES } from '../auth/constants/errorMessages.constant';


//will work every time - but here for request to server only 
//only handling requests to the server by attaching the JWT except for login, signup, and email verification.

interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}
@Injectable()
export class SetHeaders_CheckExpireJWT_Interceptor implements HttpInterceptor {
  
  constructor(private router: Router,private tosterService:ToasterService) {}

  private excludedEndpoints = [
    `${environment.backendUrl}/auth/login`,
    // 'http://localhost:3000/auth/login',
    `${environment.backendUrl}/auth/signup`,
    `${environment.backendUrl}/auth/verify-email`
  ]; // List of exact endpoints to exclude

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);  

    if (this.excludedEndpoints.some(url => req.url === url)) {
      return next.handle(req);
    }   

     // 🛑 Check if JWT is expired before sending request
     if (token && this.isTokenExpired(token)) {
      console.warn('🔴 JWT expired! Logging out...');
      this.handleLogout();
      throw new Error('Session Expired! Please log in again.');
    }
   
     // Clone request and set the Authorization header only if a token is available
     if (token) {
      console.log('  Setting Authorization Header:', `Bearer ${token}`);

      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('🛠 Cloned Request with Headers:', clonedReq);
      return next.handle(clonedReq);
    }
 

    return next.handle(req);
  }

   // 🔍 Function to check if JWT is expired
   private isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token?token:'');
      console.log('decoded.exp',decoded.exp);
                      
         if(decoded?.exp){
          const expiry = decoded.exp * 1000; // Convert expiry to milliseconds
          return Date.now() > expiry; // Compare expiry time with current time
          
         }else {
         this.tosterService.error('Session Expired! Please log in again.');
          return true; // Assume expired if decoding fails
         }
      // const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
         } catch (e) {
          return true;
    }
  }

  // 🔄 Function to handle logout
  private handleLogout() {
    localStorage.removeItem('authToken'); // Remove expired token
     this.tosterService.warning(ERROR_MESSAGES.SESSIONEXPIRED, 'Redirecting...');
       
    this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: 'true' } }); // Redirect to login
  }
}
