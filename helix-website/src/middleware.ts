import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ellmoMiddleware } from 'ellmo-ai-react';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply Ellmo middleware to set pathname header
  return ellmoMiddleware(request, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .xml files (sitemaps)
     * - robots.txt (SEO critical file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.xml|robots\\.txt).*)',
  ],
};

