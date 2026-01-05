'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signOut } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ef4444] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#848484]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfb] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#434343]">لوحة التحكم</h1>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-4 py-2 bg-[#ef4444] text-white rounded-full text-sm font-medium hover:bg-[#dc2626] transition-colors disabled:opacity-50"
        >
          {isSigningOut ? 'جاري...' : 'تسجيل الخروج'}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#434343] mb-2">
            Dashboard coming soon
          </h2>
          <p className="text-[#848484]">
            لوحة التحكم قيد التطوير
          </p>
        </div>
      </main>
    </div>
  );
}
