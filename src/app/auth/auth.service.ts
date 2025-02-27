import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { JwtPayload, SignUp } from './auth.interface'; 
import { API_ENDPOINTS } from './constants/api-endpoints.constant';
import { jwtDecode } from 'jwt-decode';
import { StandardResponse } from '../../interfaces/standard-response.interface';
import { LOCALSTORAGE } from './constants/local-storage.constant';
import { Role } from './auth.interface'; 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  isAuthenticated(): boolean {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    return !!token; // Returns true if token exists
  }

  getUserRole(): string {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token?token:'');
    const userRole = decoded.isAdmin? Role.admin:Role.candidate;
    return userRole || Role.candidate; // Default to 'user' role if not found
  }

  login(email: string, password: string): Observable<HttpResponse<StandardResponse<{ LoginTokenJWT: string }>>> {
        return this.http.post<StandardResponse<{ LoginTokenJWT: string }>>(
      API_ENDPOINTS.AUTH.LOGIN, 
      { email, password }, 
      { observe: 'response' } // This ensures we get full HttpResponse
    );
  }
    
  signup(signupData: SignUp):Observable<StandardResponse> {
    return this.http.post<StandardResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      signupData
    );
  }

  verifyEmail(token: string): Observable<StandardResponse>{
    return this.http.post<StandardResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  resendVerificationEmail(): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {});
  }

  loginWith2FA(code: string): Observable<StandardResponse<{ LoginTokenJWT: string }>> {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);    
    const body = { code };  
    return this.http.post<StandardResponse<{ LoginTokenJWT: string }>>(API_ENDPOINTS.AUTH.LOGIN_2FA, body);
  }

  enable2FA(): Observable<StandardResponse<{ qrCode: string }>> {
     return this.http.post<StandardResponse<{ qrCode: string }>>(API_ENDPOINTS.AUTH.ENABLE_2FA, {});   
  }

  verify2FA(totp: string): Observable<StandardResponse> {   
    return this.http.post<StandardResponse>(API_ENDPOINTS.AUTH.VERIFY_2FA, { code:totp });
  }
  

  logout(): void {
    localStorage.removeItem(environment.LOCALSTORAGE.AUTH_TOKEN);
  }
 
  check2FAPopupStatus(): Observable<StandardResponse<boolean>> { 
    return this.http.get<StandardResponse<boolean>>(
       API_ENDPOINTS.AUTH.GET_2FA_POPUP_STATUS
    );
  }
 
  disable2FA(): Observable<StandardResponse<boolean>> {
     return this.http.patch<StandardResponse<boolean>>(
      API_ENDPOINTS.AUTH.DISABLE_2FA,{},
     );
  }
  
}
