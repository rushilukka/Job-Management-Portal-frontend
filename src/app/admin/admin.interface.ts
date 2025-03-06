import {  JobApplicationWithJobData } from "../users/users.interface";

export interface JobDetails{  
  id:string,
  jobTitle: string; 
  location: string; 
  jobDescription: string; 
  salaryRange:string;
  skills : string[];
  createdAt ?:string;
}

export interface JobApplicationDetails{  
  id:string,
  jobTitle: string; 
  location: string; 
  jobDescription: string; 
  salaryRange:string;
  skills : string[];
  createdAt ?:string;
  status :string;
  commentByAdmin ?:string;
  updatedBy?:string
}

interface JobApplication{
  id: string;
  jobId: string;
  userId: string;
  status: string;
  commentByAdmin?:string;
  updatedBy?:string
  
}

export interface JobApplicationsByJobId{  
  jobApplication:JobApplication,
  name?:string,
  email?:string,
  phoneNumber?:string
}
 
export interface JobMange{  
  jobTitle: string; 
  location: string; 
  jobDescription: string; 
  actions:any
}
export interface UserMange{
  name: string;
  email: string;
  phoneNumber: string;   
}

interface Resume{
  fileName:string,
  storageDiractoryPath:string
}

export interface UserData{
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
    skills?:string[];
    resume?:Resume;
  }


  export interface  JwtPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
    is2FAEnabled: boolean;
    isVerifiedEmail: boolean;
    exp?: number; // Optional expiration timestamp
  }
  