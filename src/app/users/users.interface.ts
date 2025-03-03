export interface Job{
    id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[]
}

export interface JobApplication{
  //this is job id, not application id,
    id: string, jobTitle: string, location: string, jobDescription: string, salaryRange: string,skills:string[],status:string,commentByAdmin?:string,updatedBy?:string
}
