"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/utils/apiService";
import { recordAdminLogin } from "@/utils/adminStorage";

export default function LoginPage() {
  const router = useRouter();

  // Form states: Username, Password & CAPTCHA
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // CAPTCHA generation states - Initialize with non-empty 5-char code so it is visible immediately on SSR
  const [captchaCode, setCaptchaCode] = useState("8H3MY");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate a random 5-character alphanumeric CAPTCHA
  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excludes easily confused chars like 0, O, 1, I
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    generateCaptcha();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "1" || params.get("timeout") === "1") {
        setErrorMsg("Your session expired after 10 minutes of inactivity. Please log in again.");
      }
    }
  }, [generateCaptcha]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // 1. Verify CAPTCHA (case-insensitive)
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMsg("Incorrect CAPTCHA code. Please enter the characters shown below.");
      generateCaptcha();
      return;
    }

    // 2. Verify Credentials
    setIsLoading(true);
    apiLogin(username, password)
      .then((res) => {
        setIsLoading(false);
        if (res.success) {
          if (typeof window !== "undefined") {
            recordAdminLogin(username.trim());
          }
          setSuccessMsg("Login successful! Redirecting to Administrator Dashboard...");
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 600);
        } else {
          setErrorMsg(res.message || "Invalid username or password. Please verify your credentials and try again.");
          generateCaptcha();
        }
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMsg("Authentication error. Please try again.");
        generateCaptcha();
      });
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#EAF6FF] via-white to-[#EAF6FF]/60 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full space-y-4 sm:space-y-6">
        
        {/* ─── School Emblem & Title ────────────────────────────────────── */}
        <div className="text-center">
          <Link href="/" className="inline-block group focus:outline-none">
            <div className="relative w-16 h-18 sm:w-24 sm:h-26 mx-auto transition-transform group-hover:scale-105">
              <Image
                src="/images/logo/allsaints-clean-crest.png"
                alt="All Saints School Emblem"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>
          <h1 className="mt-2 sm:mt-4 font-serif font-black text-xl sm:text-3xl text-[#092F78] tracking-tight uppercase">
            All Saints Public School
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-500 font-sans font-medium mt-0.5 sm:mt-1">
            Official Administrator CMS Portal
          </p>
        </div>

        {/* ─── Simple Login Card (Username, Password & CAPTCHA Only) ──────── */}
        <div className="bg-white border border-[#D8EAF8] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg">
          
          {/* Header Banner */}
          <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-black text-sm sm:text-lg text-[#092F78]">
                Administrator Sign In
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Authorized administrative CMS access
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF6FF] text-[#0875C9] px-2.5 py-1 rounded-full whitespace-nowrap">
              Admin Only
            </span>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
              <span className="text-base leading-none">✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4" autoComplete="off">
            
            {/* 1. Username Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#092F78] mb-1.5">
                Username or Email Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-sans text-slate-800 focus:outline-none focus:border-[#0875C9] focus:ring-1 focus:ring-[#0875C9] bg-white"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <svg className="w-4 h-4 text-slate-400 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            {/* 2. Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#092F78]">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#0875C9] hover:underline font-semibold cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-sans text-slate-800 focus:outline-none focus:border-[#0875C9] focus:ring-1 focus:ring-[#0875C9] bg-white"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* 3. CAPTCHA Security Verification */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#092F78]">
                  Security Verification (CAPTCHA) *
                </label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-[11px] font-semibold text-[#0875C9] hover:text-[#092F78] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg bg-slate-50 hover:bg-[#EAF6FF] border border-slate-200 transition-colors min-h-[32px]"
                  title="Generate new CAPTCHA code"
                >
                  <span className="text-xs">🔄</span>
                  <span>Reload Code</span>
                </button>
              </div>

              {/* Visual CAPTCHA Display Box */}
              <div className="mb-2 relative">
                <div
                  className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-[#FFB900] px-4 py-2.5 rounded-xl border border-slate-700 shadow-inner select-none relative overflow-hidden flex items-center justify-center min-h-[48px]"
                  aria-label={`CAPTCHA code: ${captchaCode}`}
                >
                  {/* Subtle background security mesh */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, #FFB900 0, #FFB900 1px, transparent 0, transparent 8px), repeating-linear-gradient(-45deg, #0875C9 0, #0875C9 1px, transparent 0, transparent 8px)",
                    }}
                    aria-hidden="true"
                  />
                  {/* Security strike line */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-25 text-[#FFB900]"
                    viewBox="0 0 200 40"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M0,22 Q50,6 100,20 T200,22" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span
                    className="relative z-10 font-mono font-black text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.35em] transform -skew-x-3 text-[#FFB900]"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(255,185,0,0.25)",
                    }}
                  >
                    {captchaCode}
                  </span>
                </div>
              </div>

              {/* CAPTCHA Input Field */}
              <input
                type="text"
                required
                maxLength={6}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Enter the 5 characters above"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-800 placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:border-[#0875C9] focus:ring-1 focus:ring-[#0875C9] bg-white min-h-[44px]"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            {/* 4. Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0875C9] hover:bg-[#0066B5] disabled:bg-slate-400 text-white py-3 rounded-full font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>🔐 Administrator Sign In</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Return Link */}
          <div className="mt-4 sm:mt-6 text-center border-t border-slate-100 pt-3 sm:pt-4">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#0875C9] transition-colors flex items-center justify-center gap-1 min-h-[36px]"
            >
              <span>&larr;</span>
              <span>Back to School Public Website</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
