import { getSessionCookie } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
