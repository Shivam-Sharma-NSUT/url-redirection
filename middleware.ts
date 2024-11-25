import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/_lib/session";
import { v7 } from 'uuid';
import { log } from "./app/actions";

export default async function middleware(req: NextRequest) {
    const publicApis = ['/api/login', '/api/logout', '/api/signUp'];
    const protectedRoute = ['/dashboard', '/api'];

    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoute.some((route) => currentPath === route || currentPath.startsWith(`${route}/`));
    const isPublicRoute = publicApis.includes(currentPath);
    const my_transaction_id = v7();
    const requestHeaders = new Headers(req.headers)
    if (isProtectedRoute && !isPublicRoute) {
        log({ my_transaction_id, message: 'protected route' });
        const cookie = (await cookies()).get('session')?.value;
        if (!cookie) {
            log({ my_transaction_id, cookie });
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        const session: any = await decrypt(cookie as string);
        
        if (!session?.email || !session?.username || !session?.userId) {
            log({ my_transaction_id, session });
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }

        requestHeaders.set('email', session.email);
        requestHeaders.set('username', session.username);
        requestHeaders.set('userId', session.userId);
    }
    
    requestHeaders.set('my_transaction_id', my_transaction_id);
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
