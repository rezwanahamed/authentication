import { appUrls } from "@/lib/config/appUrls";
import { ICustomSession } from "@/types/interface";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type PageOrder = {
  [key: string]: number;
};

// Only pages that need sequence checking
const pageOrder: PageOrder = {
  login: 1,
  "login-verification": 2,
};

// All restricted paths including those not in sequence
const restrictedPaths = [
  appUrls.AUTH.SIGN_IN,
  appUrls.AUTH.SIGN_IN_VERIFICATION,
  appUrls.AUTH.passkey_verification,
  appUrls.AUTH.OTP,
];

export async function loginMiddleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const currentPage = path.split("/")[1];
    const isRestrictedPath = restrictedPaths.includes(path);

    // First check session to prevent authenticated users from accessing login flows
    const session = (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })) as ICustomSession | null;

    if (isRestrictedPath && session?.accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If accessing the login page directly, allow access
    if (currentPage === "login") {
      return NextResponse.next();
    }

    // Get the referer (previous page URL)
    const referer = request.headers.get("referer");

    // If no referer and trying to access a restricted path, redirect to login
    if (!referer && isRestrictedPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Only check sequence for pages in pageOrder
    if (pageOrder[currentPage]) {
      const previousPage = referer
        ? new URL(referer).pathname.split("/")[1]
        : null;
      const currentPageOrder = pageOrder[currentPage];
      const previousPageOrder = previousPage ? pageOrder[previousPage] : 0;

      // Check if trying to access a page without visiting the previous page in sequence
      if (
        currentPageOrder > 1 &&
        (!previousPage || currentPageOrder > previousPageOrder + 1)
      ) {
        // Find the correct previous page in the sequence
        const correctPreviousPage = Object.entries(pageOrder).find(
          ([_, order]) => order === currentPageOrder - 1,
        )?.[0];

        if (correctPreviousPage) {
          return NextResponse.redirect(
            new URL(`/${correctPreviousPage}`, request.url),
          );
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Login middleware error:", error);
    // In case of any error, redirect to login page as a fallback
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const loginMiddlewareConfig = {
  matcher: restrictedPaths,
  handler: loginMiddleware,
};
