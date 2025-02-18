import { environment } from "../../../environments/environments";

const apiUrl = environment.backendUrl;

export const API_ENDPOINTS = {
  USER_RESUME: `${apiUrl}/resume/user`,
  USER_SKILLS: `${apiUrl}/skills`,
  USER_APPLIED_JOBS: `${apiUrl}/job-applications/user`,
  APPLY_JOB: `${apiUrl}/job-applications/apply`,
  UPLOAD_RESUME: `${apiUrl}/resume/upload`
};