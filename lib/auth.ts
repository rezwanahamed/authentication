import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrls } from "./config/apiUrls";
import { envConfig } from "./config/env";

async function refreshAccessToken(token: JWT) {
  console.warn("refresh token function called");
  try {
    const response = await fetch(
      envConfig.BACKEND_SERVER_URL + apiUrls.AUTH.REFRESH_TOKEN,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      },
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000, // 14 minutes
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        userId: { label: "User ID", type: "text" },
        email: { label: "Email", type: "text" },
        userRole: { label: "User Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.accessToken && credentials?.refreshToken) {
            return {
              id: credentials.userId,
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              userId: credentials.userId,
              email: credentials.email,
              userRole: credentials.userRole,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store initial user data and tokens
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000; //14 minutes
        token.userId = user.userId;
        token.email = user.email;
        token.userRole = user.userRole;
      }

      // Return existing token if access token has not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token expired, refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = {
        userId: token.userId as string,
        email: token.email as string,
        userRole: token.userRole as string,
      };
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
