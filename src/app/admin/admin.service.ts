import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
 
import { ROUTES } from './constants/Routes.constants';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';
import { StandardResponse } from '../../interfaces/standard-response.interface';
 
 
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
  // private userDataKey = 'userData';
  // private jobDataKey = 'jobData';
  private userDataKey = environment.LOCALSTORAGE.USER_DATA;
  private adminDataKey = environment.LOCALSTORAGE.ADMIN_DATA;
  private jobDataKey = environment.LOCALSTORAGE.JOB_DATA;

//implement admin data storage 

  setUserData(data: {
    uuid: string;
    roleId: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    isVerifiedEmail: boolean;
    verificationToken: string | null;
    verificationTokenExpiration: string | null;
    twoFactorSecret: string;
    isTwoFactorEnabled: boolean;
    is2FARemPopUp: boolean;
    createdAt: string;
    updatedAt: string;
  }) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getUserData(): {
    uuid: string;
    roleId: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    isVerifiedEmail: boolean;
    verificationToken: string | null;
    verificationTokenExpiration: string | null;
    twoFactorSecret: string;
    isTwoFactorEnabled: boolean;
    is2FARemPopUp: boolean;
    createdAt: string;
    updatedAt: string;
  } | null {
    const data = localStorage.getItem(this.userDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserData() {
    localStorage.removeItem(this.userDataKey);
  }

  setJobData(data: { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string,skills:string[] }) {
   console.log('data-----',data);
   
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
  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}
  isAuthenticated(): boolean {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    return !!token; // Returns true if token exists
  }

     
   getJobsPosted(): Observable<HttpResponse<{ statusCode: number; message: string; data: { LoginTokenJWT: string } }>> {
    
    return this.http.get<{ statusCode: number; message: string; data: { LoginTokenJWT: string }}>(
            `${environment.backendUrl}/jobs`,
      { observe: 'response' } 
     );
  }
 //TO Add - when click on a job to get all skills, application received
 
 fetchJobs(): Observable<HttpResponse<StandardResponse<[]>>> {

  return this.http.get<StandardResponse<[]>>(
          `${environment.backendUrl}/jobs`,
    { observe: 'response' } 
   );
 }

  // Update job details
//   updateJob(jobData: {id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string}): Observable<any> {
//     console.log('jobData-_-__-___-',jobData);

    
//     // return this.http.patch(`${this.apiUrl}/jobs`, jobData);
//     return this.http.patch<StandardResponse<[]>>(
//       `${environment.backendUrl}/jobs`,
//      jobData,
// { observe: 'response' } ,
// );
// }
updateJob(jobData: { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string , skills: string[]}): Observable<any> {
  console.log('jobData:', jobData);

  const sendData={
    id:String(jobData.id),
  }
  const sendJobData={
    id:String(jobData.id),
     jobTitle:jobData.jobTitle,
    location:jobData.location,
    jobDescription:jobData.jobDescription,
    salaryRange:jobData.salaryRange,
    skills:jobData.skills
  }
  console.log(typeof(sendJobData.id));
  console.log(sendJobData.id);
  
  return this.http.patch<StandardResponse<[]>>(
    `${environment.backendUrl}/jobs`,
    sendJobData,  // Send jobData directly instead of wrapping it inside another object
    { observe: 'response' }
  );
}




  addJob(jobData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, jobData);
  }
}
