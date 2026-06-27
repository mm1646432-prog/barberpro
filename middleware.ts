import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware — runs on every matched request at the Edge.
 *
 * Phase 1 responsibility:
 * - Refresh the Supabase auth session cookie before it expires.
 *   Required by @supabase/ssr — without this, the session goes stale
 *   and Server Components lose access to the authenticated user.
 *
 * Phase 2 addition (auth guard — not active yet):
 * - Redirect unauthenticated requests to /admin/* → /auth/login
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  /*
   * IMPORTANT: Do not add any logic between createServerClient and
   * supabase.auth.getUser(). A subtle middleware bug here can make
   * sessions unreliable across Server Components and Server Actions.
   *
   * getUser() validates the JWT on every request and refreshes the
   * token when needed. It is the single source of truth for auth state.
   */
  await supabase.auth.getUser();

  /*
   * ── Phase 2 — Admin Route Protection ────────────────────────────────────
   * Uncomment this block when auth pages are built in Phase 2.
   *
   * const {
   *   data: { user },
   * } = await supabase.auth.getUser();
   *
   * const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
   *
   * if (isAdminRoute && !user) {
   *   const loginUrl = request.nextUrl.clone();
   *   loginUrl.pathname = "/auth/login";
   *   loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
   *   return NextResponse.redirect(loginUrl);
   * }
   */

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public asset folders
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|icons|fonts|models|videos).*)",
  ],
};