import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

  if (isAdminPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
