import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge: 60 * 60 * 24 * 7,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // === ADMIN ROUTES PROTECTION ===
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // /admin/profile is accessible to all authenticated users
    if (pathname === '/admin/profile' || pathname.startsWith('/admin/profile/')) {
      return supabaseResponse;
    }

    // /admin/docs and /admin/github: check role
    if (pathname.startsWith('/admin/docs') || pathname.startsWith('/admin/github')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin' || profile?.role === 'editor') {
        return supabaseResponse;
      }

      if (user.email?.endsWith('@hasfy.fr')) {
        return supabaseResponse;
      }

      return NextResponse.redirect(new URL('/admin/profile', request.url));
    }

    // /admin/users: super admin only
    if (pathname.startsWith('/admin/users')) {
      if (!user.email?.endsWith('@hasfy.fr')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    // /admin root: accessible if authenticated
    if (pathname === '/admin' || pathname === '/admin/') {
      return supabaseResponse;
    }
  }

  // === PRIVATE DOCS PROTECTION ===
  if (pathname.startsWith('/docs/private')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
