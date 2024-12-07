import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 인증이 필요하지 않은 경로들
const PUBLIC_PATHS = ['/sign/in', '/sign/up',  '/features', '/pricing', '/about']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 공개 경로는 체크하지 않음
  if (PUBLIC_PATHS.some(path => pathname === path)) {
    return NextResponse.next()
  }

  // 정적 파일 및 API 라우트는 체크하지 않음
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('/images') ||
    pathname.includes('.') // 파일 확장자가 있는 요청은 건너뜀
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!token) {
    const signInUrl = new URL('/sign/in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

// middleware가 적용될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}