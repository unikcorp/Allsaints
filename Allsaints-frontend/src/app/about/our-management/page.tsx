"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ManagementMember,
  DEFAULT_MANAGEMENT,
  getStoredManagement,
  isAdminAuthenticated,
  clearAdminSession,
} from "@/utils/adminStorage";
import {
  apiGetManagement,
  apiSaveManagementMember,
  apiDeleteManagementMember,
  apiUploadFile,
} from "@/utils/apiService";

export default function OurManagementPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<ManagementMember[]>(DEFAULT_MANAGEMENT);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ManagementMember | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [formData, setFormData] = useState<ManagementMember>({
    id: "",
    name: "",
    role: "",
    subRole: "",
    image: "",
    quote: "",
    bio: "",
    order: 1,
  });
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setMembers(getStoredManagement());

    // Fetch live management members
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
        localStorage.setItem("asps_management_members", JSON.stringify(mapped));
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("File size exceeds 8MB.");
      return;
    }

    setUploadError("");
    setUploadFileName(file.name);

    // Upload directly to server file store
    try {
      const uploadRes = await apiUploadFile(file);
      if (uploadRes.success && uploadRes.url) {
        setFormData((prev) => ({ ...prev, image: uploadRes.url }));
        return;
      }
    } catch {}

    // Fallback to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    if (!isAdmin) return;
    setEditingMember(null);
    setUploadFileName("");
    setUploadError("");
    setImageInputMode("upload");
    setFormData({
      id: `mgt-${Date.now()}`,
      name: "",
      role: "",
      subRole: "",
      image: "",
      quote: "",
      bio: "",
      order: members.length + 1,
    });
    setShowModal(true);
  };

  const openEdit = (member: ManagementMember) => {
    if (!isAdmin) return;
    setEditingMember(member);
    setUploadFileName("");
    setUploadError("");
    setImageInputMode(member.image?.startsWith("data:") ? "upload" : "url");
    setFormData({ ...member });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Name and role are required.");
      return;
    }
    if (!formData.image.trim()) {
      alert("Please upload or provide a portrait photograph.");
      return;
    }

    try {
      const savePayload = {
        id: editingMember && !String(formData.id).startsWith("mgt-") && !isNaN(Number(formData.id)) ? Number(formData.id) : undefined,
        name: formData.name,
        role: formData.role,
        sub_role: formData.subRole || null,
        photo_url: formData.image,
        quote: formData.quote || null,
        bio: formData.bio || null,
        display_order: formData.order,
        is_patron: formData.role.toLowerCase().includes("patron") ? 1 : 0,
      };

      const res = await apiSaveManagementMember(savePayload);
      const savedId = res?.id ? String(res.id) : formData.id;
      const finalMember = { ...formData, id: savedId };

      let updated: ManagementMember[];
      if (editingMember) {
        updated = members.map((m) =>
          m.id === formData.id || m.name === formData.name ? finalMember : m
        );
        showToast(`Updated "${formData.name}" successfully.`);
      } else {
        updated = [...members, finalMember];
        showToast(`Added "${formData.name}" successfully.`);
      }

      setMembers(updated);
      localStorage.setItem("asps_management_members", JSON.stringify(updated));
      closeModal();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Delete ${name} from management?`)) {
      try {
        await apiDeleteManagementMember(id, name);
      } catch (err) {
        console.error("Deletion failed:", err);
      }

      const updated = members.filter((m) => m.id !== id && m.name !== name);
      setMembers(updated);
      localStorage.setItem("asps_management_members", JSON.stringify(updated));
      showToast(`Removed "${name}" successfully.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAFF] font-sans pb-16">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0879C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB000] text-xs font-serif font-bold flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── HERO HEADER SECTION MATCHING EXACT REFERENCE DESIGN ─── */}
      <section className="relative w-full overflow-hidden bg-white border-b border-[#D8EAF8] shadow-xs">
        
        {/* 1. Subtle School Building Image on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/infrastructure/infra-main.jpg"
              alt="All Saints Public School Campus Building"
              fill
              priority
              className="object-cover object-right-top opacity-35"
              sizes="(max-width: 768px) 55vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
          </div>
        </div>

        {/* 2. Soft Blue Wave Flowing Horizontally Across Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <svg
            className="absolute left-0 bottom-0 h-full w-[70%] sm:w-[60%] md:w-[50%] min-w-[320px] opacity-40"
            viewBox="0 0 600 240"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-20,240 C80,220 140,160 220,140 C310,118 390,165 480,130 C530,110 570,70 600,30 L600,240 Z"
              fill="url(#waveGradient1)"
            />
            <path
              d="M-20,240 C60,240 120,195 190,175 C270,152 350,190 430,160 C500,135 550,95 600,60 L600,240 Z"
              fill="url(#waveGradient2)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="40%" x2="100%" y2="60%">
                <stop offset="0%" stopColor="#0879C9" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EAF5FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="30%" x2="100%" y2="70%">
                <stop offset="0%" stopColor="#0756A5" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#0879C9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3. Header Foreground Content */}
        <div className="container-custom relative z-10 pt-6 sm:pt-8 pb-10 sm:pb-12 md:pb-14">
          
          {/* Breadcrumb Navigation: Home › About ASPS › Our Management */}
          <nav className="mb-6 sm:mb-8 text-xs sm:text-[13px] font-sans font-medium text-[#64748B] flex items-center gap-2">
            <Link href="/" className="hover:text-[#0879C9] transition-colors">
              Home
            </Link>
            <span className="text-[#64748B]">&rsaquo;</span>
            <span className="text-[#64748B]">About ASPS</span>
            <span className="text-[#64748B]">&rsaquo;</span>
            <span className="text-[#064A91] font-bold">Our Management</span>
          </nav>

          {/* Centered Rounded Blue Gradient Banner with Horizontal Decorative Lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 my-2 sm:my-3">
            
            <div
              className="hidden sm:block flex-1 h-[2.5px] max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[240px] bg-gradient-to-r from-transparent via-[#0879C9]/60 to-[#0879C9] rounded-l-full"
              aria-hidden="true"
            />

            {/* Pill Banner */}
            <div className="rounded-full bg-gradient-to-r from-[#0879C9] via-[#0756A5] to-[#0756A5] px-8 sm:px-12 md:px-16 lg:px-20 py-3 sm:py-3.5 md:py-4 shadow-lg shadow-[#0756A5]/25 border border-white/20 flex-shrink-0 transition-transform hover:scale-[1.01]">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-serif font-black uppercase tracking-wider text-white drop-shadow-sm select-none text-center">
                OUR MANAGEMENT
              </h1>
            </div>

            <div
              className="hidden sm:block flex-1 h-[2.5px] max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[240px] bg-gradient-to-r from-[#0879C9] via-[#0879C9]/60 to-transparent rounded-r-full"
              aria-hidden="true"
            />
          </div>

          {/* Welcome Heading matching reference image */}
          <div className="text-center mt-5 sm:mt-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-serif font-black uppercase tracking-wider text-[#064A91] leading-tight">
              WELCOME TO ALL SAINTS PUBLIC SCHOOL
            </h2>
            <div className="w-14 sm:w-16 h-1 sm:h-1.5 bg-[#FFB000] rounded-full mx-auto mt-2.5 sm:mt-3" />
          </div>

        </div>
      </section>

      {/* Main Content Area: Admin Bar + Leadership Profiles */}
      <div className="container-custom pt-8 sm:pt-10">
      {/* ─── Admin Management Toolbar (When Admin Active) ───────────────── */}
      {isAdmin && (
        <div className="bg-white border-t-4 border-t-[#0875C9] border-x border-b border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-lg border border-[#D8EAF8] shadow-2xs">
                👥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                    Management Board Editor
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Add, edit, or update leadership portraits, designations, and guiding quotes
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              {/* Only + Add Leader Button as requested */}
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-sans font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <span>+ Add Leader</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  clearAdminSession();
                  setIsAdmin(false);
                  showToast("Exited admin mode.");
                }}
                className="inline-flex items-center justify-center text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap"
                title="Logout Administrator"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Heading Matching Live Site ────────────────────────────── */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#092F78] tracking-wide uppercase">
          WELCOME TO ALL SAINTS PUBLIC SCHOOL
        </h2>
        <div className="w-16 h-1 bg-[#FFB900] rounded-full mx-auto mt-3" />
      </div>

      {/* ─── Management Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white border-2 border-slate-200 hover:border-[#0875C9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all text-center group flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Member Portrait */}
              <div className="relative w-48 sm:w-56 md:w-60 h-64 sm:h-76 md:h-84 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-[#0875C9]/20 group-hover:border-[#0875C9] mb-5 bg-slate-100 transition-all">
                <Image
                  src={failedImages[member.id] ? "/images/management/principal.jpg" : (member.image || "/images/management/principal.jpg")}
                  alt={member.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 240px, 280px"
                  unoptimized
                  onError={() => setFailedImages((prev) => ({ ...prev, [member.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {member.subRole && (
                  <span className="absolute bottom-2.5 inset-x-0 text-center text-white text-[11px] font-serif font-semibold drop-shadow">
                    {member.subRole}
                  </span>
                )}
              </div>

              {/* Designation Badge */}
              <span className="inline-block text-xs font-serif font-bold text-[#0875C9] bg-[#EAF6FF] border border-[#D8EAF8] px-4 py-1 rounded-full uppercase tracking-wide mb-2">
                {member.role}
              </span>

              {/* Name */}
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#092F78] mb-1 leading-snug">
                {member.name}
              </h3>

              {/* Sub-Role */}
              {member.subRole && (
                <p className="text-xs font-semibold text-[#FFB900] mb-3">
                  {member.subRole}
                </p>
              )}

              {/* Quote */}
              {member.quote && (
                <div className="border-l-2 border-[#0875C9] pl-3 italic text-xs text-slate-600 my-3 bg-[#EAF6FF]/60 py-2 rounded-r-lg text-left">
                  &ldquo;{member.quote}&rdquo;
                </div>
              )}
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                <span className="text-[10px] text-slate-400 font-mono">Order: #{member.order}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    className="text-xs bg-[#EAF6FF] text-[#0875C9] hover:bg-[#0875C9] hover:text-white px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Description Paragraph */}
      <div className="bg-white border border-[#D8EAF8] rounded-3xl p-6 sm:p-10 shadow-xs my-10 max-w-4xl mx-auto">
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans">
          All Saints Public School, Adoor was founded by Rev. Fr. Thomas Kumbakattil in June 2002, with the blessings of His Beatitude Moran Mor Cyril Baselios Catholicose, the late Archbishop of Trivandrum. At present, the school is managed by The Malankara Catholic Educational Society of the Diocese of Pathanamthitta headed by His Grace Most Rev Dr. Samuel Mar Irenios the Bishop of Pathanamthitta Diocese as its President and Patron. The school is affiliated to the Central Board of Secondary Education [CBSE] New Delhi. Classes from LKG to XII are offered here.
        </p>
      </div>

      {/* ─── ADD / EDIT MODAL ───────────────────────────────────────────── */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {editingMember ? "Edit Management Leader" : "Add Management Leader"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Full Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Most Rev. Dr. Samuel Mar Irenios"
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
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Patron & President"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Diocese / Sub-Role
                  </label>
                  <input
                    type="text"
                    value={formData.subRole || ""}
                    onChange={(e) => setFormData({ ...formData, subRole: e.target.value })}
                    placeholder="e.g. Bishop of Pathanamthitta"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>

              {/* Photo Input: Dual Upload vs URL */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Portrait Photograph *
                </label>
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("upload")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      imageInputMode === "upload"
                        ? "bg-[#0875C9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      imageInputMode === "url"
                        ? "bg-[#0875C9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🔗 Image URL / Path
                  </button>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#0875C9] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#EAF6FF]/50 transition-colors p-2">
                      <span className="text-xs text-slate-600 font-medium text-center">
                        {uploadFileName ? uploadFileName : "Click to select a photo from your computer"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP (Max 8MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    {uploadError && <p className="text-xs text-rose-600 mt-1">{uploadError}</p>}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/management/principal.jpg or https://..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                )}

                {/* Preview */}
                {formData.image && (
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        <Image src={formData.image} alt="Preview" fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">Photo ready to display</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image: "" }));
                        setUploadFileName("");
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors font-semibold"
                    >
                      Clear Photo
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Patron Quote / Guiding Message
                </label>
                <textarea
                  rows={2}
                  value={formData.quote || ""}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Official message or guiding quotation..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Guiding Bio / Profile Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Official responsibilities, pastoral leadership, or achievements..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
