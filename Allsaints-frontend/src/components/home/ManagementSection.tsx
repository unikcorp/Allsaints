"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ManagementMember,
  DEFAULT_MANAGEMENT,
  getStoredManagement,
} from "@/utils/adminStorage";
import { apiGetManagement } from "@/utils/apiService";

export default function ManagementSection() {
  const [members, setMembers] = useState<ManagementMember[]>(DEFAULT_MANAGEMENT);

  useEffect(() => {
    setMembers(getStoredManagement());
    apiGetManagement().then((dbMembers) => {
      if (dbMembers && Array.isArray(dbMembers) && dbMembers.length > 0) {
        const mapped: ManagementMember[] = dbMembers.map((m: any) => ({
          id: String(m.id),
          name: m.name,
          role: m.role,
          subRole: m.sub_role || "",
          image: m.photo_url || "/images/management/principal.jpg",
          quote: m.quote || "",
          bio: m.bio || "",
          order: Number(m.display_order) || 1,
        }));
        setMembers(mapped);
      }
    });
  }, []);

  const patron = members.find((m) => m.role.toLowerCase().includes("patron &") || m.id === "1" || m.id === "patron-1") || members[0];
  const formerPatron = members.find((m) => m.role.toLowerCase().includes("former") || m.id === "2" || m.id === "former-patron-1") || members[1];
  const otherLeaders = members.filter((m) => m.id !== patron?.id && m.id !== formerPatron?.id);

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-[#F4FAFF] to-white border-b border-slate-200">
      <div className="container-custom">
        
        {/* ─── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0875C9]" />
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0875C9]">
              Visionary Governance &amp; Pastoral Care
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#092F78] tracking-tight mb-3">
            Our Patrons &amp; Management Board
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mx-auto mb-4" />
          <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed">
            All Saints Public School is governed under the aegis of{" "}
            <strong>The Malankara Catholic Educational Society of the Diocese of Pathanamthitta</strong>, providing exemplary CBSE education rooted in moral integrity, academic brilliance, and service to society.
          </p>
        </div>

        {/* ─── 1. Grand Patron Spotlight Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Patron */}
          {patron && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all border-2 border-[#D8EAF8] flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#EAF6FF] via-transparent to-transparent pointer-events-none" />

              <div className="relative w-48 sm:w-56 md:w-60 h-64 sm:h-76 md:h-84 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-[#0875C9]/20 group-hover:border-[#0875C9] transition-all bg-slate-100">
                <Image
                  src={patron.image}
                  alt={patron.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 240px, 280px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 inset-x-0 text-center text-white text-[11px] font-serif font-semibold drop-shadow">
                  {patron.subRole || "Diocese of Pathanamthitta"}
                </span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-[#0875C9] text-white text-xs font-serif font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 shadow-2xs">
                  {patron.role}
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#092F78] leading-snug mb-2">
                  {patron.name}
                </h3>
                {patron.subRole && (
                  <p className="text-xs sm:text-sm font-semibold text-[#FFB900] mb-3">
                    {patron.subRole}
                  </p>
                )}
                {patron.quote && (
                  <div className="border-l-2 border-[#0875C9] pl-3 italic text-xs sm:text-sm text-slate-600 mb-4 bg-[#EAF6FF] py-2 rounded-r-lg">
                    &ldquo;{patron.quote}&rdquo;
                  </div>
                )}
                <p className="text-[12px] text-slate-500 font-sans">
                  {patron.bio || "President, The Malankara Catholic Educational Society of the Diocese of Pathanamthitta."}
                </p>
              </div>
            </div>
          )}

          {/* Former Patron */}
          {formerPatron && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all border-2 border-slate-200 hover:border-[#0875C9]/40 flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#EAF6FF] via-transparent to-transparent pointer-events-none" />

              <div className="relative w-48 sm:w-56 md:w-60 h-64 sm:h-76 md:h-84 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-slate-200 group-hover:border-[#0875C9] transition-all bg-slate-100">
                <Image
                  src={formerPatron.image}
                  alt={formerPatron.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 240px, 280px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 inset-x-0 text-center text-white text-[11px] font-serif font-semibold drop-shadow">
                  {formerPatron.subRole || "Bishop Emeritus"}
                </span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-[#092F78] text-white text-xs font-serif font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 shadow-2xs">
                  {formerPatron.role}
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#092F78] leading-snug mb-2">
                  {formerPatron.name}
                </h3>
                {formerPatron.subRole && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-3">
                    {formerPatron.subRole}
                  </p>
                )}
                {formerPatron.quote && (
                  <div className="border-l-2 border-[#0875C9] pl-3 italic text-xs sm:text-sm text-slate-600 mb-4 bg-slate-50 py-2 rounded-r-lg">
                    &ldquo;{formerPatron.quote}&rdquo;
                  </div>
                )}
                <p className="text-[12px] text-slate-500 font-sans">
                  {formerPatron.bio || "Guided the school with steadfast faith, fostering generations of creators since June 2002."}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* ─── 2. School Leadership Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {otherLeaders.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-[#0875C9] shadow-sm hover:shadow-xl transition-all text-center group flex flex-col justify-between"
            >
              <div>
                <div className="relative w-48 sm:w-56 md:w-60 h-64 sm:h-76 md:h-84 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-[#0875C9]/20 group-hover:border-[#0875C9] mb-5 bg-slate-100 transition-all">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 240px, 280px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {m.subRole && (
                    <span className="absolute bottom-2.5 inset-x-0 text-center text-white text-[11px] font-serif font-semibold drop-shadow">
                      {m.subRole}
                    </span>
                  )}
                </div>
                <span className="inline-block bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-2.5 shadow-2xs">
                  {m.role}
                </span>
                <h4 className="font-serif font-bold text-lg sm:text-xl text-[#092F78] mb-1 leading-snug">
                  {m.name}
                </h4>
                {m.subRole && (
                  <p className="text-xs sm:text-sm text-[#FFB900] font-semibold mb-2">
                    {m.subRole}
                  </p>
                )}
                {m.quote && (
                  <div className="border-l-2 border-[#0875C9] pl-3 italic text-xs text-slate-600 mb-3 bg-[#EAF6FF] py-1.5 rounded-r-lg text-left">
                    &ldquo;{m.quote}&rdquo;
                  </div>
                )}
              </div>
              {m.bio && (
                <p className="text-xs text-slate-500 leading-relaxed font-sans mt-3 pt-3 border-t border-slate-100">
                  {m.bio}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* View All Management Link */}
        <div className="text-center mt-10">
          <Link
            href="/about/our-management"
            className="inline-flex items-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-7 py-3 rounded-full text-xs font-serif font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all"
          >
            <span>View Full Management Board &amp; Governing Body</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
