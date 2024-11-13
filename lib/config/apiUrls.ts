const authApi = "/api/auth";
const protectedApi = "/api/authorize-user";

export const apiUrls = Object.freeze({
  AUTH: {
    LOGIN: `${authApi}/login/`,
    GENERATE_LOGIN_OTP: `${authApi}/generate-login-otp/`,
    LOGIN_OTP_VERIFICATION: `${authApi}/login-otp-verification/`,
    LOGIN_IN_VIA_PASSKEY: `${authApi}/login-via-passkey/`,
    REGISTER: `${authApi}/register/`,
    GENERATE_NEW_REGISTER_OTP: `${authApi}/generate-new-register-opt/`,
    REGISTER_OTP_VERIFICATION: `${authApi}/register-otp-verification/`,
    REFRESH_TOKEN: `${authApi}/refresh-token/`,
    LOGOUT: `${authApi}/logout/`,
  },

  PROTECTED: {
    USER_DETAILS: `${protectedApi}/user-dashboard-data/`,
    USER_PASSKEYS: `${protectedApi}/user-passkey/`,
    USER_GENERATE_PASSKEY: `${protectedApi}/generate-new-passkeys/`,
  },
  PUBLIC: {},
});
