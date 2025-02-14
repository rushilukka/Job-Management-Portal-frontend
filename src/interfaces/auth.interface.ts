import { StandardResponse } from './standard-response.interface';

// Enable 2FA Response
export interface Enable2FAResponse extends StandardResponse<{ qrCode: string }> {}

// Login Response
export interface LoginResponse extends StandardResponse<{ LoginTokenJWT: string }> {}

// Signup Response
export interface SignupResponse extends StandardResponse<null> {}

// Email Verification Response
export interface EmailVerificationResponse extends StandardResponse<null> {}

// 2FA Verification Response
export interface Verify2FAResponse extends StandardResponse<{ success: boolean }> {}
