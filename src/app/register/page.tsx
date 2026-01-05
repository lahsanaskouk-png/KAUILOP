'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase';

interface FormErrors {
  phone?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

function generateOTP(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');

  const regenerateOTP = useCallback(() => {
    setGeneratedOTP(generateOTP());
  }, []);

  useEffect(() => {
    regenerateOTP();
  }, [regenerateOTP]);

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
    } else if (password.length < 8) {
      newErrors.password = 'كلمة السر يجب أن تكون 8 أحرف على الأقل';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة السر مطلوب';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'كلمات السر غير متطابقة';
    }

    if (!otpInput) {
      newErrors.otp = 'كود التأكيد مطلوب';
    } else if (otpInput !== generatedOTP) {
      newErrors.otp = 'كود التأكيد غير صحيح';
      regenerateOTP();
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
      const result = await signUp(phone, password);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setGeneralError(result.error?.message || 'حدث خطأ أثناء إنشاء الحساب');
        regenerateOTP();
      }
    } catch {
      setGeneralError('حدث خطأ غير متوقع');
      regenerateOTP();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfb] flex flex-col max-w-md mx-auto">
      {/* Back Button */}
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#434343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8">
        {/* Welcome Text */}
        <h1 className="text-2xl font-bold text-[#434343] mb-8">
          مرحبا! سجّل باش تبدا
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

          {/* Confirm Password */}
          <div>
            <div className="flex items-center bg-[#f5f5f5] rounded-full h-14 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="flex items-center justify-center px-4 min-w-[52px]"
                disabled={isLoading}
              >
                <img
                  src={showConfirmPassword ? "https://ext.same-assets.com/3933269289/2116125838.png" : "https://ext.same-assets.com/3933269289/3641661242.png"}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 opacity-60"
                />
              </button>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أكد كلمة السر ديالك"
                className="flex-1 bg-transparent px-4 h-full text-[#434343] placeholder-[#b0b0b0] text-right"
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[#ef4444] text-xs mt-1.5 px-2">{errors.confirmPassword}</p>
            )}
          </div>

          {/* OTP */}
          <div>
            <div className="flex items-center bg-[#f5f5f5] rounded-full h-14 overflow-hidden">
              <button
                type="button"
                onClick={regenerateOTP}
                className="flex items-center justify-center px-3 min-w-[80px]"
                disabled={isLoading}
                title="اضغط لتجديد الكود"
              >
                <div className="flex gap-0.5 select-none" style={{ direction: 'ltr' }}>
                  {generatedOTP.split('').map((digit, index) => (
                    <span key={index} className="otp-digit">{digit}</span>
                  ))}
                </div>
              </button>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="كود التأكيد"
                className="flex-1 bg-transparent px-4 h-full text-[#434343] placeholder-[#b0b0b0] text-right"
                disabled={isLoading}
              />
            </div>
            {errors.otp && (
              <p className="text-[#ef4444] text-xs mt-1.5 px-2">{errors.otp}</p>
            )}
          </div>

          {/* Referral Code */}
          <div>
            <div className="flex items-center bg-[#f5f5f5] rounded-full h-14 overflow-hidden">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="دخل كود الدعوة ديالك"
                className="w-full bg-transparent px-5 h-full text-[#434343] placeholder-[#b0b0b0] text-right"
                disabled={isLoading}
              />
            </div>
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
            ) : 'إنشاء حساب'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-16 text-center">
          <span className="text-[#434343]">عندك حساب من قبل؟ </span>
          <Link href="/login" className="text-[#ef4444] font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
