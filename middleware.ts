import { isEmpty, some } from "lodash";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/_lib/session";

export default async function middleware(req: NextRequest) {
    const publicApis = ['/api/login', '/api/logout', '/api/signUp'];
    const protectedRoute = ['/dashboard', '/api'];

    const currentPath = req.nextUrl.pathname;
    
    const isProtectedRoute = some(protectedRoute, (route) => currentPath === route || currentPath.startsWith(`${route}/`));
    const isPublicRoute = publicApis.includes(currentPath);

    if (isProtectedRoute && !isPublicRoute) {
        console.log('secure route access');
        const cookie = (await cookies()).get('session')?.value;
        if (isEmpty(cookie)) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        const session: any = await decrypt(cookie as string);

        if (!session?.email || !session?.username || !session?.userId) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('email', session?.email);
        requestHeaders.set('username', session?.username);
        requestHeaders.set('userId', session?.userId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
