import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { LOCALSTORAGE } from '../auth/constants/local-storage.constant';
import { StandardResponse } from '../../interfaces/standard-response.interface';
import { JobApplicationDetails, JobApplicationsByJobId, JobDetails, UserData } from './admin.interface';
import { Job, JobApplicationWithJobData,JobApplicationWithJobAndUserData } from '../users/users.interface';
import { API_ENDPOINTS } from './constants/api-endpoints.constant';
import { jobApplicationStatus, Resume } from '../users/user.service';
 
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private userDataKey = environment.LOCALSTORAGE.USER_DATA;
  private jobDataKey = environment.LOCALSTORAGE.JOB_DATA;
  private jobApplicationDataKey = environment.LOCALSTORAGE.JOB_APPLICATION_DATA;

  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  setUserData(data: UserData) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getUserData(): UserData| null {
    const data = localStorage.getItem(this.userDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserData() {
    localStorage.removeItem(this.userDataKey);
  }

  setJobData(data: Job) {
      localStorage.setItem(this.jobDataKey, JSON.stringify(data));
  }

  getJobData(): Job| null {
    const data = localStorage.getItem(this.jobDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearJobData() {
    localStorage.removeItem(this.jobDataKey);
  }

    setJobApplicationData(data: JobApplicationWithJobData ) {
      localStorage.setItem(this.jobApplicationDataKey, JSON.stringify(data));
    }
  
    getJobApplicationData(): JobApplicationWithJobData | null {
      const data = localStorage.getItem(this.jobApplicationDataKey);
      return data ? JSON.parse(data) : null;
    }

    clearJobApplicationData() {
      localStorage.removeItem(this.jobApplicationDataKey);
    }

  

  /*
  setJobApplicationData(data: JobApplicationWithJobAndUserData ) {
      localStorage.setItem(this.jobApplicationDataKey, JSON.stringify(data));
    }
  
    getJobApplicationData(): JobApplicationWithJobAndUserData | null {
      const data = localStorage.getItem(this.jobApplicationDataKey);
      return data ? JSON.parse(data) : null;
    }

    clearJobApplicationData() {
      localStorage.removeItem(this.jobApplicationDataKey);
    }


*/
    getJobApplicationDataFromBackend(jobApplicationId: string): Observable<HttpResponse<StandardResponse<JobApplicationWithJobData>>> {
      const jobApplication = this.http.get<StandardResponse<JobApplicationWithJobData>>(
        `${API_ENDPOINTS.GET_JOB_APPLICATIONS_BY_JOB_ID}/?jobId=${jobApplicationId}`,
        { observe: 'response' } 
      );
      return jobApplication;
    }

   
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem(LOCALSTORAGE.AUTH_TOKEN);
    return !!token; // Returns true if token exists
  }

     
  getJobsPosted(): Observable<HttpResponse<StandardResponse<JobDetails[] >>> {
  return this.http.get<StandardResponse<JobDetails[] >>(
          `${environment.backendUrl}/jobs`,
    { observe: 'response' } 
    );
  }

  fetchJobs(): Observable<HttpResponse<StandardResponse<[]>>> {

    return this.http.get<StandardResponse<[]>>(
            `${environment.backendUrl}/jobs`,
      { observe: 'response' } 
    );
  }
 
 fetchUsers(): Observable<HttpResponse<StandardResponse<{users:UserData[],number:number}>>> {
  return this.http.get<StandardResponse<{users:UserData[],number:number}>>(
          `${environment.backendUrl}/admin/users`,
    { observe: 'response' } 
   );
 }

 updateJob(jobData: { id: string; jobTitle: string; location: string; jobDescription: string; salaryRange: string , skills: string[]}): Observable<HttpResponse<StandardResponse<[]>>> {
 
  
  const sendJobData={
    id:String(jobData.id),
     jobTitle:jobData.jobTitle,
    location:jobData.location,
    jobDescription:jobData.jobDescription,
    salaryRange:jobData.salaryRange,
    skills:jobData.skills
  }
 
  return this.http.patch<StandardResponse<[]>>(
    `${environment.backendUrl}/jobs`,
    sendJobData,  // Send jobData directly instead of wrapping it inside another object
    { observe: 'response' }
    );
  }

  addJob(jobData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, jobData);
  }

  fetchUserSkills(userId:string):Observable<HttpResponse<StandardResponse<string[]>>>{
    return this.http.get<StandardResponse<string[]>>(`${API_ENDPOINTS.USER_SKILLS}?userId=${userId}`,
      { observe: 'response' } // This ensures you get the full HttpResponse
    );
  }

  fetchUserResume(userId:string):Observable<HttpResponse<StandardResponse<Resume>>>{
        const resp = this.http.get<StandardResponse<Resume>>(`${API_ENDPOINTS.USER_RESUME}?userId=${userId}`,
      { observe: 'response' } // This ensures you get the full HttpResponse
    )
    return resp;
  }

  fetchUserAppliedJob(userId:string):Observable<HttpResponse<StandardResponse<JobApplicationDetails[]>>>{
    return this.http.get<StandardResponse<JobApplicationDetails[]>>(`${API_ENDPOINTS.USER_APPLIED_JOBS}?userId=${userId}`,

      { observe: 'response' }
    )
  }

  fetchUserAppliedJobWithJobId(userId:string,jobId:string):Observable<HttpResponse<StandardResponse<JobApplicationDetails[]>>>{
    return this.http.get<StandardResponse<JobApplicationDetails[]>>(`${API_ENDPOINTS.USER_APPLIED_JOBS}?userId=${userId}`,

      { observe: 'response' }
    )
  }

  fetchJobApplicationByJobApplicationId(jobApplicationId:string):Observable<HttpResponse<StandardResponse<JobApplicationWithJobData>>>{
    console.log('gdfgnhfmgjg',jobApplicationId,);
    
    return this.http.get<StandardResponse<JobApplicationWithJobData>>(`${API_ENDPOINTS.GET_APPLICATION_BY_JOB_APPLICATION__ID}?jobApplicationId=${jobApplicationId}`,
      { observe: 'response' } // This ensures you get the full HttpResponse
    );
  }

  updateJobApplicationStatus(jobId:string,userId:string,status:jobApplicationStatus,comment?:string):Observable<HttpResponse<StandardResponse>>{
    return this.http.patch<StandardResponse>(`${API_ENDPOINTS.UPDATE_JOB_APPLICATION_STATUS}`,{
      jobId:jobId,
      userId:userId,
      statusReceived:status,
      comment:comment
    },
      { observe: 'response' }
    )
  }

  fetchBarChartData(): Observable<HttpResponse<StandardResponse<{ months: string[], jobCounts: number[] }>>> {
    return this.http.get<StandardResponse<{ months: string[], jobCounts: number[] }>>(
      `${this.apiUrl}/jobs/bar-chart-data`, 
      { observe: 'response' }
    );
  }
  
  fetchLineChartData(): Observable<HttpResponse<StandardResponse<{ months: string[], jobApplicationCounts: number[] }>>> {
    return this.http.get<StandardResponse<{ months: string[], jobApplicationCounts: number[] }>>(
      `${this.apiUrl}/jobs/line-chart-data`, 
      { observe: 'response' }
    );
  }

  fetchPieChartData(): Observable<HttpResponse<StandardResponse<{ pending: number; approved: number; rejected: number }>>> {
    return this.http.get<StandardResponse<{ pending: number; approved: number; rejected: number }>>(
      `${this.apiUrl}/job-applications/pie-chart-data`, 
      { observe: 'response' }
    );
  }

    fetchUserDetailsByJobId(jobId: string): Observable<HttpResponse<StandardResponse<JobApplicationsByJobId[]>>> {
      return this.http.get<StandardResponse<JobApplicationsByJobId[]>>(
        `${API_ENDPOINTS.GET_JOB_APPLICATIONS_BY_JOB_ID}?jobId=${jobId}`,
        { observe: 'response' }
    );
  }
  
  
}
