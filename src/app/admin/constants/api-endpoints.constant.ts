import { environment } from "../../../environments/environments";

const apiUrl = environment.backendUrl;

export const API_ENDPOINTS = {
  USERS:`${apiUrl}/admin/users`,
  USER_RESUME: `${apiUrl}/admin/user-resume`,
  USER_SKILLS: `${apiUrl}/admin/user-skills`,
  USER_APPLIED_JOBS: `${apiUrl}/admin/user-applied`,
  APPLY_JOB: `${apiUrl}/job-applications/apply`,
  UPLOAD_RESUME: `${apiUrl}/resume/upload`,
  USER_DETAILS:'',
//   USER_SKILLS:'',
//   USER_APPLIED_JOBS:'',
//   JOBS: "http://localhost:3000/jobs" // Adjust backend API URL
};