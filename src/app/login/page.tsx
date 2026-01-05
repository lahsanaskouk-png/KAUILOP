'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase';

interface FormErrors {
  phone?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');

  const validatePhone = (value: string): boolean => {
    const phoneRegex = /^[67]\d{8}$/;
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhone(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!phone) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 6 أو 7 ويتكون من 9 أرقام';
    }

    if (!password) {
      newErrors.password = 'كلمة السر مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(phone, password);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setGeneralError(result.error?.message || 'رقم الهاتف أو كلمة السر غير صحيحة');
      }
    } catch {
      setGeneralError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfb] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="w-10 h-6 bg-[#ef4444] rounded flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 flex flex-col">
        {/* Welcome Text */}
        <h1 className="text-2xl font-bold text-[#434343] mb-8 leading-relaxed">
          مرحبا بيك ثاني! فرحانين<br />
          نشوفوك مرة أخرى!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Phone Number */}
          <div>
            <div className="flex items-center bg-[#f5f5f5] rounded-full h-14 overflow-hidden">
              <div className="flex items-center justify-center px-4 text-[#434343] font-medium min-w-[60px]">
                +212
              </div>
              <div className="w-px h-6 bg-gray-300" />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={9}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="دخل رقم تلفونك"
                className="flex-1 bg-transparent px-4 h-full text-[#434343] placeholder-[#b0b0b0] text-right"
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p className="text-[#ef4444] text-xs mt-1.5 px-2">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center bg-[#f5f5f5] rounded-full h-14 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center justify-center px-4 min-w-[52px]"
                disabled={isLoading}
              >
                <img
                  src={showPassword ? "https://ext.same-assets.com/3933269289/2116125838.png" : "https://ext.same-assets.com/3933269289/3641661242.png"}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 opacity-60"
                />
              </button>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="دخل كلمة السر ديالك"
                className="flex-1 bg-transparent px-4 h-full text-[#434343] placeholder-[#b0b0b0] text-right"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-[#ef4444] text-xs mt-1.5 px-2">{errors.password}</p>
            )}
          </div>

          {/* General Error */}
          {generalError && (
            <div className="bg-red-50 border border-[#ef4444] rounded-lg p-3">
              <p className="text-[#ef4444] text-sm text-center">{generalError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ef4444] hover:bg-[#dc2626] active:bg-[#b91c1c] text-white font-bold py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                جاري التحميل...
              </span>
            ) : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-auto pt-12 text-center">
          <span className="text-[#434343]">ما عندكش حساب؟ </span>
          <Link href="/register" className="text-[#ef4444] font-medium hover:underline">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  );
}
