import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  
  const token = request.cookies.get("token")?.value

  const { pathname } = request.nextUrl


  if (pathname.startsWith("/profile") && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
    matcher: ["/profile/:path*"], 
}
  