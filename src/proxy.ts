import { NextRequest, NextResponse } from "next/server";

export default function proxy(request:NextRequest){
    console.log('proxy');
    console.log('request url', request.url)
    console.log('request pathname', request.nextUrl.pathname)
    const isLogined = false
    if(!isLogined){
        return NextResponse.redirect(new URL("/auth/login",request.url))
    }
    return NextResponse.next();
    // ber login hx tv dashboard ban tmd
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*']
}