import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isAuthRoute = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && !isAuthRoute;
  const isStaffRoute = request.nextUrl.pathname.startsWith('/staff');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (isAdminRoute || isStaffRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute || isStaffRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check role in admin_users table
    const { data: adminUser, error: dbError } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!adminUser || !adminUser.is_active) {
      // User is not an active staff/admin
      const errorMsg = dbError ? dbError.message : 'no_active_row';
      return NextResponse.redirect(new URL(`/admin/login?error=unauthorized&details=${encodeURIComponent(errorMsg)}`, request.url));
    }

    if (isAdminRoute && adminUser.role !== 'admin') {
      // Staff trying to access admin
      return NextResponse.redirect(new URL('/staff', request.url));
    }
    
    if (isStaffRoute && adminUser.role !== 'staff' && adminUser.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
    }
  }

  // Redirect logged in users away from login page to their respective dashboards
  if (isAuthRoute && user) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminUser?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (adminUser?.role === 'staff') {
      return NextResponse.redirect(new URL('/staff', request.url));
    }
  }

  return supabaseResponse;
}
