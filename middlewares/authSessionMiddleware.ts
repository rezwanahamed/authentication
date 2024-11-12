import { ICustomSession } from "@/types/interface";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";



export async function authSessionMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const privatePaths = ["/details", "/passkey", "/dashboard"];
  const restrictedPaths = [
    "/login",
    "/register",
    "/otp",
    "/registration-verification-otp",
    "/password",
    "/user-additional-details",
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
    "/details",
    "/dashboard",
    "/passkey",
    "/login",
    "/register",
    "/registration-verification-otp",
    "/otp",
    "/password",
    "/user-additional-details",
  ],
  handler: authSessionMiddleware,
};
