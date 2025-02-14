export const ROUTES = {
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup",
      VERIFY_EMAIL: "/auth/verify-email",
      FORGOT_PASSWORD: "/auth/forgot-password",
    },
    DASHBOARD: "/dashboard",
    JOBS: {
      LIST: "/jobs",
      DETAILS: (jobId: string) => `/jobs/${jobId}`, // Dynamic route
    },
    PROFILE: "/profile",
    SETTINGS: "/settings",
  };
  