import { appUrls } from "@/lib/config/appUrls";
import { ICustomSession } from "@/types/interface";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function authSessionMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const privatePaths = [
    appUrls.PROTECTED.DASHBOARD,
    appUrls.PROTECTED.DETAILS,
    appUrls.PROTECTED.PASSKEY,
  ];
  const restrictedPaths = [
    appUrls.AUTH.SIGN_UP,
    appUrls.AUTH.OTP,
    appUrls.AUTH.REGISTER_OTP_VERIFICATION,
    appUrls.AUTH.PASSWORD,
    appUrls.AUTH.USER_ADDITIONAL_DETAILS,
  ];
  const isPrivatePath = privatePaths.includes(path);
  const isRestrictedPath = restrictedPaths.includes(path);

  try {
    const session = (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })) as ICustomSession | null;

    // If the path is protected and user is not logged in, redirect to login
    if (isPrivatePath && !session?.accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isRestrictedPath && session?.accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const authSessionMiddlewareConfig = {
  matcher: [
    appUrls.PROTECTED.DASHBOARD,
    appUrls.PROTECTED.DETAILS,
    appUrls.PROTECTED.PASSKEY,
    appUrls.AUTH.SIGN_UP,
    appUrls.AUTH.OTP,
    appUrls.AUTH.REGISTER_OTP_VERIFICATION,
    appUrls.AUTH.PASSWORD,
    appUrls.AUTH.USER_ADDITIONAL_DETAILS,
  ],
  handler: authSessionMiddleware,
};
