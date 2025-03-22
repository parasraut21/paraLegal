import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Get current pathname early
  const pathname = request.nextUrl.pathname;
  // Define paths that unauthenticated users are allowed to access.
  const authAllowedPaths = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/protected/reset-password",
  ];

  try {
    // Create a response object which we'll modify if needed.
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Initialize Supabase client with proper cookie handling.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // Retrieve user session.
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's an auth error, e.g. missing session.
    if (error) {
      console.error("Auth error:", error);
      // If we're on an allowed path (like the home page or sign-in), let the user continue.
      if (authAllowedPaths.includes(pathname)) {
        return response;
      }
      // Otherwise, if session is missing, redirect to the sign-in page.
      if (error.name === "AuthSessionMissingError") {
        const redirectUrl = new URL("/sign-in", request.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }
      // For any other error, just allow the request to continue.
      return response;
    }

    // If a user exists, and they are trying to access pages intended for unauthenticated users,
    // redirect them to a protected route (e.g., dashboard).
    if (user) {
      if (pathname === "/sign-in" || pathname === "/sign-up") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      // Otherwise, if authenticated, allow them to proceed.
      return response;
    } else {
      // If no user is found, check if the current path is allowed for unauthenticated users.
      if (!authAllowedPaths.includes(pathname)) {
        const redirectUrl = new URL("/sign-in", request.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }
  } catch (e) {
    console.error("Error in updateSession:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
