import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
 
// import { ROUTES } from './constants/Routes.constants';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';
import { StandardResponse } from '../../interfaces/standard-response.interface';
import { Job } from './users.interface';
 
 
interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  exp?: number; // Optional expiration timestamp
}

export interface Resume {
  fileName: string;
  storageDirectoryPath: string;
}

export interface UserData {
   name: string;
  email: string;
  phoneNumber: string;
   isVerifiedEmail: boolean;
  isTwoFactorEnabled: boolean;
   skills: string[];
  resume: Resume;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.backendUrl;
  private userDataKey = environment.LOCALSTORAGE.USER_DATA;
  private jobDataKey = environment.LOCALSTORAGE.JOB_DATA;


  constructor(private http: HttpClient) {}


  setUserData(data:  {
    name: string;
   email: string;
   phoneNumber: string;
    isVerifiedEmail: boolean;
   isTwoFactorEnabled: boolean;
    skills: string[];
   resume: Resume;
 }) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getUserData():  {
    name: string;
   email: string;
   phoneNumber: string;
    isVerifiedEmail: boolean;
   isTwoFactorEnabled: boolean;
    skills: string[];
   resume: Resume;
 } | null {
    const data = localStorage.getItem(this.userDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserData() {
    localStorage.removeItem(this.userDataKey);
  }

  setJobData(data: { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string,skills:string[] }) {
    localStorage.setItem(this.jobDataKey, JSON.stringify(data));
  }

  getJobData(): { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string,skills:string[] } | null {
    
    const data = localStorage.getItem(this.jobDataKey);
    console.log('getJobData-----',JSON.parse(data?data:''));
    return data ? JSON.parse(data) : null;
  }

  clearJobData() {
    localStorage.removeItem(this.jobDataKey);
  }



  getUserDataFromBackend(): Observable<HttpResponse<StandardResponse<UserData>>> {
    // const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userData = this.http.get<StandardResponse<UserData>>(
      `${environment.backendUrl}/user`,
      { observe: 'response' }
    );
    return userData;
  }

  // updateUser(): Observable<HttpResponse<StandardResponse<UserData>>>{}
  updateUser(userData: { name: string; phoneNumber: string;  skills: string[]}): Observable<any> {
    console.log('userData:', userData);
  
     
    const senduserData={
      name:userData.name,
      phoneNumber:userData.phoneNumber,
      skills:userData.skills
    } 
    
    return this.http.patch<StandardResponse<[]>>(
      `${environment.backendUrl}/user`,
      senduserData,  // Send userData directly instead of wrapping it inside another object
      { observe: 'response' }
    );
  }
  


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
     
   getJobsToBeApply(): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    
    return this.http.get<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
            `${environment.backendUrl}/jobs`,
{ observe: 'response' } 
      //       `${this.apiUrl}${ROUTES.GET_JOBS_POSTED}?postedBy=${postedBy}`,
    );
  }

  getUserAppliedJobs(): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    
    return this.http.get<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
            `${environment.backendUrl}/jobs`,           
{ observe: 'response' } 
      //       `${this.apiUrl}${ROUTES.GET_JOBS_POSTED}?postedBy=${postedBy}`,
    );
  }     

  getJobsAvailableJobs(): Observable<HttpResponse<StandardResponse<Job[]|null>>> {
    
    const  jobs = this.http.get<StandardResponse<Job[]|null>>(
      `${environment.backendUrl}/jobs/available-jobs`,
      { observe: 'response' } 
      //       `${this.apiUrl}${ROUTES.GET_JOBS_POSTED}?postedBy=${postedBy}`,
    );
    console.log('getJobsAvailableJobs',jobs);
    return jobs?? null;
  }
 

  deleteJobApplication(jobId: string): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    return this.http.delete<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
      `${environment.backendUrl}/job-applications`,
      
      { body:{"jobId":jobId},
        observe: 'response' }
    );
  }
}
