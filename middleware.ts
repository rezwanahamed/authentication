import { NextRequest } from "next/server";

import { MiddlewareChain } from "./lib/utils/middlewareChain";
import { authSessionMiddlewareConfig } from "./middlewares/authSessionMiddleware";
import { registerMiddlewareConfig } from "./middlewares/registerMiddleware";

const middlewareChain = new MiddlewareChain();
middlewareChain.add(authSessionMiddlewareConfig).add(registerMiddlewareConfig)

export async function middleware(request: NextRequest) {
  return middlewareChain.execute(request);
}

// Configure which paths this middleware will run on (combined from both configs)
export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
