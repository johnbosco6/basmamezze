import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/admin/login']
const BLOCKED_ROUTES = ['/', '/menu', '/offers', '/newsletter', '/studio']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = request.cookies.get('admin_session')
    const isAuthenticated = session?.value === 'authenticated'

    // Block access to public website routes
    if (BLOCKED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Allow public routes (login page)
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next()
    }

    // Protect all /admin routes
    if (pathname.startsWith('/admin')) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}
