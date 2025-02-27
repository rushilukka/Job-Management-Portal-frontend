
export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  isVerifiedEmail: boolean;
  is2FALogin:boolean;
  exp?: number; // Optional expiration timestamp
}


export interface SignUp{ 
    name: string; 
    email: string; 
    phoneNumber: string; 
    password: string 
}

export enum Role{
    admin="admin",
    candidate="candidate"
}