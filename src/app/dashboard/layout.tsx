'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout';
import { AuthState, authStore, useAuthStore } from '@/lib/auth-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuthStore() as AuthState;

  useEffect(() => {
    const requireAuth = process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true';
    if (!auth.isLoading && !auth.isAuthenticated && requireAuth) {
      router.replace(`/login?next=${encodeURIComponent(pathname || '/dashboard')}`);
    }
  }, [auth.isLoading, auth.isAuthenticated, pathname, router]);

  useEffect(() => {
    const onExpired = () => {
      authStore.setUser(null);
      if (process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true') {
        router.replace(`/login?next=${encodeURIComponent(pathname || '/dashboard')}`);
      }
    };
    window.addEventListener('arcadia_session_expired', onExpired);
    return () => window.removeEventListener('arcadia_session_expired', onExpired);
  }, [pathname, router]);

  return <AppShell>{children}</AppShell>;
}
