import { environment } from "../../../environments/environments";

const apiUrl = environment.backendUrl;

export const API_ENDPOINTS = {
 
    AUTH: {
      LOGIN: `${apiUrl}/auth/login`,
      SIGNUP: `${apiUrl}/auth/signup`,
      VERIFY_EMAIL: `${apiUrl}/auth/signup_verifyEmail`,
      RESEND_VERIFICATION: `${apiUrl}/auth/resend-verification`,
      LOGIN_2FA: `${apiUrl}/auth/login-2fa`,
      ENABLE_2FA: `${apiUrl}/auth/enable-2fa`,
      VERIFY_2FA: `${apiUrl}/auth/verify-2fa`,
      GET_2FA_POPUP_STATUS: `${apiUrl}/auth/get2FAPopupStatus`,
      DISABLE_2FA: `${apiUrl}/auth/disable2FAPopup`,
    },
  };
  