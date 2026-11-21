"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EditableNews,
  DEFAULT_NEWS,
  getStoredNews,
  saveStoredNews,
  isAdminAuthenticated,
  recordAdminLogin,
} from "@/utils/adminStorage";
import { apiLogin, apiGetNews, apiSaveNews, apiDeleteNews } from "@/utils/apiService";

function parseDateParts(dateStr: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  try {
    if (!dateStr) return { day: "01", month: "Jan" };
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const m = parseInt(parts[1], 10) - 1;
        const d = parts[2].split("T")[0];
        return { day: d.padStart(2, "0"), month: months[m] || "Jan" };
      }
      const d = parts[0];
      const m = parseInt(parts[1], 10) - 1;
      return { day: d.padStart(2, "0"), month: months[m] || "Jan" };
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return {
        day: String(d.getDate()).padStart(2, "0"),
        month: months[d.getMonth()] || "Jan",
      };
    }
  } catch {}
  return { day: "01", month: "Jan" };
}

export default function HomeHighlightsSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [newsList, setNewsList] = useState<EditableNews[]>(DEFAULT_NEWS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableNews | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<EditableNews>({
    id: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    category: "Official Notice",
    excerpt: "",
    image: "",
    isFeatured: false,
    published: true,
  });

  // Admin Login Dialog State (if unauthenticated admin clicks edit)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(isAdminAuthenticated());
    };
    checkAdmin();

    const loadNews = async () => {
      const stored = getStoredNews();
      if (stored && stored.length > 0) {
        setNewsList(stored);
      }
      try {
        const live = await apiGetNews();
        if (live && Array.isArray(live) && live.length > 0) {
          const mapped: EditableNews[] = live.map((n: any) => ({
            id: String(n.id),
            title: n.title,
            date: n.publish_date ? String(n.publish_date).split("T")[0] : new Date().toISOString().split("T")[0],
            category: n.category,
            excerpt: n.excerpt || "",
            image: n.image_url || "",
            videoUrl: n.video_url || "",
            isFeatured: Boolean(n.is_featured),
            published: n.is_published !== 0 && n.is_published !== false,
          }));
          setNewsList(mapped);
          saveStoredNews(mapped);
        }
      } catch {}
      if (false) {
      }
    };
    loadNews();

    if (typeof window !== "undefined") {
      window.addEventListener("school-news-updated", loadNews);
      window.addEventListener("storage", checkAdmin);
      return () => {
        window.removeEventListener("school-news-updated", loadNews);
        window.removeEventListener("storage", checkAdmin);
      };
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = () => {
    if (isAdminAuthenticated()) {
      setIsAdmin(true);
      if (newsList.length > 0) {
        openEdit(newsList[0]);
      } else {
        openAdd();
      }
      setShowEditModal(true);
    } else {
      setAuthUsername("");
      setAuthPassword("");
      setAuthError("");
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await apiLogin(authUsername, authPassword);
      if (res.success) {
        recordAdminLogin(authUsername);
        setIsAdmin(true);
        setShowAuthModal(false);
        if (newsList.length > 0) {
          openEdit(newsList[0]);
        } else {
          openAdd();
        }
        setShowEditModal(true);
        showToast("🔓 Administrator verified. You can now edit news directly!");
      } else {
        setAuthError(res.message || "Invalid credentials. Please enter admin credentials.");
      }
    } catch {
      setAuthError("Authentication failed. Please verify credentials.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setImageInputMode("upload");
    setUploadFileName("");
    setUploadError("");
    setFormData({
      id: `news-${Date.now()}`,
      title: "",
      date: new Date().toISOString().split("T")[0],
      category: "Official Notice",
      excerpt: "",
      image: "",
      isFeatured: false,
      published: true,
    });
  };

  const openEdit = (item: EditableNews) => {
    setEditingItem(item);
    setImageInputMode(item.image?.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setUploadError("");
    setFormData({ ...item });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose a valid image file (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setUploadFileName(file.name);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminAuthenticated()) {
      showToast("🔒 Unauthorized: Admin login required to save news.");
      setShowEditModal(false);
  
      return;
    }
    if (!formData.title.trim()) return;

    setIsSaving(true);
    let updated: EditableNews[];
    try {
      const isEdit = Boolean(editingItem);
      const isNumericId = isEdit && editingItem?.id && !isNaN(Number(editingItem.id)) && !String(editingItem.id).startsWith("news-");
      let cleanDate = formData.date || new Date().toISOString().split("T")[0];
      if (cleanDate.includes("T")) cleanDate = cleanDate.split("T")[0];
      const dateParts = cleanDate.split("-");
      if (dateParts.length === 3 && dateParts[0].length <= 2 && dateParts[2].length === 4) {
        cleanDate = `${dateParts[2]}-${dateParts[1].padStart(2, "0")}-${dateParts[0].padStart(2, "0")}`;
      }
      const savePayload: any = {
        title: formData.title.trim(),
        category: formData.category || "Official Notice",
        publish_date: cleanDate,
        excerpt: formData.excerpt || "",
        content: formData.excerpt || null,
        image_url: formData.image || null,
        video_url: formData.videoUrl || null,
        circular_pdf_url: null,
        is_featured: formData.isFeatured ? 1 : 0,
        is_published: formData.published !== false ? 1 : 0,
      };
      if (isNumericId) {
        savePayload.id = Number(editingItem!.id);
      }
      const res = await apiSaveNews(savePayload);
      const finalId = (res && res.status === "success" && res.id) ? String(res.id) : (formData.id || `news-${Date.now()}`);
      const savedItem: EditableNews = { ...formData, id: finalId, date: cleanDate };

    if (editingItem) {
      updated = newsList.map((item) => (item.id === formData.id ? savedItem : item));
    } else {
      updated = [savedItem, ...newsList];
    }

    setNewsList(updated);
    saveStoredNews(updated);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("school-news-updated"));
    }

    setIsSaving(false);

      if (res && res.status === "success") {
        setShowEditModal(false);
        showToast("✅ News bulletin successfully saved to database!");
      } else {
        showToast(`⚠️ Database error: ${res?.message || "Saved locally, could not sync to MySQL"}`);
      }
    } catch (err: any) {
      showToast(`⚠️ Connection error: ${err?.message || "Could not reach backend"}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!isAdminAuthenticated()) {
      showToast("🔒 Unauthorized: Admin login required to delete news.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      if (!isNaN(Number(id)) && !String(id).startsWith("news-")) {
        try {
          await apiDeleteNews(Number(id));
        } catch {}
      }
      const updated = newsList.filter((item) => item.id !== id);
      setNewsList(updated);
      saveStoredNews(updated);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("school-news-updated"));
      }
      if (formData.id === id) {
        if (updated.length > 0) {
          openEdit(updated[0]);
        } else {
          openAdd();
        }
      }
      showToast("🗑️ News item deleted.");
    }
  };

  const displayItems = newsList.filter((n) => n.published !== false).slice(0, 2);

  return (
    <section className="py-8 sm:py-12 bg-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#092F78] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB900] flex items-center gap-3 animate-fade-in font-serif text-sm">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container-custom">
        {/* Balanced 3-Column Grid matching the mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* ─── Column 1: About Our School ──────────────────────────────── */}
          <div className="bg-[#F4FAFF] border border-[#D8EAF8] rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Yellow Bar + Title */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-1.5 h-6 bg-[#FFB900] rounded-full flex-shrink-0" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#092F78] tracking-tight">
                  About Our School
                </h2>
              </div>

              {/* Description */}
              <p className="text-slate-700 text-xs sm:text-sm font-sans leading-relaxed mb-4">
                All Saints Public School, Adoor, is committed to provide quality education and holistic development to every child. Established in June 2002 under The Malankara Catholic Educational Society of the Diocese of Pathanamthitta.
              </p>

              {/* Student Study Photo from real school assets */}
              <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden shadow-inner mb-4 border border-[#D8EAF8]">
                <Image
                  src="/images/gallery/academics-study.jpg"
                  alt="Students engaged in learning at All Saints Public School"
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-white text-[11px] font-sans font-semibold drop-shadow">
                  Empowering Young Minds · LKG to Class XII
                </span>
              </div>
            </div>

            {/* Know More Button */}
            {/* <div className="pt-2">
              <Link
                href="/about/history"
                className="inline-flex items-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all font-serif"
              >
                <span>Know More</span>
                <span>&rarr;</span>
              </Link>
            </div> */}
          </div>

          {/* ─── Column 2: Latest News (Blue Accent Card) ───────────── */}
          <div className="bg-[#0875C9] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow relative">
            <div>
              {/* Header: Calendar Icon + Title + Edit News (Admin Only) + View All */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/20 mb-4 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📅</span>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight">
                    Latest News
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Home Page News Edit Button (Visible ONLY to authenticated administrators) */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="inline-flex items-center gap-1.5 bg-[#FFB900] hover:bg-[#E0A300] text-slate-950 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-xs transition-all hover:scale-105 cursor-pointer select-none"
                      title="Edit news on home page (Administrator Mode)"
                    >
                      <span>✏️ Edit News</span>
                    </button>
                  )}

                  <Link
                    href="/news"
                    className="text-xs font-semibold text-[#BFE3FF] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Dynamic News Items from Live Store */}
              {displayItems.length > 0 ? (
                displayItems.map((item, idx) => {
                  const dateParts = parseDateParts(item.date);
                  return (
                    <div
                      key={item.id || idx}
                      className={`flex items-start gap-3.5 mb-4 group ${
                        idx === 0 ? "pb-4 border-b border-white/10" : ""
                      }`}
                    >
                      {/* Date Badge */}
                      <div className="bg-white text-[#0875C9] rounded-xl px-2.5 py-1.5 text-center flex-shrink-0 shadow-xs">
                        <span className="block text-base font-serif font-black leading-none">
                          {dateParts.day}
                        </span>
                        <span className="block text-[10px] uppercase font-bold tracking-wider">
                          {dateParts.month}
                        </span>
                      </div>

                      {/* Content & Inline Edit controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href="/news"
                            className="text-xs sm:text-sm font-medium leading-snug group-hover:text-[#BFE3FF] transition-colors line-clamp-2 block"
                          >
                            {item.title}
                          </Link>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                openEdit(item);
                                setShowEditModal(true);
                              }}
                              className="text-[#FFB900] hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
                              title="Edit this news bulletin"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                        <span className="text-[11px] text-white/70 block mt-1">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-white/70 italic py-4">
                  No announcements currently posted.
                </p>
              )}
            </div>

            {/* Bottom Quick Badge */}
            <div className="pt-3 border-t border-white/15 text-[11px] text-[#BFE3FF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span>Stay updated with ASPS Daily Bulletins</span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    openAdd();
                    setShowEditModal(true);
                  }}
                  className="text-[#FFB900] hover:text-white text-xs font-bold underline cursor-pointer"
                >
                  + Add New
                </button>
              )}
            </div>
          </div>

          {/* ─── Column 3: Our Gallery ───────────────────────────────────── */}
          <div className="bg-white border border-[#D8EAF8] rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <div>
              {/* Header: Gallery Icon + Title + View All */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📸</span>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[#092F78] tracking-tight">
                    Our Gallery
                  </h2>
                </div>
                <Link
                  href="/gallery"
                  className="text-xs font-semibold text-[#0875C9] hover:text-[#0066B5] flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {/* 3 Preview Photos Side-by-Side Matching Reference Mockup */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <Link
                  href="/gallery"
                  className="relative h-24 sm:h-28 rounded-xl overflow-hidden shadow-xs hover:opacity-90 group block border border-slate-100"
                >
                  <Image
                    src="/images/gallery/event-1.jpg"
                    alt="School Event & Sports"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 30vw, 10vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </Link>

                <Link
                  href="/gallery"
                  className="relative h-24 sm:h-28 rounded-xl overflow-hidden shadow-xs hover:opacity-90 group block border border-slate-100"
                >
                  <Image
                    src="/images/infrastructure/infra-main.jpg"
                    alt="School Building & Campus"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 30vw, 10vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </Link>

                <Link
                  href="/gallery"
                  className="relative h-24 sm:h-28 rounded-xl overflow-hidden shadow-xs hover:opacity-90 group block border border-slate-100"
                >
                  <Image
                    src="/images/gallery/event-2.jpg"
                    alt="Student Assembly"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 30vw, 10vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </Link>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-3">
                Explore life at All Saints through our collection of campus moments, cultural celebrations, academic milestones, and athletic achievements.
              </p>
            </div>

            {/* Bottom Gallery Count Tag */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
              <span>39+ Official Videos</span>
              <span className="text-[#0875C9] font-semibold">100+ Campus Photos</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── MODAL 1: Home Page News Editor Modal ──────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-serif font-black text-xl text-[#092F78]">
                  {editingItem ? "Edit News Bulletin" : "Create New Announcement"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update content displayed in the Home Page Latest News &amp; Ticker
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* News Item Quick Select Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-100 scrollbar-thin">
              <button
                type="button"
                onClick={openAdd}
                className={`text-xs px-3 py-1.5 rounded-full font-serif font-bold whitespace-nowrap transition-all cursor-pointer ${
                  !editingItem
                    ? "bg-[#0875C9] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                + Add New Bulletin
              </button>
              {newsList.map((item, idx) => (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => openEdit(item)}
                  className={`text-xs px-3 py-1.5 rounded-full font-serif font-medium whitespace-nowrap max-w-[180px] truncate transition-all cursor-pointer ${
                    editingItem?.id === item.id
                      ? "bg-[#0875C9] text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title={item.title}
                >
                  {item.title}
                </button>
              ))}
            </div>

            {/* Editing Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Sports Day 2026 – Grand Success"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as EditableNews["category"],
                      })
                    }
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:border-[#0875C9] outline-none bg-white"
                  >
                    <option value="Official Notice">Official Notice</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Board Result">Board Result</option>
                    <option value="Campus Event">Campus Event</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Announcement Details / Excerpt *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Full bulletin text to display on the school website..."
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              {/* Photo Input: Dual Upload vs URL */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Notice Poster / Image (Optional)
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
                    📁 Upload Image
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
                    🔗 Image URL
                  </button>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#0875C9] rounded-xl p-3 cursor-pointer transition-colors bg-slate-50/50">
                      <span className="text-xs text-slate-600 font-medium">
                        {uploadFileName ? `Selected: ${uploadFileName}` : "Click to browse image file"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadError && (
                      <p className="text-[11px] text-rose-600 mt-1">{uploadError}</p>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/gallery/event-1.jpg or https://..."
                    className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-[#0875C9] w-4 h-4 rounded"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#0875C9] w-4 h-4 rounded"
                  />
                  <span>Mark as Featured Notice</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(formData.id, formData.title)}
                    className="text-xs text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors font-bold cursor-pointer"
                  >
                    🗑️ Delete Bulletin
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold px-4 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-serif font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Administrator Sign In Modal (Quick Inline Auth) ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-serif font-black text-xl text-[#092F78]">
                  Administrator Sign In
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in with admin credentials to edit news directly on the home page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl mb-4 font-sans">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="admin@allsaintspublicschool.com"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-serif font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? "Verifying..." : "Sign In & Edit News"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
