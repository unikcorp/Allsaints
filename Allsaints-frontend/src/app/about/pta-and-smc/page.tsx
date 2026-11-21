"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAdminAuthenticated } from "@/utils/adminStorage";
import { apiGetCommittee, apiSaveCommitteeMember, apiDeleteCommitteeMember } from "@/utils/apiService";

export interface PtaLeader {
  id: string;
  role: string;
  name: string;
}

export interface PtaExecutive {
  id: string;
  sl: number;
  class: string;
  student: string;
  parent: string;
  phone: string;
}

export interface TeacherRep {
  id: string;
  name: string;
  phone: string;
}

export interface SmcMember {
  id: string;
  name: string;
  designation: string;
  occupation: string;
  term_period: string;
  phone_number: string;
}

const DEFAULT_LEADERSHIP: PtaLeader[] = [
  { id: "lead-1", role: "Manager", name: "Fr. Philipose Charivupurayidathil" },
  { id: "lead-2", role: "Principal", name: "Dr. Fr. James Steephen Olikal" },
  { id: "lead-3", role: "President", name: "Adv. Mathew K. Thomas" },
  { id: "lead-4", role: "Vice-President", name: "Mrs. Priya S. Nair" },
  { id: "lead-5", role: "Secretary", name: "Mrs. Jeethumol R P" },
];

const DEFAULT_EXECUTIVES: PtaExecutive[] = [
  { id: "exec-1", sl: 1, class: "LKG A", student: "Abra David George", parent: "Mrs. Beena David", phone: "9645620374" },
  { id: "exec-2", sl: 2, class: "UKG A", student: "Agnes Gilbert", parent: "Mrs. Shinu K Varghese", phone: "9526488534" },
  { id: "exec-3", sl: 3, class: "I D", student: "Arjun K Anil", parent: "Mrs. Rejani C", phone: "9496557388" },
  { id: "exec-4", sl: 4, class: "II B", student: "Ima M Aneesh", parent: "Mrs. Sajini Idiculla", phone: "8289821467" },
  { id: "exec-5", sl: 5, class: "III B", student: "Alankritha Anil", parent: "Aiswarya Anilkumar", phone: "7561868263" },
  { id: "exec-6", sl: 6, class: "IVC", student: "Savio Aju Koshy", parent: "Mr.Aju Koshy", phone: "8086624828" },
  { id: "exec-7", sl: 7, class: "V C", student: "Geon George Scariah", parent: "Mr. Scaria George", phone: "9746621558" },
  { id: "exec-8", sl: 8, class: "VI C", student: "Adwaith Adarsh", parent: "Mrs. Remya Adarsh", phone: "9544977128" },
  { id: "exec-9", sl: 9, class: "VII A", student: "Ethan Mathew Aji", parent: "Mrs. Golda aji", phone: "9497317805" },
  { id: "exec-10", sl: 10, class: "VIII A", student: "Sana Fathima", parent: "Mr. Mohammed Sahir", phone: "9447112940" },
  { id: "exec-11", sl: 11, class: "IX C", student: "Parvathy S Kumar", parent: "Mrs. Soumya S Nair", phone: "6282757806" },
  { id: "exec-12", sl: 12, class: "X B", student: "Shruthi Sharma", parent: "Mr. Prakash Sharma", phone: "9447259459" },
  { id: "exec-13", sl: 13, class: "XI A", student: "Abel Geo James", parent: "Mr. James George", phone: "6238274031" },
  { id: "exec-14", sl: 14, class: "XII A", student: "Gaius Mathai Biju", parent: "Mrs. Beena Kunnel Abraham", phone: "8848904764" },
];

const DEFAULT_TEACHERS: TeacherRep[] = [
  { id: "teach-1", name: "Mrs. JeethuMol R P", phone: "9446834681" },
  { id: "teach-2", name: "Mrs. Suja George", phone: "9846081247" },
  { id: "teach-3", name: "Mrs. Maya Das", phone: "9745447354" },
  { id: "teach-4", name: "Mrs. Shiny C Jinu", phone: "8589803747" },
  { id: "teach-5", name: "Mrs. Deepa V", phone: "9496731488" },
  { id: "teach-6", name: "Mrs. Rejani A P", phone: "9544113509" },
  { id: "teach-7", name: "Mrs. Manju P K", phone: "8848792942" },
  { id: "teach-8", name: "Mrs. Laila Boban", phone: "8301981975" },
  { id: "teach-9", name: "Mrs. Deepa M Philip", phone: "9446540213" },
];

const DEFAULT_SMC: SmcMember[] = [
  { id: "1", name: "Rev. Dr. James Stephen Olikal", designation: "Member Secretary / Principal", occupation: "Principal, All Saints Public School", term_period: "2025-2027", phone_number: "+91 4734 224455" },
  { id: "2", name: "Fr. Philipose Charivupurayidathil", designation: "Manager Nominee", occupation: "Director, ASPS", term_period: "2025-2027", phone_number: "+91 4734 224456" },
  { id: "3", name: "Adv. Mathew K. Thomas", designation: "Parent Representative / Advocate", occupation: "Advocate, District Court", term_period: "2025-2027", phone_number: "+91 94471 23456" },
  { id: "4", name: "Mrs. Priya S. Nair", designation: "Educationist Nominee", occupation: "Higher Secondary Teacher", term_period: "2025-2027", phone_number: "+91 94472 34567" },
];

export default function PtaPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [leadership, setLeadership] = useState<PtaLeader[]>(DEFAULT_LEADERSHIP);
  const [executives, setExecutives] = useState<PtaExecutive[]>(DEFAULT_EXECUTIVES);
  const [teachers, setTeachers] = useState<TeacherRep[]>(DEFAULT_TEACHERS);
  const [smcMembers, setSmcMembers] = useState<SmcMember[]>(DEFAULT_SMC);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [modalType, setModalType] = useState<"leader" | "executive" | "teacher" | "smc" | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [leaderForm, setLeaderForm] = useState<PtaLeader>({ id: "", role: "", name: "" });
  const [execForm, setExecForm] = useState<PtaExecutive>({ id: "", sl: 1, class: "", student: "", parent: "", phone: "" });
  const [teacherForm, setTeacherForm] = useState<TeacherRep>({ id: "", name: "", phone: "" });
  const [smcForm, setSmcForm] = useState<SmcMember>({ id: "", name: "", designation: "", occupation: "", term_period: "2025-2027", phone_number: "" });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    try {
      const savedL = localStorage.getItem("asps_pta_leadership");
      if (savedL) setLeadership(JSON.parse(savedL));
      const savedE = localStorage.getItem("asps_pta_executives");
      if (savedE) setExecutives(JSON.parse(savedE));
      const savedT = localStorage.getItem("asps_pta_teachers");
      if (savedT) setTeachers(JSON.parse(savedT));
      const savedS = localStorage.getItem("asps_smc_members");
      if (savedS) setSmcMembers(JSON.parse(savedS));
    } catch {}

    // Fetch live directly from MySQL Database
    apiGetCommittee().then((dbItems) => {
      if (dbItems && Array.isArray(dbItems) && dbItems.length > 0) {
        // SMC members
        const smcList = dbItems.filter((m: any) => m.committee_type === "SMC");
        if (smcList.length > 0) {
          const mappedSmc: SmcMember[] = smcList.map((m: any) => ({
            id: String(m.id),
            name: m.name,
            designation: m.designation,
            occupation: m.occupation || "",
            term_period: m.term_period || "2025-2027",
            phone_number: m.phone_number || "",
          }));
          setSmcMembers(mappedSmc);
          localStorage.setItem("asps_smc_members", JSON.stringify(mappedSmc));
        }

        // PTA Leaders
        const ptaList = dbItems.filter((m: any) => m.committee_type === "PTA" && !m.designation.startsWith("Parent Rep") && !m.designation.startsWith("Teacher Rep"));
        if (ptaList.length > 0) {
          const mappedLeaders: PtaLeader[] = ptaList.map((m: any) => ({
            id: String(m.id),
            role: m.designation,
            name: m.name,
          }));
          setLeadership(mappedLeaders);
          localStorage.setItem("asps_pta_leadership", JSON.stringify(mappedLeaders));
        }
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveLeadershipData = (data: PtaLeader[]) => {
    if (!isAdmin) return;
    setLeadership(data);
    localStorage.setItem("asps_pta_leadership", JSON.stringify(data));
  };

  const saveExecutivesData = (data: PtaExecutive[]) => {
    if (!isAdmin) return;
    setExecutives(data);
    localStorage.setItem("asps_pta_executives", JSON.stringify(data));
  };

  const saveTeachersData = (data: TeacherRep[]) => {
    if (!isAdmin) return;
    setTeachers(data);
    localStorage.setItem("asps_pta_teachers", JSON.stringify(data));
  };

  const saveSmcData = (data: SmcMember[]) => {
    if (!isAdmin) return;
    setSmcMembers(data);
    localStorage.setItem("asps_smc_members", JSON.stringify(data));
  };

  // ─── Open Modals ──────────────────────────────────────────────────────────
  const openAddLeader = () => {
    if (!isAdmin) return;
    setIsEditing(false);
    setLeaderForm({ id: `lead-${Date.now()}`, role: "", name: "" });
    setModalType("leader");
  };

  const openEditLeader = (item: PtaLeader) => {
    if (!isAdmin) return;
    setIsEditing(true);
    setLeaderForm({ ...item });
    setModalType("leader");
  };

  const openAddExecutive = () => {
    if (!isAdmin) return;
    setIsEditing(false);
    setExecForm({
      id: `exec-${Date.now()}`,
      sl: executives.length + 1,
      class: "",
      student: "",
      parent: "",
      phone: "",
    });
    setModalType("executive");
  };

  const openEditExecutive = (item: PtaExecutive) => {
    if (!isAdmin) return;
    setIsEditing(true);
    setExecForm({ ...item });
    setModalType("executive");
  };

  const openAddTeacher = () => {
    if (!isAdmin) return;
    setIsEditing(false);
    setTeacherForm({ id: `teach-${Date.now()}`, name: "", phone: "" });
    setModalType("teacher");
  };

  const openEditTeacher = (item: TeacherRep) => {
    if (!isAdmin) return;
    setIsEditing(true);
    setTeacherForm({ ...item });
    setModalType("teacher");
  };

  const openAddSmc = () => {
    if (!isAdmin) return;
    setIsEditing(false);
    setSmcForm({ id: `smc-${Date.now()}`, name: "", designation: "", occupation: "", term_period: "2025-2027", phone_number: "" });
    setModalType("smc");
  };

  const openEditSmc = (item: SmcMember) => {
    if (!isAdmin) return;
    setIsEditing(true);
    setSmcForm({ ...item });
    setModalType("smc");
  };

  // ─── Save Handlers (Live MySQL Sync) ──────────────────────────────────────
  const handleSaveLeader = async (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!leaderForm.role.trim() || !leaderForm.name.trim()) return;

    try {
      const payload = {
        id: isEditing && !String(leaderForm.id).startsWith("lead-") && !isNaN(Number(leaderForm.id)) ? Number(leaderForm.id) : undefined,
        committee_type: "PTA",
        designation: leaderForm.role,
        name: leaderForm.name,
        term_period: "2025-2026",
      };

      const res = await apiSaveCommitteeMember(payload);
      const savedId = res?.id ? String(res.id) : leaderForm.id;
      const finalLeader = { ...leaderForm, id: savedId };

      let updated: PtaLeader[];
      if (isEditing) {
        updated = leadership.map((l) => (l.id === leaderForm.id || l.name === leaderForm.name ? finalLeader : l));
        showToast(`Updated "${leaderForm.role}" in database.`);
      } else {
        updated = [...leadership, finalLeader];
        showToast(`Added "${leaderForm.name}" to database.`);
      }
      saveLeadershipData(updated);
      setModalType(null);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteLeader = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from PTA Leadership?`)) {
      try {
        await apiDeleteCommitteeMember(id, name);
      } catch (err) {
        console.error("Delete failed:", err);
      }
      const updated = leadership.filter((l) => l.id !== id && l.name !== name);
      saveLeadershipData(updated);
      showToast(`Removed "${name}" from database.`);
    }
  };

  const handleSaveExecutive = async (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!execForm.student.trim() || !execForm.parent.trim()) return;

    try {
      const payload = {
        id: isEditing && !String(execForm.id).startsWith("exec-") && !isNaN(Number(execForm.id)) ? Number(execForm.id) : undefined,
        committee_type: "PTA",
        designation: `Parent Rep (${execForm.class})`,
        name: `${execForm.parent} (P/o ${execForm.student})`,
        phone_number: execForm.phone,
        term_period: "2025-2026",
        display_order: execForm.sl,
      };

      const res = await apiSaveCommitteeMember(payload);
      const savedId = res?.id ? String(res.id) : execForm.id;
      const finalExec = { ...execForm, id: savedId };

      let updated: PtaExecutive[];
      if (isEditing) {
        updated = executives.map((ex) => (ex.id === execForm.id ? finalExec : ex));
        showToast(`Updated ${execForm.student}'s record in database.`);
      } else {
        updated = [...executives, finalExec];
        showToast(`Added ${execForm.student} to database.`);
      }
      saveExecutivesData(updated);
      setModalType(null);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteExecutive = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from Executive Members?`)) {
      try {
        await apiDeleteCommitteeMember(id, name);
      } catch (err) {
        console.error("Delete failed:", err);
      }
      const updated = executives.filter((ex) => ex.id !== id);
      saveExecutivesData(updated);
      showToast(`Removed "${name}" from database.`);
    }
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!teacherForm.name.trim()) return;

    try {
      const payload = {
        id: isEditing && !String(teacherForm.id).startsWith("teach-") && !isNaN(Number(teacherForm.id)) ? Number(teacherForm.id) : undefined,
        committee_type: "PTA",
        designation: "Teacher Rep",
        name: teacherForm.name,
        phone_number: teacherForm.phone,
        term_period: "2025-2026",
      };

      const res = await apiSaveCommitteeMember(payload);
      const savedId = res?.id ? String(res.id) : teacherForm.id;
      const finalTeacher = { ...teacherForm, id: savedId };

      let updated: TeacherRep[];
      if (isEditing) {
        updated = teachers.map((t) => (t.id === teacherForm.id || t.name === teacherForm.name ? finalTeacher : t));
        showToast(`Updated "${teacherForm.name}" in database.`);
      } else {
        updated = [...teachers, finalTeacher];
        showToast(`Added "${teacherForm.name}" to database.`);
      }
      saveTeachersData(updated);
      setModalType(null);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from Teachers list?`)) {
      try {
        await apiDeleteCommitteeMember(id, name);
      } catch (err) {
        console.error("Delete failed:", err);
      }
      const updated = teachers.filter((t) => t.id !== id && t.name !== name);
      saveTeachersData(updated);
      showToast(`Removed "${name}" from database.`);
    }
  };

  const handleSaveSmc = async (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!smcForm.name.trim() || !smcForm.designation.trim()) return;

    try {
      const payload = {
        id: isEditing && !String(smcForm.id).startsWith("smc-") && !isNaN(Number(smcForm.id)) ? Number(smcForm.id) : undefined,
        committee_type: "SMC",
        name: smcForm.name,
        designation: smcForm.designation,
        occupation: smcForm.occupation || null,
        term_period: smcForm.term_period || "2025-2027",
        phone_number: smcForm.phone_number || null,
      };

      const res = await apiSaveCommitteeMember(payload);
      const savedId = res?.id ? String(res.id) : smcForm.id;
      const finalSmc = { ...smcForm, id: savedId };

      let updated: SmcMember[];
      if (isEditing) {
        updated = smcMembers.map((m) => (m.id === smcForm.id || m.name === smcForm.name ? finalSmc : m));
        showToast(`Updated "${smcForm.name}" in database.`);
      } else {
        updated = [...smcMembers, finalSmc];
        showToast(`Added "${smcForm.name}" to SMC in database.`);
      }
      saveSmcData(updated);
      setModalType(null);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteSmc = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from School Management Committee (SMC)?`)) {
      try {
        await apiDeleteCommitteeMember(id, name);
      } catch (err) {
        console.error("Delete failed:", err);
      }
      const updated = smcMembers.filter((m) => m.id !== id && m.name !== name);
      saveSmcData(updated);
      showToast(`Removed "${name}" from SMC database.`);
    }
  };

  const handleResetDefaults = () => {
    if (!isAdmin) return;
    if (window.confirm("Restore official school PTA & SMC default committee lists?")) {
      saveLeadershipData(DEFAULT_LEADERSHIP);
      saveExecutivesData(DEFAULT_EXECUTIVES);
      saveTeachersData(DEFAULT_TEACHERS);
      saveSmcData(DEFAULT_SMC);
      showToast("Restored official defaults.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAFF] py-5 sm:py-6 md:py-7 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0879C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB000] text-xs font-serif font-bold flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ─── 1. TOP HEADER & INTRO CARD MATCHING REFERENCE DESIGN ─── */}
        <div className="bg-white rounded-2xl border border-[#D8EAF8] shadow-xs relative overflow-hidden p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
          
          {/* Flowing Soft Blue Wave SVG Across Bottom of Card */}
          <div className="absolute -bottom-0.5 left-0 right-0 h-8 sm:h-10 pointer-events-none overflow-hidden select-none z-0">
            <svg
              className="w-full h-full opacity-30"
              viewBox="0 0 1000 80"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,30 C180,60 340,10 520,40 C700,70 840,15 1000,35 L1000,80 L0,80 Z"
                fill="url(#ptaCardWave1)"
              />
              <path
                d="M0,50 C220,15 380,60 580,30 C740,5 880,45 1000,30 L1000,80 L0,80 Z"
                fill="url(#ptaCardWave2)"
                opacity="0.6"
              />
              <defs>
                <linearGradient id="ptaCardWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0879C9" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0756A5" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="ptaCardWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0756A5" stopOpacity="0.35" />
                  <stop offset="40%" stopColor="#0879C9" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Card Foreground Content */}
          <div className="relative z-10">
            {/* Breadcrumb Navigation: Home › About ASPS › PTA & SMC (15-20px bottom spacing) */}
            <nav className="mb-3 text-xs sm:text-[13px] font-sans font-medium text-[#64748B] flex items-center gap-1.5 sm:gap-2">
              <Link href="/" className="hover:text-[#0879C9] transition-colors">
                Home
              </Link>
              <span className="text-slate-400">&rsaquo;</span>
              <span className="text-[#64748B]">About ASPS</span>
              <span className="text-slate-400">&rsaquo;</span>
              <span className="text-[#0756A5] font-bold">PTA &amp; SMC</span>
            </nav>

            {/* Centered Main Title Banner with Horizontal Decorative Lines */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-1 sm:my-1.5">
              {/* Left Horizontal Decorative Line */}
              <div
                className="hidden sm:block flex-1 h-[1.5px] max-w-[80px] sm:max-w-[120px] md:max-w-[160px] bg-gradient-to-r from-transparent via-[#0879C9]/60 to-[#0879C9] rounded-l-full"
                aria-hidden="true"
              />

              {/* Pill Banner */}
              <div className="rounded-full bg-gradient-to-r from-[#0879C9] via-[#0756A5] to-[#0756A5] px-6 sm:px-10 py-1.5 sm:py-2 shadow-xs shadow-[#0756A5]/25 border border-white/20 flex-shrink-0 transition-transform hover:scale-[1.01]">
                <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-black uppercase tracking-wider text-white drop-shadow-xs select-none text-center">
                  PTA &amp; SMC
                </h1>
              </div>

              {/* Right Horizontal Decorative Line */}
              <div
                className="hidden sm:block flex-1 h-[1.5px] max-w-[80px] sm:max-w-[120px] md:max-w-[160px] bg-gradient-to-r from-[#0879C9] via-[#0879C9]/60 to-transparent rounded-r-full"
                aria-hidden="true"
              />
            </div>

            {/* Description Section with Education Icon and Divider (20-25px gap from banner) */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4.5">
              {/* Blue Parent/Student Education Icon */}
              <div className="flex-shrink-0 flex items-center justify-center text-[#0879C9]">
                <svg
                  className="w-12 h-12 sm:w-14 sm:h-14"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="21" cy="26" r="5" fill="#0879C9" />
                  <path
                    d="M11 41c0-4.5 3.5-8 8.5-8 2.2 0 4.2.8 5.7 2.1-.8 1.8-1.2 3.8-1.2 5.9H11z"
                    fill="#0879C9"
                  />
                  <circle cx="36" cy="20" r="6.5" fill="#0879C9" />
                  <path
                    d="M26 39c0-5.5 4.5-10 10-10s10 4.5 10 10H26z"
                    fill="#0879C9"
                  />
                  <circle cx="51" cy="26" r="5" fill="#0879C9" />
                  <path
                    d="M48 35.1c1.5-1.3 3.5-2.1 5.7-2.1 5 0 8.5 3.5 8.5 8H49.2c0-2.1-.4-4.1-1.2-5.9z"
                    fill="#0879C9"
                  />
                  <path
                    d="M36 45.5C31.5 43 25.5 42 19 42c-4.5 0-9 .6-13 1.8v10.5c4-1.2 8.5-1.8 13-1.8 5.5 0 11 .8 15 3.2 1.2.7 2.8.7 4 0 4-2.4 9.5-3.2 15-3.2 4.5 0 9 .6 13 1.8V43.8c-4-1.2-8.5-1.8-13-1.8-6.5 0-12.5 1-17 3.5z"
                    fill="#0879C9"
                  />
                  <path
                    d="M36 48.5C31.5 46.2 25.8 45.2 19.5 45.2c-4.2 0-8.3.6-12 1.6v2.2c3.7-1 7.8-1.6 12-1.6 6 0 11.5.9 15.5 3.1.6.3 1.4.3 2 0 4-2.2 9.5-3.1 15.5-3.1 4.2 0 8.3.6 12 1.6v-2.2c-3.7-1-7.8-1.6-12-1.6-6.3 0-12 1-16.5 3.3z"
                    fill="#0756A5"
                    opacity="0.35"
                  />
                </svg>
              </div>

              {/* Thin Vertical Divider Line */}
              <div className="hidden sm:block w-[1.5px] self-stretch bg-[#D8EAF8]" aria-hidden="true" />

              {/* Description Text */}
              <div className="flex-1 text-[#1E293B] text-xs sm:text-[13px] leading-relaxed text-justify sm:text-left font-sans">
                <p>
                  The Parent &ndash; Teacher Association (PTA) actively supports all school activities. General parents&rsquo; meetings are held occasionally, and all parents are encouraged to participate. Elections for the executive committee occur at the start of every academic year. A School Management Committee (SMC) is also in place, consisting of experts and representatives from various fields.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Admin Bar (Visible when Admin is Authenticated) ─────────────── */}
        {isAdmin && (
          <div className="bg-[#EAF6FF] border border-[#0875C9] rounded-xl p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🤝</span>
              <div>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#092F78] flex items-center gap-2">
                  <span>PTA &amp; SMC Committee Editor</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Admin Active
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add, edit, or delete committee members, executives, teachers, and SMC members with real-time MySQL sync.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={openAddLeader}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-3 py-1.5 rounded-lg text-xs font-serif font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                + Add Leader
              </button>
              <button
                type="button"
                onClick={openAddExecutive}
                className="bg-[#FFB000] hover:bg-[#E0A400] text-slate-900 px-3 py-1.5 rounded-lg text-xs font-serif font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                + Add Executive
              </button>
              <button
                type="button"
                onClick={openAddSmc}
                className="bg-[#092F78] hover:bg-[#0066B5] text-white px-3 py-1.5 rounded-lg text-xs font-serif font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                + Add SMC Member
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                ↺ Defaults
              </button>
            </div>
          </div>
        )}

        {/* ─── 1B. NEW PTA EXECUTIVE MEMBERS 2026-27 GROUP PHOTO (AT THE TOP) ─── */}
        <div className="bg-white rounded-2xl border border-[#D8EAF8] shadow-xs overflow-hidden p-3.5 sm:p-5">
          {/* Section Header */}
          <div className="text-center mb-3 sm:mb-4">
            <span className="inline-block px-3 py-1 bg-[#EAF6FF] text-[#0879C9] border border-[#D8EAF8] rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 font-sans">
              Parent – Teacher Association
            </span>
            <h2 className="text-base sm:text-lg md:text-xl font-serif font-black text-[#0756A5] tracking-tight">
              Our New P T A Executive Members for the Academic Year 2026-27
            </h2>
            <p className="text-xs sm:text-sm font-serif font-bold text-[#D97706] mt-0.5 tracking-wide">
              Congrats and Best Wishes.
            </p>
          </div>

          {/* Photo Frame with Text Written in Photo */}
          <div className="relative w-full rounded-xl overflow-hidden border border-[#D8EAF8] shadow-xs group bg-slate-50">
            <Image
              src="/images/pta/pta-executives-2026-27.jpg"
              alt="Our New P T A Executive Members for the Academic Year 2026-27. Congrats and Best Wishes."
              width={1200}
              height={675}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              priority
              unoptimized
            />

            {/* In-Photo Elegant Glassmorphic Banner Overlay at Bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0756A5]/95 via-[#0756A5]/80 to-transparent pt-8 pb-3 px-3 sm:px-6 text-white text-center">
              <p className="font-serif font-black text-xs sm:text-base md:text-lg tracking-wide drop-shadow-md text-white">
                Our New P T A Executive Members for the Academic Year 2026-27.
              </p>
              <p className="font-serif font-bold text-[11px] sm:text-sm text-[#FFB000] tracking-wider drop-shadow-sm mt-0.5">
                Congrats and Best Wishes.
              </p>
            </div>
          </div>

          {/* Bottom Caption */}
          <div className="mt-2.5 text-center">
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              <strong className="text-[#0756A5]">All Saints Public School, Adoor</strong> &bull; Executive Committee 2026&ndash;2027
            </p>
          </div>
        </div>

        {/* ─── 2. PTA LEADERSHIP SECTION MATCHING REFERENCE DESIGN ─── */}
        <div className="bg-[#F4FAFF] rounded-2xl p-4 sm:p-5 border border-[#D8EAF8] shadow-xs">
          {/* Elegant Light-Blue Section Header with Decorative Lines (15px bottom spacing) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3.5">
            <div
              className="h-[1.5px] w-10 sm:w-16 md:w-24 bg-gradient-to-r from-transparent via-[#0879C9]/60 to-[#0879C9] rounded-l-full"
              aria-hidden="true"
            />
            <h2 className="text-base sm:text-lg md:text-xl font-serif font-black text-[#0756A5] tracking-wide text-center">
              PTA Leadership
            </h2>
            <div
              className="h-[1.5px] w-10 sm:w-16 md:w-24 bg-gradient-to-r from-[#0879C9] via-[#0879C9]/60 to-transparent rounded-r-full"
              aria-hidden="true"
            />
            {isAdmin && (
              <button
                type="button"
                onClick={openAddLeader}
                className="ml-2 text-xs bg-[#0875C9] text-white px-2 py-0.5 rounded-lg font-bold hover:bg-[#0066B5] transition-all cursor-pointer"
              >
                + Add
              </button>
            )}
          </div>

          <div className="max-w-2xl mx-auto space-y-2 sm:space-y-2.5">
            {leadership.map((item) => (
              <div
                key={item.id}
                className="bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-2xs border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-center sm:text-left transition-all hover:shadow-xs"
              >
                <div className="flex-1">
                  <div className="text-[#0879C9] font-bold text-xs font-serif uppercase tracking-wider">
                    {item.role}
                  </div>
                  <div className="text-[#0756A5] text-xs sm:text-sm font-semibold">
                    {item.name}
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditLeader(item)}
                      className="text-xs bg-[#EAF6FF] text-[#0879C9] hover:bg-[#0879C9] hover:text-white px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLeader(item.id, item.name)}
                      className="text-xs text-rose-600 hover:bg-rose-50 px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── 3. PTA EXECUTIVE MEMBERS TABLE ─── */}
        <div className="bg-white rounded-xl border border-[#D8EAF8] shadow-2xs overflow-hidden">
          <div className="bg-gradient-to-r from-[#0879C9] to-[#0756A5] text-white flex items-center justify-between py-2 px-3.5 sm:px-4">
            <h2 className="text-xs sm:text-sm font-serif font-bold tracking-wide">
              PTA Executive Members 2024-25
            </h2>
            {isAdmin && (
              <button
                type="button"
                onClick={openAddExecutive}
                className="text-xs bg-[#FFB000] text-slate-900 px-2.5 py-0.5 rounded-lg font-bold hover:bg-[#E0A400] transition-all cursor-pointer"
              >
                + Add Member
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4FAFF] text-[#0756A5] border-b border-[#D8EAF8] font-bold uppercase text-[10.5px]">
                  <th className="py-2 px-3 border-r border-[#D8EAF8] text-center w-12">SL NO</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8] w-20">CLASS</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">STUDENT NAME</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">PARENT NAME</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">PHONE</th>
                  {isAdmin && <th className="py-2 px-3 text-right">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {executives.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#F4FAFF]/70"}
                  >
                    <td className="py-2 px-3 text-center border-r border-slate-100 font-medium">{m.sl}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-semibold text-[#0879C9]">{m.class}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-medium">{m.student}</td>
                    <td className="py-2 px-3 border-r border-slate-100">{m.parent}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-semibold text-slate-800">
                      <a href={`tel:${m.phone}`} className="hover:text-[#0879C9] transition-colors">
                        {m.phone}
                      </a>
                    </td>
                    {isAdmin && (
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditExecutive(m)}
                            className="text-[11px] bg-[#EAF6FF] text-[#0879C9] hover:bg-[#0879C9] hover:text-white px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExecutive(m.id, m.student)}
                            className="text-[11px] text-rose-600 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── 4. TEACHER REPRESENTATIVES TABLE ─── */}
        <div className="bg-white rounded-xl border border-[#D8EAF8] shadow-2xs overflow-hidden">
          <div className="bg-gradient-to-r from-[#0879C9] to-[#0756A5] text-white flex items-center justify-between py-2 px-3.5 sm:px-4">
            <h2 className="text-xs sm:text-sm font-serif font-bold tracking-wide">
              Teacher Representatives
            </h2>
            {isAdmin && (
              <button
                type="button"
                onClick={openAddTeacher}
                className="text-xs bg-[#FFB000] text-slate-900 px-2.5 py-0.5 rounded-lg font-bold hover:bg-[#E0A400] transition-all cursor-pointer"
              >
                + Add Teacher
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4FAFF] text-[#0756A5] border-b border-[#D8EAF8] font-bold uppercase text-[10.5px]">
                  <th className="py-2 px-3 border-r border-[#D8EAF8] text-center w-12">SL NO</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">NAME OF TEACHER</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">PHONE</th>
                  {isAdmin && <th className="py-2 px-3 text-right">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {teachers.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#F4FAFF]/70"}
                  >
                    <td className="py-2 px-3 text-center border-r border-slate-100 font-medium">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-semibold text-slate-800">{t.name}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-semibold text-[#0879C9]">
                      <a href={`tel:${t.phone}`} className="hover:underline">
                        {t.phone}
                      </a>
                    </td>
                    {isAdmin && (
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditTeacher(t)}
                            className="text-[11px] bg-[#EAF6FF] text-[#0879C9] hover:bg-[#0879C9] hover:text-white px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeacher(t.id, t.name)}
                            className="text-[11px] text-rose-600 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── 5. SCHOOL MANAGEMENT COMMITTEE (SMC) TABLE ─── */}
        <div className="bg-white rounded-xl border border-[#D8EAF8] shadow-2xs overflow-hidden">
          <div className="bg-gradient-to-r from-[#0756A5] to-[#064A91] text-white flex items-center justify-between py-2 px-3.5 sm:px-4">
            <div>
              <h2 className="text-xs sm:text-sm font-serif font-bold tracking-wide">
                School Management Committee (SMC)
              </h2>
              <p className="text-[10.5px] text-[#FFB000] font-sans">
                Statutory CBSE Governing Body &amp; Advisory Council
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={openAddSmc}
                className="text-xs bg-[#FFB000] hover:bg-[#E0A400] text-slate-900 px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer"
              >
                + Add SMC Member
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4FAFF] text-[#0756A5] border-b border-[#D8EAF8] font-bold uppercase text-[10.5px]">
                  <th className="py-2 px-3 border-r border-[#D8EAF8] text-center w-12">SL NO</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">MEMBER NAME</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">DESIGNATION / ROLE</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">OCCUPATION / PROFESSION</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">TERM</th>
                  <th className="py-2 px-3 border-r border-[#D8EAF8]">PHONE</th>
                  {isAdmin && <th className="py-2 px-3 text-right">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {smcMembers.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#F4FAFF]/70"}
                  >
                    <td className="py-2 px-3 text-center border-r border-slate-100 font-medium">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-bold text-[#0756A5]">{m.name}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-semibold text-[#0879C9]">{m.designation}</td>
                    <td className="py-2 px-3 border-r border-slate-100 text-slate-600">{m.occupation || "—"}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-medium">{m.term_period}</td>
                    <td className="py-2 px-3 border-r border-slate-100 font-medium text-slate-800">
                      {m.phone_number ? (
                        <a href={`tel:${m.phone_number}`} className="hover:text-[#0879C9]">
                          {m.phone_number}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    {isAdmin && (
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditSmc(m)}
                            className="text-[11px] bg-[#EAF6FF] text-[#0879C9] hover:bg-[#0879C9] hover:text-white px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSmc(m.id, m.name)}
                            className="text-[11px] text-rose-600 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── 6. OFFICIAL PDF DOWNLOAD LINK ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-xl border border-[#D8EAF8] shadow-2xs">
          <div>
            <h3 className="text-xs sm:text-sm font-serif font-bold text-[#0756A5]">
              PTA EXECUTIVES &amp; SMC 2024-2025
            </h3>
            <p className="text-[11px] text-slate-500">
              Official ratified list of executive committee members &amp; governing body
            </p>
          </div>
          <a
            href="/documents/affiliation-certificate"
            className="bg-gradient-to-r from-[#0879C9] to-[#0756A5] hover:opacity-90 text-white px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all shadow-2xs hover:shadow-xs whitespace-nowrap"
          >
            View Document
          </a>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-1 pb-3 text-[11px] text-slate-400">
          <p>All Saints Public School | Committed to Excellence in Education</p>
        </div>

      </div>

      {/* ─── MODAL 1: LEADERSHIP ─────────────────────────────────────────── */}
      {modalType === "leader" && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {isEditing ? "Edit Leadership Member" : "Add Leadership Member"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveLeader} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  required
                  value={leaderForm.role}
                  onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                  placeholder="e.g. President, Vice-President"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={leaderForm.name}
                  onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                  placeholder="e.g. Adv. Mathew K. Thomas"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-serif font-bold text-white bg-[#0875C9] hover:bg-[#0066B5] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: EXECUTIVE MEMBER ───────────────────────────────────── */}
      {modalType === "executive" && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {isEditing ? "Edit Executive Member" : "Add Executive Member"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveExecutive} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Sl No
                  </label>
                  <input
                    type="number"
                    value={execForm.sl}
                    onChange={(e) => setExecForm({ ...execForm, sl: Number(e.target.value) || 1 })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Class *
                  </label>
                  <input
                    type="text"
                    required
                    value={execForm.class}
                    onChange={(e) => setExecForm({ ...execForm, class: e.target.value })}
                    placeholder="e.g. LKG A, X B"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={execForm.student}
                  onChange={(e) => setExecForm({ ...execForm, student: e.target.value })}
                  placeholder="e.g. Abra David George"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={execForm.parent}
                  onChange={(e) => setExecForm({ ...execForm, parent: e.target.value })}
                  placeholder="e.g. Mrs. Beena David"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={execForm.phone}
                  onChange={(e) => setExecForm({ ...execForm, phone: e.target.value })}
                  placeholder="e.g. 9645620374"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-serif font-bold text-white bg-[#0875C9] hover:bg-[#0066B5] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: TEACHER REPRESENTATIVE ─────────────────────────────── */}
      {modalType === "teacher" && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {isEditing ? "Edit Teacher Representative" : "Add Teacher Representative"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Teacher Name *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Mrs. JeethuMol R P"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  placeholder="e.g. 9446834681"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-serif font-bold text-white bg-[#0875C9] hover:bg-[#0066B5] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: SMC MEMBER ─────────────────────────────────────────── */}
      {modalType === "smc" && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {isEditing ? "Edit SMC Member" : "Add SMC Member"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveSmc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Member Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  value={smcForm.name}
                  onChange={(e) => setSmcForm({ ...smcForm, name: e.target.value })}
                  placeholder="e.g. Rev. Dr. James Stephen Olikal"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={smcForm.designation}
                    onChange={(e) => setSmcForm({ ...smcForm, designation: e.target.value })}
                    placeholder="e.g. Member Secretary / Principal"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Term Period
                  </label>
                  <input
                    type="text"
                    value={smcForm.term_period}
                    onChange={(e) => setSmcForm({ ...smcForm, term_period: e.target.value })}
                    placeholder="e.g. 2025-2027"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Occupation / Professional Role
                </label>
                <input
                  type="text"
                  value={smcForm.occupation}
                  onChange={(e) => setSmcForm({ ...smcForm, occupation: e.target.value })}
                  placeholder="e.g. Principal, All Saints Public School"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={smcForm.phone_number}
                  onChange={(e) => setSmcForm({ ...smcForm, phone_number: e.target.value })}
                  placeholder="e.g. +91 4734 224455"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-serif font-bold text-white bg-[#0875C9] hover:bg-[#0066B5] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save SMC Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
