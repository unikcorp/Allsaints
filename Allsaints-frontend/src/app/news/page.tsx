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
  clearAdminSession,
} from "@/utils/adminStorage";
import {
  apiGetNews,
  apiSaveNews,
  apiDeleteNews,
  apiUploadFile,
} from "@/utils/apiService";

export default function NewsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [newsList, setNewsList] = useState<EditableNews[]>(DEFAULT_NEWS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableNews | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

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

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setNewsList(getStoredNews());

    // Fetch live news from server database
    apiGetNews().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: EditableNews[] = data.map((n: any) => ({
          id: String(n.id),
          title: n.title,
          date: n.publish_date
            ? new Date(n.publish_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          category: n.category || "Official Notice",
          excerpt: n.excerpt || n.content || "",
          image: n.image_url || "",
          isFeatured: Boolean(n.is_featured),
          published: Boolean(n.is_published),
        }));
        setNewsList(mapped);
        saveStoredNews(mapped);
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
      setUploadError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("File size exceeds 8MB.");
      return;
    }

    setUploadError("");
    setUploadFileName(file.name);

    try {
      const uploadRes = await apiUploadFile(file);
      if (uploadRes.success && uploadRes.url) {
        setFormData((prev) => ({ ...prev, image: uploadRes.url }));
        return;
      }
    } catch {}

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    if (!isAdmin) return;
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
    setShowModal(true);
  };

  const openEdit = (item: EditableNews) => {
    if (!isAdmin) return;
    setEditingItem(item);
    setImageInputMode(item.image?.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setUploadError("");
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      alert("Title and description are required.");
      return;
    }

    try {
      const isExisting = editingItem && !String(formData.id).startsWith("news-") && !isNaN(Number(formData.id));
      const savePayload = {
        id: isExisting ? Number(formData.id) : undefined,
        title: formData.title.trim(),
        category: formData.category,
        publish_date: formData.date || new Date().toISOString().split("T")[0],
        excerpt: formData.excerpt.trim(),
        content: formData.excerpt.trim(),
        image_url: formData.image || null,
        is_featured: formData.isFeatured ? 1 : 0,
        is_published: formData.published !== false ? 1 : 0,
      };

      const res = await apiSaveNews(savePayload);
      const savedId = res?.id ? String(res.id) : formData.id;
      const finalItem: EditableNews = { ...formData, id: savedId };

      let updated: EditableNews[];
      if (editingItem) {
        updated = newsList.map((n) => (n.id === formData.id ? finalItem : n));
        showToast(`Updated "${formData.title}".`);
      } else {
        updated = [finalItem, ...newsList];
        showToast(`Published "${formData.title}".`);
      }

      setNewsList(updated);
      saveStoredNews(updated);
      setShowModal(false);
    } catch (err: any) {
      alert(`Error saving news: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Delete news item: "${title}"?`)) {
      try {
        await apiDeleteNews(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
      const updated = newsList.filter((n) => n.id !== id);
      setNewsList(updated);
      saveStoredNews(updated);
      showToast(`Removed news bulletin.`);
    }
  };

  const handleReset = () => {
    if (!isAdmin) return;
    if (window.confirm("Restore official school news to defaults?")) {
      setNewsList(DEFAULT_NEWS);
      saveStoredNews(DEFAULT_NEWS);
      showToast("Restored official news defaults.");
    }
  };

  const featuredNotice = newsList.find((n) => n.isFeatured) || newsList[0];
  const regularNotices = newsList.filter((n) => n.id !== featuredNotice?.id);

  return (
    <div className="min-h-screen bg-[#F4FAFF] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB900] text-xs font-serif font-bold flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Top Header Banner */}
        <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            SCHOOL NEWS &amp; UPDATES
          </h1>
        </div>

        {/* Admin News Toolbar */}
        {isAdmin && (
          <div className="bg-white border-t-4 border-t-[#0875C9] border-x border-b border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-md mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-lg border border-[#D8EAF8] shadow-2xs">
                  📰
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                      News &amp; Gazette Editor
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Admin Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Publish, edit, or upload newspaper clippings, academic announcements, and featured bulletins
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={openAdd}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-sans font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>+ Add News Item</span>
                </button>

                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap"
                >
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-2 rounded-xl text-xs font-sans font-medium transition-all"
                  title="Restore default news"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => {
                    clearAdminSession();
                    setIsAdmin(false);
                    showToast("Exited admin mode.");
                  }}
                  className="inline-flex items-center justify-center text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Featured News Bulletin Showcase (Large & High-Resolution) */}
        {featuredNotice && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#D8EAF8] mb-10">
            <div className="bg-gradient-to-r from-[#0875C9] to-[#0066B5] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB900] animate-pulse"></span>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">
                  {featuredNotice.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FFB900] font-sans font-semibold uppercase tracking-wider">
                  {featuredNotice.category}
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openEdit(featuredNotice)}
                    className="bg-white/20 hover:bg-white text-white hover:text-[#0875C9] px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-slate-900/5">
              <div className="relative w-full max-w-3xl mx-auto h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden bg-white shadow-inner border border-[#D8EAF8]">
                <Image
                  src={featuredNotice.image}
                  alt={featuredNotice.title}
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                  sizes="(max-width: 1200px) 100vw, 1100px"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 font-sans">
              <p className="text-slate-700 text-sm font-medium leading-relaxed max-w-2xl">
                {featuredNotice.excerpt}
              </p>
              <span className="text-[#0875C9] font-bold whitespace-nowrap">
                Date: {featuredNotice.date}
              </span>
            </div>
          </div>
        )}

        {/* Latest Event Video Coverage */}
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl mb-12">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-black">
            <iframe
              src="https://www.youtube.com/embed/vT_xSQhUhMc"
              title="Latest Event Coverage"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-none"
            />
          </div>
          <p className="text-center text-white font-medium text-sm sm:text-base mt-3">
            Official School Event &amp; Achievement Video Coverage
          </p>
        </div>

        {/* Regular News Items Grid */}
        <div className="space-y-6 mb-12">
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78] mb-4">
            Recent Announcements &amp; Press Bulletins
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white border-2 border-slate-200 hover:border-[#0875C9] rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] text-[10px] font-serif font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{notice.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#092F78] mb-2 leading-snug">
                    {notice.title}
                  </h3>

                  {notice.image && (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                      <Image
                        src={notice.image}
                        alt={notice.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3 mb-4">
                    {notice.excerpt}
                  </p>
                </div>

                {isAdmin && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(notice)}
                      className="text-xs bg-[#EAF6FF] text-[#0875C9] hover:bg-[#0875C9] hover:text-white px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(notice.id, notice.title)}
                      className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── ADD / EDIT MODAL ───────────────────────────────────────────── */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {editingItem ? "Edit News Bulletin" : "Publish News Bulletin"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. CBSE Class X &amp; XII Examination Results"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
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
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#0875C9] outline-none bg-white"
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
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Full Announcement Text / Excerpt *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Official notice details..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                />
              </div>

              {/* Photo Input: Dual Upload vs URL */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Notice Poster / Image
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
                    📁 Upload Poster
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
                        {uploadFileName ? uploadFileName : "Select news poster image"}
                      </span>
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
                    placeholder="/images/school_content/..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#0875C9]"
                />
                <label htmlFor="featuredCheck" className="text-xs font-serif font-bold text-slate-700">
                  Feature as Top News Bulletin on Homepage &amp; News Showcase
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
