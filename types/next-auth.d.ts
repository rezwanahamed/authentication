import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      email: string ;
      userRole?: string;
    };
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User {
    userId: string;
    email: string;
    userRole?: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user: {
      userId: string;
      email: string;
      userRole?: string;
    };
    error?: string;
  }
}
