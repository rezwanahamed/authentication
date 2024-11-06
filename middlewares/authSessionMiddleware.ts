import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

interface CustomSession {
  user?: {
    id?: string | null;
    email?: string | null;
  };
  accessToken: string;
  refreshToken: string | null;
}

export async function authSessionMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const privatePaths = ["/details", "/dashboard"];
  const isPrivatePath = privatePaths.includes(path);

  try {
    // Get the token from the request using next-auth
    const session = (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })) as CustomSession | null;

    // If the path is protected and user is not logged in, redirect to login
    if (isPrivatePath && !session?.accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
