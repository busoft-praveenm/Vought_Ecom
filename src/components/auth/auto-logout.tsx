'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AutoLogout({ exp }: { exp: number | undefined }) {
  const router = useRouter();

  useEffect(() => {
    if (!exp) return;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = exp - now;

    if (timeUntilExpiry <= 0) {
      // Already expired
      handleAutoLogout();
      return;
    }

    // Set timeout to logout when token expires
    const timeout = setTimeout(() => {
      handleAutoLogout();
    }, timeUntilExpiry * 1000);

    return () => clearTimeout(timeout);
  }, [exp, router]);

  const handleAutoLogout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Auto logout fetch failed', error);
    } finally {
      // Always redirect to login
      router.push('/login');
    }
  };

  return null;
}
