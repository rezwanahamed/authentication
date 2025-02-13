import { NextMiddleware, NextResponse } from "next/server";

export type middlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

/**
 * Creates a middleware chain by combining multiple middleware functions.
 * Executes middlewares in sequence, where each middleware can call the next one.
 * 
 * @param functions - Array of middleware factory functions to be chained
 * @param index - Current position in the middleware chain (default: 0)
 * @returns A middleware function that executes the chain
 * 
 * @example
 * ```ts
 * const middlewares = [authMiddleware, loggerMiddleware, corsMiddleware];
 * const chainedMiddleware = chain(middlewares);
 * ```
 */
export const chain = (
  functions: middlewareFactory[],
  index = 0,
): NextMiddleware => {
  const current = functions[index];

  if (current) {
    const next: NextMiddleware = chain(functions, index + 1);
    return current(next);
  }

  return () => NextResponse.next();
};
