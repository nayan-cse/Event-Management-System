import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const accessToken = req.cookies.get('accessToken') ? .value;

    // If no token, redirect to login
    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Verify the token
        jwt.verify(accessToken, process.env.JWT_SECRET);
        return NextResponse.next();
    } catch (error) {
        // If token is invalid, redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Apply middleware only to the /dashboard route
export const config = {
    matcher: ['attendee/dashboard'],
};
