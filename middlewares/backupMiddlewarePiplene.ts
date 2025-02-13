import { NextRequest, NextResponse } from "next/server";

type MiddlewareFunction = (request: NextRequest) => NextResponse | Promise<NextResponse>;

export async function middlewarePipeline(
  request: NextRequest,
  middlewares: MiddlewareFunction[],
): Promise<NextResponse> {
  let finalResponse: NextResponse | null = null;

  for (const middleware of middlewares) {
    try {
      const response = await middleware(request);

      // If a middleware returns a response, store it as the final response
      if (response) {
        finalResponse = response;
      }
    } catch (error) {
      // Log the error but continue executing the next middleware
      console.error("Middleware error:", error);
    }
  }

  // If any middleware returned a response, return it
  if (finalResponse) {
    return finalResponse;
  }

  // If no middleware returned a response, continue to the next middleware or route handler
  return NextResponse.next();
}