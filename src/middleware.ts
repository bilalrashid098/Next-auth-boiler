import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { pagesOptions } from "@/app/api/auth/[...nextauth]/page-options";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secureCookie: process.env.NODE_ENV !== "development",
    secret: "Ie3/BTK4dv7AboOTcB19GfP6vhrwY2Z+/yJsWnRxbsc=",
  });
  const isAuthenticated = !!token;

  if (req.nextUrl.pathname.startsWith("/signin") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return await withAuth(req, {
    secret: "Ie3/BTK4dv7AboOTcB19GfP6vhrwY2Z+/yJsWnRxbsc=",
    pages: {
      ...pagesOptions,
    },
  });
}

// config to match all pages
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
