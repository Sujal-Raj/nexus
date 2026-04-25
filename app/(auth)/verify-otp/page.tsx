// /app/(auth)/verify-otp/page.tsx
"use client";

import { useVerifyOTP } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OTP() {
  const router = useRouter();
  const { mutate, isPending, isError, isSuccess } = useVerifyOTP();

  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    mutate(
      { otp },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
          <p className="text-gray-400">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white text-center text-2xl tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="------"
              maxLength={6}
            />
          </div>

          {isError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              Invalid OTP. Please try again.
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center">
              OTP verified successfully! Redirecting...
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isPending || otp.length !== 6}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Didn't receive the code?{" "}
            <button className="text-purple-400 hover:text-purple-300 font-medium">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}