export const MESSAGES = {
    AUTH: {
      LOGIN_SUCCESS: "Login successful!",
      LOGIN_FAILED: "Invalid credentials. Please try again.",
      SIGNUP_SUCCESS: "Signup completed successfully. Please verify your email.",
      SIGNUP_FAILED: "Signup failed. Please check your details.",
      ACCOUNT_LOCKED: "Your account is locked due to multiple failed login attempts.",
      EMAIL_VERIFICATION_SENT: "Verification email sent successfully.",
      EMAIL_VERIFIED: "Your email has been verified successfully.",
      EMAIL_VERIFICATION_FAILED: "Invalid or expired verification link.",
      LOGOUT_SUCCESS: "You have been logged out.",
    },
    ERRORS: {
      NETWORK: "Network error. Please try again later.",
      UNAUTHORIZED: "You are not authorized to access this resource.",
      SERVER_ERROR: "Something went wrong on the server. Please try again later.",
    },
    VALIDATION: {
      REQUIRED: "This field is required.",
      INVALID_EMAIL: "Please enter a valid email address.",
      PASSWORD_MISMATCH: "Passwords do not match.",
      WEAK_PASSWORD: "Password must contain at least 8 characters, including an uppercase letter, a number, and a special character.",
    },
    TWO_FA: {
      ENABLE_SUCCESS: "Two-factor authentication enabled successfully.",
      ENABLE_FAILED: "Failed to enable two-factor authentication.",
      DISABLE_SUCCESS: "Two-factor authentication disabled successfully.",
      DISABLE_FAILED: "Failed to disable two-factor authentication.",
      VERIFICATION_SUCCESS: "2FA verification successful.",
      VERIFICATION_FAILED: "Invalid 2FA code. Please try again.",
      QR_CODE_FETCH_FAILED: "Failed to fetch QR code for 2FA setup.", //   Added new entry

    },

    
    
  };
  
  