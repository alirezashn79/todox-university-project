import { NextRequest, NextResponse } from "next/server";
import { isExpired } from "react-jwt";
import client from "./utils/client";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token || isExpired(token.value)) {
    console.log("-----------------token expired-------------------");
    const refreshToken = request.cookies.get("refreshToken");
    if (refreshToken) {
      try {
        const res = await client.post(
          "/api/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken.value}`,
            },
          }
        );
        const responseWithCookies = NextResponse.next();
        responseWithCookies.cookies.set("token", res.data, {
          httpOnly: true,
          path: "/",
          sameSite: "strict",
          maxAge: 3600,
          secure: process.env.NODE_ENV === "production",
        });
        return responseWithCookies;
      } catch (error) {
        return NextResponse.redirect(
          new URL("/auth/login-register", request.url)
        );
      }
    } else {
      return NextResponse.redirect(
        new URL("/auth/login-register", request.url)
      );
    }
  }
}

export const config = {
  matcher: "/",
};
