'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setIsChecking(false);
      }
    };
    checkSession();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#fafbfb] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ef4444] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfb] flex flex-col items-center justify-center p-6">
      {/* Logo/Title */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-[#ef4444] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#434343] mb-2">Brixa</h1>
        <p className="text-[#848484]">مرحبا بك في منصتنا</p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm space-y-4">
        <Link
          href="/register"
          className="block w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-4 rounded-full transition-colors text-center"
        >
          إنشاء حساب جديد
        </Link>
        <Link
          href="/login"
          className="block w-full bg-white border-2 border-[#ef4444] text-[#ef4444] font-bold py-4 rounded-full transition-colors text-center hover:bg-red-50"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
