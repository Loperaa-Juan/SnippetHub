import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const protectedPaths = ["/profile", "/Admin", "/dashboard", "/publications", "/snippets", "/chatbot"]
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/Admin/:path*", "/dashboard/:path*", "/publications/:path*", "/snippets/:path*","/chatbot/:path*"],
}
