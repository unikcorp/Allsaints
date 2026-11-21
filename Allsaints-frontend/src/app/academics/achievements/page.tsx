"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiGetAchievements, apiSaveAchievement, apiDeleteAchievement, apiUploadFile } from "@/utils/apiService";
import { isAdminAuthenticated } from "@/utils/adminStorage";

interface AchievementDoc {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: "Class XII" | "Class X";
}

interface AchievementBanner {
  id: string;
  year: string;
  title: string;
  image: string;
}

interface AchievementVideo {
  id: string;
  title: string;
  embedUrl: string;
}

const DEFAULT_VIDEOS: AchievementVideo[] = [
  {
    id: "vid-1",
    title: "Official School Achievements Showcase",
    embedUrl: "https://youtube.com/embed/KcxiKU8D-O0",
  },
  {
    id: "vid-2",
    title: "School Celebrations & Felicitation Ceremony",
    embedUrl: "https://youtube.com/embed/N-Mzhv2wkKQ",
  },
];

const DEFAULT_DOCS: AchievementDoc[] = [
  {
    id: "doc-1",
    title: "Class XII Result 2026 & Top Scorers",
    url: "/images/school_content/1779345475-8217333446a0ea843eda53_WhatsApp_Image_2026-05-20_at_10.03.38_AM.jpeg",
    icon: "📄",
    category: "Class XII",
  },
  {
    id: "doc-2",
    title: "Class X Result 2026",
    url: "/documents/class-x-results-2026.pdf",
    icon: "📄",
    category: "Class X",
  },
  {
    id: "doc-3",
    title: "95% & Above Scorers",
    url: "/documents/class-x-95-percent-above-2026.pdf",
    icon: "⭐",
    category: "Class X",
  },
  {
    id: "doc-4",
    title: "Top Scorers Photo Gallery",
    url: "/images/school_content/1779345475-11907247006a0ea843e6b94_WhatsApp_Image_2026-05-20_at_2.55.15_PM.jpeg",
    icon: "👥",
    category: "Class X",
  },
  {
    id: "doc-5",
    title: "Additional A1 Scorers after revaluation",
    url: "/images/school_content/revaluation-a1-toppers.png",
    icon: "🎖️",
    category: "Class X",
  },
];

const DEFAULT_BANNERS: AchievementBanner[] = [
  {
    id: "ban-24-25",
    year: "CBSE RESULTS 2024-'25",
    title: "CBSE Results 2024-25 Banner",
    image: "/images/school_content/1776664121-107660410969e5be39d2dbe_download.png",
  },
  {
    id: "ban-23-24-1",
    year: "CBSE RESULTS 2023-'24",
    title: "CBSE Results 2023-24 Part 1",
    image: "/images/school_content/1773902565-36124708869bb9ae5a881c_achievement.jpg",
  },
  {
    id: "ban-23-24-2",
    year: "CBSE RESULTS 2023-'24",
    title: "CBSE Results 2023-24 Part 2",
    image: "/images/school_content/1773902565-13558566869bb9ae5a6a4d_achievement2.jpg",
  },
  {
    id: "ban-22-23-1",
    year: "CBSE RESULTS 2022-'23",
    title: "CBSE Results 2022-23 Part 1",
    image: "/images/school_content/1773902565-188121148969bb9ae57be22_achievement4.jpg",
  },
  {
    id: "ban-22-23-2",
    year: "CBSE RESULTS 2022-'23",
    title: "CBSE Results 2022-23 Part 2",
    image: "/images/school_content/1773902565-135630432869bb9ae589bca_achievement3.png",
  },
];

export default function AchievementsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [videos, setVideos] = useState<AchievementVideo[]>(DEFAULT_VIDEOS);
  const [docs, setDocs] = useState<AchievementDoc[]>(DEFAULT_DOCS);
  const [banners, setBanners] = useState<AchievementBanner[]>(DEFAULT_BANNERS);

  // Modal state
  const [modalType, setModalType] = useState<"doc" | "banner" | null>(null);
  const [editingDoc, setEditingDoc] = useState<AchievementDoc | null>(null);
  const [editingBanner, setEditingBanner] = useState<AchievementBanner | null>(null);

  const [docForm, setDocForm] = useState<AchievementDoc>({
    id: "",
    title: "",
    url: "",
    icon: "📄",
    category: "Class XII",
  });

  const [bannerForm, setBannerForm] = useState<AchievementBanner>({
    id: "",
    year: "CBSE RESULTS 2025-'26",
    title: "",
    image: "",
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const savedDocs = localStorage.getItem("asps_achievements_docs");
    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed) && parsed.length > 0) setDocs(parsed);
      } catch {}
    }

    const savedBanners = localStorage.getItem("asps_achievements_banners");
    if (savedBanners) {
      try {
        const parsed = JSON.parse(savedBanners);
        // Validate each banner in localStorage has a valid non-empty image path
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((b: any) => b && typeof b.image === "string" && b.image.trim().length > 0)) {
          setBanners(parsed);
        } else {
          // Reset corrupted or missing images back to official DEFAULT_BANNERS
          setBanners(DEFAULT_BANNERS);
          localStorage.setItem("asps_achievements_banners", JSON.stringify(DEFAULT_BANNERS));
        }
      } catch {
        setBanners(DEFAULT_BANNERS);
      }
    } else {
      localStorage.setItem("asps_achievements_banners", JSON.stringify(DEFAULT_BANNERS));
    }

    // Fetch live from MySQL database only if records contain valid image URLs
    apiGetAchievements().then((dbList) => {
      if (dbList && Array.isArray(dbList) && dbList.length > 0) {
        const validDbBanners: AchievementBanner[] = dbList
          .filter((item: any) => item && (item.image_url || item.photo_url || item.image))
          .map((item: any) => ({
            id: String(item.id),
            year: item.year_heading || item.category || "CBSE RESULTS 2025-'26",
            title: item.title,
            image: item.image_url || item.photo_url || item.image,
          }));

        if (validDbBanners.length > 0) {
          setBanners((prev) => {
            const current = Array.isArray(prev) && prev.length > 0 ? prev : DEFAULT_BANNERS;
            const updated = [...current];
            for (const vb of validDbBanners) {
              const idx = updated.findIndex((b) => b.id === vb.id);
              if (idx !== -1) updated[idx] = vb;
              else updated.unshift(vb);
            }
            localStorage.setItem("asps_achievements_banners", JSON.stringify(updated));
            return updated;
          });
        }
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAddDoc = (category: "Class XII" | "Class X") => {
    setEditingDoc(null);
    setDocForm({
      id: `doc-${Date.now()}`,
      title: "",
      url: "",
      icon: "📄",
      category,
    });
    setModalType("doc");
  };

  const openEditDoc = (doc: AchievementDoc) => {
    setEditingDoc(doc);
    setDocForm({ ...doc });
    setModalType("doc");
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: AchievementDoc[];
    if (editingDoc) {
      updated = docs.map((d) => (d.id === docForm.id ? docForm : d));
      showToast(`Updated "${docForm.title}".`);
    } else {
      updated = [...docs, docForm];
      showToast(`Added "${docForm.title}".`);
    }
    setDocs(updated);
    localStorage.setItem("asps_achievements_docs", JSON.stringify(updated));
    setModalType(null);
  };

  const handleDeleteDoc = (id: string, title: string) => {
    if (window.confirm(`Delete document "${title}"?`)) {
      const updated = docs.filter((d) => d.id !== id);
      setDocs(updated);
      localStorage.setItem("asps_achievements_docs", JSON.stringify(updated));
      showToast(`Deleted "${title}".`);
    }
  };

  const openAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      id: `ban-${Date.now()}`,
      year: "CBSE RESULTS 2025-'26",
      title: "",
      image: "",
    });
    setModalType("banner");
  };

  const openEditBanner = (b: AchievementBanner) => {
    setEditingBanner(b);
    setBannerForm({ ...b });
    setModalType("banner");
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: AchievementBanner[];
    if (editingBanner) {
      updated = banners.map((b) => (b.id === bannerForm.id ? bannerForm : b));
      showToast(`Updated "${bannerForm.title}".`);
    } else {
      updated = [bannerForm, ...banners];
      showToast(`Added "${bannerForm.title}".`);
    }
    setBanners(updated);
    localStorage.setItem("asps_achievements_banners", JSON.stringify(updated));
    setModalType(null);
  };

  const handleDeleteBanner = (id: string, title: string) => {
    if (window.confirm(`Delete achievement banner "${title}"?`)) {
      const updated = banners.filter((b) => b.id !== id);
      setBanners(updated);
      localStorage.setItem("asps_achievements_banners", JSON.stringify(updated));
      showToast(`Deleted banner.`);
    }
  };

  const handleResetBanners = () => {
    if (window.confirm("Restore official school CBSE result banners?")) {
      setBanners(DEFAULT_BANNERS);
      localStorage.setItem("asps_achievements_banners", JSON.stringify(DEFAULT_BANNERS));
      showToast("Restored official CBSE result banners.");
    }
  };

  // Group banners by year safely (ensure default banners always display)
  const validBanners = banners.filter((b) => b && typeof b.image === "string" && b.image.trim().length > 0);
  const activeBanners = validBanners.length > 0 ? validBanners : DEFAULT_BANNERS;
  const years = Array.from(new Set(activeBanners.map((b) => b.year)));

  return (
    <div className="min-h-screen bg-[#F4FAFF] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FFB900]">
            <span className="text-[#FFB900] text-lg">✓</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Admin Bar */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-[#EAF6FF] border border-[#D8EAF8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-serif font-black text-sm text-[#092F78] flex items-center gap-2">
                  <span>Achievements Board Editor</span>
                  <span className="text-[10px] bg-[#22B573] text-white font-sans px-2 py-0.5 rounded-full uppercase">
                    Admin Active
                  </span>
                </h3>
                <p className="text-xs text-slate-600">
                  Add, update or remove result documents and achievement showcase banners.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openAddBanner}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                + Add Result Banner
              </button>
              <button
                onClick={handleResetBanners}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                ↺ Restore Defaults
              </button>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0875C9] transition-colors">
            Home
          </Link>
          <span>&rsaquo;</span>
          <span className="text-slate-400">Academics</span>
          <span>&rsaquo;</span>
          <span className="text-[#092F78] font-bold">Achievements</span>
        </nav>

        {/* Top Header Banner in Primary Blue */}
        <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            LATEST ACHIEVEMENTS 2025-&apos;26
          </h1>
        </div>

        {/* ─── 1. YouTube Video Embeds from Live Site ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white rounded-2xl p-3 shadow-md border border-[#D8EAF8] overflow-hidden">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={vid.embedUrl}
                  title={vid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-none"
                />
              </div>
              <p className="text-center text-xs font-serif font-bold text-[#092F78] mt-3">
                {vid.title}
              </p>
            </div>
          ))}
        </div>

        {/* ─── 2. Official Result Documents (Class XII - 2026) ─── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8] mb-8 text-center relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#092F78] flex-1 text-center">
              Official Result Documents (Class XII - 2026)
            </h3>
            {isAdmin && (
              <button
                onClick={() => openAddDoc("Class XII")}
                className="text-xs bg-[#0875C9] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#0066B5]"
              >
                + Add Doc
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {docs
              .filter((d) => d.category === "Class XII")
              .map((d) => (
                <div key={d.id} className="relative group inline-flex items-center">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
                  >
                    <span>{d.icon}</span> {d.title}
                  </a>
                  {isAdmin && (
                    <div className="ml-2 flex items-center gap-1">
                      <button
                        onClick={() => openEditDoc(d)}
                        className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(d.id, d.title)}
                        className="text-[11px] bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* ─── 3. Official Result Documents (Class X - 2026) ─── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8] mb-12 text-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#092F78] flex-1 text-center">
              Official Result Documents (Class X - 2026)
            </h3>
            {isAdmin && (
              <button
                onClick={() => openAddDoc("Class X")}
                className="text-xs bg-[#0875C9] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#0066B5]"
              >
                + Add Doc
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {docs
              .filter((d) => d.category === "Class X")
              .map((d) => (
                <div key={d.id} className="relative group inline-flex items-center">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
                  >
                    <span>{d.icon}</span> {d.title}
                  </a>
                  {isAdmin && (
                    <div className="ml-2 flex items-center gap-1">
                      <button
                        onClick={() => openEditDoc(d)}
                        className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(d.id, d.title)}
                        className="text-[11px] bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* ─── 4. Dynamic Year-wise Result Banners from Live Site ─── */}
        {years.map((yearKey) => {
          const yearBanners = activeBanners.filter((b) => b.year === yearKey);
          return (
            <div key={yearKey} className="mb-14 text-center">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#092F78] mb-6">
                {yearKey}
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {yearBanners.map((b) => (
                  <div key={b.id} className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#D8EAF8] overflow-hidden">
                    {isAdmin && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200 shadow-sm">
                        <button
                          onClick={() => openEditBanner(b)}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(b.id, b.title)}
                          className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 font-bold"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    )}
                    <div className="relative w-full h-[300px] sm:h-[480px] md:h-[580px] rounded-xl overflow-hidden">
                      {b.image ? (
                        <Image
                          src={b.image}
                          alt={b.title}
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 900px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                          Banner image unavailable
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Modal: Document */}
        {modalType === "doc" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <h3 className="font-serif font-black text-lg text-[#092F78] mb-4">
                {editingDoc ? "Edit Result Document" : "Add Result Document"}
              </h3>
              <form onSubmit={handleSaveDoc} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                    placeholder="e.g. Class XII Result 2026 & Top Scorers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">File URL / Link *</label>
                  <input
                    type="text"
                    required
                    value={docForm.url}
                    onChange={(e) => setDocForm({ ...docForm, url: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                    placeholder="/documents/... or https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                  >
                    <option value="Class XII">Class XII</option>
                    <option value="Class X">Class X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Icon / Emoji</label>
                  <input
                    type="text"
                    value={docForm.icon}
                    onChange={(e) => setDocForm({ ...docForm, icon: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                    placeholder="📄 or ⭐ or 🎖️"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs bg-[#0875C9] text-white rounded-xl font-bold hover:bg-[#0066B5]"
                  >
                    Save Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Banner */}
        {modalType === "banner" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <h3 className="font-serif font-black text-lg text-[#092F78] mb-4">
                {editingBanner ? "Edit Achievement Banner" : "Add Achievement Banner"}
              </h3>
              <form onSubmit={handleSaveBanner} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year / Heading *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.year}
                    onChange={(e) => setBannerForm({ ...bannerForm, year: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                    placeholder="e.g. CBSE RESULTS 2025-'26"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                    placeholder="e.g. CBSE Results 2025-26 Banner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Image URL / Path *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0875C9]"
                    placeholder="/images/school_content/..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs bg-[#0875C9] text-white rounded-xl font-bold hover:bg-[#0066B5]"
                  >
                    Save Banner
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
