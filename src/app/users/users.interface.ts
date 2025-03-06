export interface Job{
    id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[]
}

export interface JobApplicationWithJobData{
  //this is job id, not application id,
    id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[],status:string,commentByAdmin?:string,updatedBy?:string
}
export interface JobApplicationWithJobAndUserData{
  //this is job id, not application id,
    userId: string, userName: string, phoneNumber: string, email: string,
    jobId: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[],status:string,commentByAdmin?:string,updatedBy?:string
}

interface JobApplication{
  id: string;
  jobId: string;
  userId: string;
  status: string;
  commentByAdmin?:string;
  updatedBy?:string
  
}

export interface JobApplicationWithUserDetails  {
  jobApplication: JobApplication|null;
  name: string;
  email: string;
  phoneNumber: string;
}