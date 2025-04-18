import { NextRequest, NextResponse } from "next/server";
import { authSessionMiddleware } from "./middlewares/authSessionMiddleware";
import { loginMiddleware } from "./middlewares/loginMiddleware";

import { middlewarePipeline } from "./middlewares/middlewarePipeline";
import { registerMiddleware } from "./middlewares/registerMiddleware";

const middlewares = [
  authSessionMiddleware,
  registerMiddleware,
  loginMiddleware,
];

export function middleware(request: NextRequest) {
  // Explicitly skip middleware processing for the root path
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  return middlewarePipeline(request, middlewares);
}

// Configure which paths this middleware will run on (combined from both configs)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
