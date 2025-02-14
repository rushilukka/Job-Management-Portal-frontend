import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
 
import { ROUTES } from './constants/Routes.constants';
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
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}
  isAuthenticated(): boolean {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    return !!token; // Returns true if token exists
  }

  getUserRole(): string {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token?token:'');
                
    const userRole = decoded.isAdmin? 'admin': 'candidate';
    
    return userRole || 'candidate'; // Default to 'user' role if not found
  }
     
   getJobsPosted(): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    
    return this.http.get<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
            `${environment.backendUrl}/jobs`,
      { observe: 'response' } 
     );
  }

 //TO Add - when click on a job to get all skills, application received
 
}
