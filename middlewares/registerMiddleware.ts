import { appUrls } from "@/lib/config/appUrls";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type PageOrder = {
  [key: string]: number;
};

const pageOrder: PageOrder = {
  register: 1,
  "user-additional-details": 2,
  password: 3,
  otp: 4,
};

export function registerMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const currentPage = path.split("/")[1];

  // If accessing the register page, allow access
  if (currentPage === "register") {
    return NextResponse.next();
  }

  // Get the referer (previous page URL)
  const referer = request.headers.get("referer");

  if (!referer) {
    // If no referer, redirect to register
    const redirectUrl = new URL("/register", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Extract the previous page from referer
  const previousPage = new URL(referer).pathname.split("/")[1];

  // Get the order numbers for current and previous pages
  const currentPageOrder = pageOrder[currentPage];
  const previousPageOrder = pageOrder[previousPage];

  // Check if trying to access a page without visiting the previous page in sequence
  if (currentPageOrder > 1) {
    // Skip check for register page
    if (!previousPage || currentPageOrder > previousPageOrder + 1) {
      // If trying to skip pages, redirect to the appropriate previous page
      const correctPreviousPage = Object.entries(pageOrder).find(
        ([_, order]) => order === currentPageOrder - 1,
      )?.[0];

      const redirectUrl = new URL(`/${correctPreviousPage}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const registerMiddlewareConfig = {
  matcher: [
    appUrls.AUTH.SIGN_UP,
    appUrls.AUTH.USER_ADDITIONAL_DETAILS,
    appUrls.AUTH.PASSWORD,
  ],
  handler: registerMiddleware,
};
