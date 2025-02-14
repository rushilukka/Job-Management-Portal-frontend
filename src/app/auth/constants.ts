import { environment } from "../../environments/environments";

export const AUTH_STORAGE_KEY = 'authToken';

const apiUrl = environment.backendUrl;

// export const API_ENDPOINTS = {
//     signup: '/auth/signup',
//     resendVerification: '/auth/resend-verification',
//     verifyEmail: `${apiUrl}/auth/signup_verifyEmail`, //   Added email verification endpoint
//   };
  // export const TOASTER_MESSAGES = {
  //   totpVerified: 'TOTP Verified',
  //   signupSuccess: 'Signup successful. Please check your email for verification!',
  //   signupError: 'Signup failed. Please try again later.',
  //   verificationEmailResent: 'Verification email resent successfully.',
  //   verificationResendFailed: 'Failed to resend verification email. Please try again later.',
  //   emailVerificationSuccess: 'Email verification successful. You can now log in.',
  //   emailVerificationFailed: '❌ Email verification failed.',
  //   invalidVerificationToken: 'Invalid or missing verification token.',
  //   ALREADY_EXISTS: 'User already exists.',
  //   BAD_REQUEST: 'Bad request. Please check your input.',
  //   UNAUTHORIZED: 'Unauthorized. Please check your credentials.',
  //   FORBIDDEN: 'Forbidden. You do not have permission.',
  //   NOT_FOUND: 'Not found. The requested resource was not found.',
  //   SERVER_ERROR: 'Server error. Please try again later.',
  //   SERVICE_UNAVAILABLE: 'Service unavailable. Please try again later.',
  //   UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
  //   ENTER_NAME: 'Enter Name!',
  //   ENTER_EMAIL: 'Enter Email!',
  //   ENTER_PHONE_NUMBER: 'Enter Phone Number!',
  //   ENTER_PASSWORD: 'Enter Password!',
  //   ENTER_CONFIRM_PASSWORD: 'Enter Confirm Password!',
  //   PASSWORD_LENGTH: 'Password must be at least 8 characters long!',
  //   PASSWORD_MISMATCH: 'Passwords do not match!',
  // };
  
  
  // export const AUTH_ROUTES = {
  //   login: '/auth/login',
  //   login2FA: '/auth/login-2fa',
  //   signupVerificationPending: '/auth/signup-verification-pending',
  //   signupVerified: '/auth/signup-verified', //   Added signup verified route
  // };
    
  
// export const DASHBOARD_ROUTES = {
//   admin: '/admin/dashboard',
//   user: '/users/dashboard',
// };

// export const ERROR_MESSAGES = {
//   totpVerificationError:'TOTP Verification Error',
//   noAuthToken:'No auth token found, redirecting to login...',
//   invalidCredentials: 'Invalid email or password. Please try again.',
//   unauthorizedAccess: 'You are not authorized to access this resource.',
//   emailNotVerified: 'Your email is not verified. Please verify to continue.',
//   unexpectedResponse: 'Unexpected response from the server.',
//   loginFailed: 'Login failed. Please try again later.',
//   invalidTOTP: 'Invalid TOTP: Must be a 6-digit code.',
//   invalidToken:'invalid Token'
// };
