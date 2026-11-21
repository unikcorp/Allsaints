"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SCHOOL_INFO } from "@/constants";
import SocialLinks from "@/components/common/SocialIcons";
import { isAdminAuthenticated, clearAdminSession } from "@/utils/adminStorage";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(58);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
  }, [pathname]);

  const handleAdminLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    window.location.href = "/login";
  };

  // Measure mobile header height accurately
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        if (rect.height > 0) {
          setHeaderHeight(Math.round(rect.height));
        }
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Auto-expand active category matching current path
  useEffect(() => {
    if (!pathname || pathname === "/") return;
    const activeSection = NAV_ITEMS.find(
      (item) => item.children && item.children.some((c) => c.href !== "/" && pathname.startsWith(c.href))
    );
    if (activeSection) {
      setExpandedCategories((prev) => ({ ...prev, [activeSection.label]: true }));
    }
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          STICKY HEADER — desktop branding + nav + mobile bar
      ══════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-white border-b border-[#D8EAF8] shadow-sm"
      >
        {/* ── DESKTOP BRANDING ROW (lg and above only) ── */}
        <div className="hidden lg:block bg-white border-b border-slate-100 py-3 px-6">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative h-16 w-14 flex-shrink-0 transition-transform group-hover:scale-105">
                <Image src="/images/logo/allsaints-crest-v2.png" alt="All Saints Public School Crest"
                  fill className="object-contain" sizes="60px" priority unoptimized />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-[21px] text-[#092F78] leading-tight uppercase tracking-tight">
                  ALL SAINTS PUBLIC SCHOOL, ADOOR
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-sans font-bold text-slate-700 tracking-wide">(CBSE - 930501)</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
                  <span className="text-xs font-serif font-bold text-[#FFB900] uppercase tracking-wider">To Create Creators</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#D9EEFF] border border-[#BFE3FF] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0875C9] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none">Call Us</span>
                  <span className="text-xs font-sans font-bold text-[#092F78] mt-0.5">
                    {SCHOOL_INFO.phone[0]}, {SCHOOL_INFO.phone[1]}
                  </span>
                </div>
              </div>

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <Link href="/admin/dashboard" className="bg-[#092F78] hover:bg-[#0875C9] text-white px-4 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap">
                    🛡️ Dashboard
                  </Link>
                  <button type="button" onClick={handleAdminLogout} className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap cursor-pointer">
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all whitespace-nowrap flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── DESKTOP nav links (>= lg screens) ── */}
        <div className="hidden lg:block max-w-[1440px] mx-auto px-6">
          <nav className="flex items-center justify-between w-full font-sans py-1">
            <div className="flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 flex-nowrap w-full justify-between">
              {NAV_ITEMS.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive = pathname === item.href ||
                  (hasChildren && item.children?.some((c) => pathname.startsWith(c.href)));
                const isOpen = openDropdown === item.label;

                if (item.href === "/") {
                  return (
                    <Link key={item.label} href="/"
                      className={`px-4 py-2 rounded-xl text-[14px] xl:text-[14.5px] font-sans font-bold transition-all whitespace-nowrap flex-shrink-0 ${pathname === "/" ? "text-[#092F78] bg-[#D9EEFF]" : "text-slate-700 hover:text-[#0875C9] hover:bg-[#F4FAFF]"}`}>
                      Home
                    </Link>
                  );
                }
                if (hasChildren) {
                  return (
                    <div key={item.label} className="relative flex-shrink-0"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}>
                      <button className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[14px] xl:text-[14.5px] font-semibold transition-colors focus:outline-none whitespace-nowrap cursor-pointer ${isActive ? "text-[#092F78] font-bold bg-[#D9EEFF]" : "text-slate-700 hover:text-[#0875C9] hover:bg-[#F4FAFF]"}`} aria-expanded={isOpen}>
                        <span>{item.label}</span>
                        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#0875C9]" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className={`absolute top-full mt-0.5 min-w-[300px] w-max bg-white rounded-2xl shadow-xl border border-[#D8EAF8] border-t-2 border-t-[#0875C9] py-2 z-50 ${item.label === "Documents" ? "right-0" : "left-0"}`}>
                          <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFB900] font-serif border-b border-slate-100 mb-1">{item.label}</div>
                          {item.children?.map((child) => (
                            <Link key={child.href} href={child.href}
                              className={`block px-4 py-2 text-[14px] font-sans transition-colors whitespace-nowrap ${pathname === child.href ? "bg-[#EAF6FF] text-[#092F78] font-bold" : "text-slate-700 hover:bg-[#F4FAFF] hover:text-[#0875C9]"}`}>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={item.label} href={item.href}
                    className={`px-3 py-2 rounded-xl text-[14px] xl:text-[14.5px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${pathname === item.href ? "text-[#092F78] font-bold bg-[#D9EEFF]" : "text-slate-700 hover:text-[#0875C9] hover:bg-[#F4FAFF]"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* ── MOBILE top bar (< lg screens) ── */}
        <div className="flex lg:hidden items-center justify-between px-3 py-2 bg-white gap-2 relative z-50">
          {/* Logo + name */}
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative w-9 h-10 flex-shrink-0">
              <Image src="/images/logo/allsaints-crest-v2.png" alt="All Saints Public School"
                fill className="object-contain" priority unoptimized />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="font-serif font-black text-[11px] sm:text-xs text-[#092F78] uppercase leading-tight truncate">
                All Saints Public School
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold truncate">
                Adoor · CBSE 930501
              </span>
            </div>
          </Link>

          {/* Mobile Actions: Login + Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-1">
            {isAdmin ? (
              <Link
                href="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="bg-[#092F78] hover:bg-[#0875C9] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-xs whitespace-nowrap transition-colors"
              >
                Admin
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-xs whitespace-nowrap transition-colors"
              >
                Login
              </Link>
            )}

            {/* Hamburger toggle button */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="min-w-[44px] min-h-[44px] w-[44px] h-[44px] rounded-lg bg-[#092F78] hover:bg-[#0875C9] active:bg-[#0875C9] text-white flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors border-0 focus:outline-none select-none relative z-50"
              style={{ touchAction: "manipulation" }}
            >
              {menuOpen ? (
                // X close icon
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE NAVIGATION DROPDOWN MENU (< lg screens)
          Renders directly below header, never obscuring hamburger button
      ══════════════════════════════════════════ */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-[#D8EAF8] shadow-2xl flex flex-col z-40 overflow-hidden"
          style={{
            top: `${headerHeight}px`,
          }}
        >
          {/* Scrollable Navigation Content Container */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain divide-y divide-slate-100"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Quick Action Buttons */}
            <div className="flex gap-2.5 p-3.5 bg-[#F4FAFF] border-b border-[#D8EAF8] flex-shrink-0">
              <Link
                href="/admissions/apply"
                onClick={() => setMenuOpen(false)}
                className="flex-1 bg-[#FFB900] hover:bg-[#E0A300] active:bg-[#D49800] text-slate-950 py-2.5 px-3 rounded-xl text-center text-xs font-serif font-bold uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center min-h-[44px]"
              >
                Online Admission
              </Link>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleAdminLogout();
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 px-3 rounded-xl text-center text-xs font-serif font-bold uppercase tracking-wider shadow-xs cursor-pointer border-0 transition-colors flex items-center justify-center min-h-[44px]"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 bg-[#0875C9] hover:bg-[#0066B5] active:bg-[#005599] text-white py-2.5 px-3 rounded-xl text-center text-xs font-serif font-bold uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center min-h-[44px]"
                >
                  Login
                </Link>
              )}
            </div>

            {/* All 10 Navigation Categories and Links */}
            {NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = !!expandedCategories[item.label];
              const isActive =
                pathname === item.href ||
                (hasChildren && item.children?.some((c) => c.href !== "/" && pathname.startsWith(c.href)));

              if (hasChildren) {
                return (
                  <div key={item.label} className="bg-white">
                    {/* Category Header Row with Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-sans font-bold text-left transition-colors cursor-pointer border-0 min-h-[48px] ${
                        isActive
                          ? "text-[#0875C9] bg-[#EAF6FF]/70"
                          : "text-slate-800 hover:bg-[#F4FAFF] active:bg-[#EAF6FF]"
                      }`}
                      aria-expanded={isExpanded}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({item.children?.length})
                        </span>
                      </span>
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 pointer-events-none ${
                          isExpanded ? "rotate-180 text-[#0875C9]" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Sub-menu accordion */}
                    {isExpanded && (
                      <div className="bg-[#F8FBFF] border-t border-b border-[#D8EAF8] py-1">
                        {/* Overview Link */}
                        {item.href !== "#" && item.href !== "/" && (
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block py-3 px-6 text-[13px] font-sans font-bold transition-colors min-h-[44px] flex items-center ${
                              pathname === item.href
                                ? "text-[#092F78] bg-white"
                                : "text-[#0875C9] hover:text-[#0066B5]"
                            }`}
                          >
                            View {item.label} Overview →
                          </Link>
                        )}
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block py-3 px-6 text-[14px] font-sans transition-colors min-h-[44px] flex items-center ${
                              pathname === child.href
                                ? "text-[#092F78] font-bold bg-white"
                                : "text-slate-700 hover:text-[#0875C9] hover:bg-white/60 active:bg-white font-medium"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Direct Link
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3.5 text-[15px] font-sans font-bold transition-colors min-h-[48px] flex items-center ${
                    pathname === item.href
                      ? "text-[#092F78] bg-[#D9EEFF]"
                      : "text-slate-800 hover:text-[#0875C9] hover:bg-[#F4FAFF] active:bg-[#EAF6FF]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Drawer Bottom Footer */}
          <div className="p-4 border-t border-[#D8EAF8] bg-[#F4FAFF] space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-[#092F78] text-[11px] uppercase tracking-wider block">
                Follow ASPS:
              </span>
              <SocialLinks variant="footer" />
            </div>
            <div className="text-[11px] text-slate-600 pt-1 space-y-1">
              <p className="flex items-center gap-1.5 flex-wrap">
                <span>📞</span>
                <a href={`tel:${SCHOOL_INFO.phone[0]}`} className="font-bold text-[#0875C9] hover:underline">
                  {SCHOOL_INFO.phone[0]}
                </a>
                <span>,</span>
                <a href={`tel:${SCHOOL_INFO.phone[1]}`} className="font-bold text-[#0875C9] hover:underline">
                  {SCHOOL_INFO.phone[1]}
                </a>
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <span>✉️</span>
                <a href={`mailto:${SCHOOL_INFO.email}`} className="font-semibold text-[#0875C9] hover:underline truncate">
                  {SCHOOL_INFO.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
