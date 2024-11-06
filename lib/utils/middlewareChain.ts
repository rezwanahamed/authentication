
import { MiddlewareConfig } from "@/types/middleware";
import { NextRequest, NextResponse } from "next/server";

export class MiddlewareChain {
  private middlewares: (MiddlewareConfig & { handler: (request: NextRequest) => Promise<NextResponse> | NextResponse })[] = [];

  add(config: MiddlewareConfig & { handler: (request: NextRequest) => Promise<NextResponse> | NextResponse }): MiddlewareChain {
    this.middlewares.push(config);
    return this;
  }

  async execute(request: NextRequest): Promise<NextResponse> {
    for (const { matcher, handler } of this.middlewares) {
      if (this.matchPath(request.nextUrl.pathname, matcher)) {
        try {
          return await handler(request);
        } catch (error) {
          console.error('Middleware execution failed:', error);
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });  // Use NextResponse.json to create a NextResponse instance
        }
      }
    }
    return NextResponse.next();
  }

  private matchPath(pathname: string, matcher: string | string[]): boolean {
    return Array.isArray(matcher) ? matcher.some(path => pathname.startsWith(path)) : pathname.startsWith(matcher);
  }
}