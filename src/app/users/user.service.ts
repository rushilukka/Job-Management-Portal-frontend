import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';
import { StandardResponse } from '../../interfaces/standard-response.interface';
import { Job, JobApplication } from './users.interface';
import { API_ENDPOINTS } from './constants/api-endpoints.constant';
 
 
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

  export enum jobApplicationStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected',
  }

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.backendUrl;
  private userDataKey = environment.LOCALSTORAGE.USER_DATA;
  private jobDataKey = environment.LOCALSTORAGE.JOB_DATA;
  private jobApplicationDataKey = environment.LOCALSTORAGE.JOB_APPLICATION_DATA;

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

  setJobData(data: Job) {
    localStorage.setItem(this.jobDataKey, JSON.stringify(data));
  }

  getJobData(): Job | null {
    const data = localStorage.getItem(this.jobDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearJobData() {
    localStorage.removeItem(this.jobDataKey);
  }

  setJobApplicationData(data: JobApplication ) {
    localStorage.setItem(this.jobApplicationDataKey, JSON.stringify(data));
  }

  getJobApplicationData(): JobApplication | null {
    const data = localStorage.getItem(this.jobApplicationDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearJobApplicationData() {
    localStorage.removeItem(this.jobApplicationDataKey);
  }

  

  getUserDataFromBackend(): Observable<HttpResponse<StandardResponse<UserData>>> {
    const userData = this.http.get<StandardResponse<UserData>>(
      `${environment.backendUrl}/user`,
      { observe: 'response' }
    );
    return userData;
  }

  updateUser(userData: { name: string; phoneNumber: string;  skills: string[]}): Observable<any> {
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
    );
  }

  getUserAppliedJobs(): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    
    return this.http.get<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
    `${environment.backendUrl}/jobs`,           
    { observe: 'response' } 
    );
  }     

  getJobsAvailableJobs(): Observable<HttpResponse<StandardResponse<Job[]|null>>> {
    
    const  jobs = this.http.get<StandardResponse<Job[]|null>>(
      `${environment.backendUrl}/jobs/available-jobs`,
      { observe: 'response' } 
    );
    return jobs?? null;
  }
 

  deleteJobApplication(jobId: string): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    return this.http.delete<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
      `${environment.backendUrl}/job-applications`,
      { body:{"jobId":jobId},
        observe: 'response' }
    );
  }

  applyJob(jobId: string): Observable<HttpResponse<StandardResponse<{ LoginTokenJWT: string }>>> {
    return this.http.post<StandardResponse<{ LoginTokenJWT: string }>>(
      API_ENDPOINTS.APPLY_JOB,
      { jobId: jobId },
      { observe: 'response' }
    );
  }

  uploadResume(formData: FormData): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    return this.http.post<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>(
      API_ENDPOINTS.UPLOAD_RESUME,
      formData,
      { observe: 'response' }
    );
    //want to re render rewsume component after response
  }

  deleteResume(): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    return this.http.delete<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>(
      API_ENDPOINTS.DELETE_RESUME,
      { observe: 'response' }
    );
  }

  getUserAppliedJobDetails(jobId: string): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    return this.http.get<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>(
      API_ENDPOINTS.USER_APPLIED_JOBS,
      { observe: 'response' }
    );
  }
}
  
