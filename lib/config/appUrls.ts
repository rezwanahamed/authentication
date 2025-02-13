export const appUrls = Object.freeze({
  AUTH: {
    //   registration part
    SIGN_UP: "/register",
    USER_ADDITIONAL_DETAILS: "/user-additional-details",
    PASSWORD: "/password",
    REGISTER_OTP_VERIFICATION: "/registration-verification-otp",

    //login part
    SIGN_IN: "/login",
    SIGN_IN_VERIFICATION: "/login-verification",
    OTP: "/otp",
    PASSKEY_VALIDATION: "/pass-key-verification",
  },

  PROTECTED: {
    //   dashboard part
    DASHBOARD: "/dashboard",
    DETAILS: "/details",
    PASSKEY: "/passkey",
  },
});
