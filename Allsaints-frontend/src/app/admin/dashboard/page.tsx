"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ManagementMember,
  EditableDocument,
  EditableNews,
  EditableResult,
  DEFAULT_MANAGEMENT,
  DEFAULT_DOCUMENTS,
  DEFAULT_NEWS,
  DEFAULT_RESULTS,
  getStoredManagement,
  saveStoredManagement,
  getStoredDocuments,
  saveStoredDocuments,
  getStoredNews,
  saveStoredNews,
  getStoredResults,
  saveStoredResults,
  syncAllFromLocalDb,
  isAdminAuthenticated,
  clearAdminSession,
  setupAdminAutoLogout,
} from "@/utils/adminStorage";
import {
  apiUploadFile,
  apiSaveManagementMember,
  apiDeleteManagementMember,
} from "@/utils/apiService";
import { DEFAULT_ALBUMS, GalleryAlbum } from "@/components/gallery/GalleryClient";
import { SCHOOL_VIDEOS } from "@/constants";
import type { SchoolVideo } from "@/types";

type AdminTab = "management" | "documents" | "news" | "results" | "gallery";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("management");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ─── DATA STATES ─────────────────────────────────────────────────────────
  const [managementList, setManagementList] = useState<ManagementMember[]>([]);
  const [documentList, setDocumentList] = useState<EditableDocument[]>([]);
  const [newsList, setNewsList] = useState<EditableNews[]>([]);
  const [resultList, setResultList] = useState<EditableResult[]>([]);
  const [albumList, setAlbumList] = useState<GalleryAlbum[]>([]);
  const [videoList, setVideoList] = useState<SchoolVideo[]>([]);

  // ─── MODAL STATES ────────────────────────────────────────────────────────
  const [modalType, setModalType] = useState<"management" | "document" | "news" | "result" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Form states
  const [mgtForm, setMgtForm] = useState<ManagementMember>({
    id: "",
    name: "",
    role: "",
    subRole: "",
    image: "",
    quote: "",
    bio: "",
    order: 1,
  });

  const [docForm, setDocForm] = useState<EditableDocument>({
    id: "",
    slug: "",
    order: 1,
    label: "",
    title: "",
    authority: "",
    status: "Verified & Submitted",
    desc: "",
    pdfUrls: [""],
    validUntil: "2028-03-31",
    isPublic: true,
  });

  const [newsForm, setNewsForm] = useState<EditableNews>({
    id: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    category: "Official Notice",
    excerpt: "",
    image: "",
    videoUrl: "",
    isFeatured: false,
    published: true,
  });

  const [resultForm, setResultForm] = useState<EditableResult>({
    id: "",
    classLevel: "Class X",
    year: "2025",
    registered: 100,
    passed: 100,
    percentage: "100%",
    remarks: "100% Pass Record",
    topperName: "",
    topperScore: "",
    topperImage: "",
  });

  // Load all stored data on mount
  useEffect(() => {
    // 1. Verify valid admin authentication with 10-minute timeout
    if (!isAdminAuthenticated()) {
      clearAdminSession();
      window.location.href = "/login?expired=1";
      return;
    }

    // 2. Set up auto-logout after 10 minutes of inactivity
    const cleanupAutoLogout = setupAdminAutoLogout(() => {
      clearAdminSession();
      alert("Session Expired: You were automatically logged out after 10 minutes of inactivity.");
      window.location.href = "/login?expired=1";
    });

    setManagementList(getStoredManagement());
    setDocumentList(getStoredDocuments());
    setNewsList(getStoredNews());
    setResultList(getStoredResults());

    // Sync directly from Local MySQL DB
    syncAllFromLocalDb().then(() => {
      setManagementList(getStoredManagement());
      setNewsList(getStoredNews());
    });

    // Gallery & videos
    try {
      const savedAlbums = localStorage.getItem("asps_gallery_albums");
      setAlbumList(savedAlbums ? JSON.parse(savedAlbums) : DEFAULT_ALBUMS);

      const savedVideos = localStorage.getItem("asps_gallery_videos");
      setVideoList(savedVideos ? JSON.parse(savedVideos) : SCHOOL_VIDEOS);
    } catch {}

    return () => {
      cleanupAutoLogout();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image File Upload Helper
  const handleGenericFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setUploadError("Please choose a valid image (PNG, JPG, WEBP) or PDF file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("File size exceeds 8MB. Please choose a smaller file.");
      return;
    }

    setUploadError("");
    setUploadFileName(file.name);

    // Upload to local PHP backend
    apiUploadFile(file).then((res) => {
      if (res.success && res.url) {
        onSuccess(res.url);
      }
    });

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onSuccess(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ─── MANAGEMENT CRUD ─────────────────────────────────────────────────────
  const openAddManagement = () => {
    setIsEditing(false);
    setImageInputMode("upload");
    setUploadFileName("");
    setUploadError("");
    setMgtForm({
      id: `mgt-${Date.now()}`,
      name: "",
      role: "",
      subRole: "",
      image: "",
      quote: "",
      bio: "",
      order: managementList.length + 1,
    });
    setModalType("management");
  };

  const openEditManagement = (item: ManagementMember) => {
    setIsEditing(true);
    setImageInputMode(item.image.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setUploadError("");
    setMgtForm({ ...item });
    setModalType("management");
  };

  const handleSaveManagement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mgtForm.name.trim() || !mgtForm.role.trim()) {
      alert("Please provide the member name and designation.");
      return;
    }
    if (!mgtForm.image.trim()) {
      alert("Please upload or provide a portrait photograph.");
      return;
    }

    try {
      // 1. Direct Save to MySQL Database
      const savePayload = {
        id: isEditing && !String(mgtForm.id).startsWith("mgt-") && !isNaN(Number(mgtForm.id)) ? Number(mgtForm.id) : undefined,
        name: mgtForm.name,
        role: mgtForm.role,
        sub_role: mgtForm.subRole || null,
        photo_url: mgtForm.image,
        quote: mgtForm.quote || null,
        bio: mgtForm.bio || null,
        display_order: mgtForm.order,
        is_patron: mgtForm.role.toLowerCase().includes("patron") ? 1 : 0,
      };

      const res = await apiSaveManagementMember(savePayload);
      const savedId = res?.id ? String(res.id) : mgtForm.id;
      const finalMember = { ...mgtForm, id: savedId };

      let updated: ManagementMember[];
      if (isEditing) {
        updated = managementList.map((m) =>
          m.id === mgtForm.id || m.name === mgtForm.name ? finalMember : m
        );
        showToast(`Management member "${mgtForm.name}" updated in database.`);
      } else {
        updated = [...managementList, finalMember];
        showToast(`New management member "${mgtForm.name}" added to database.`);
      }

      setManagementList(updated);
      localStorage.setItem("asps_management_members", JSON.stringify(updated));
      setModalType(null);
    } catch (err: any) {
      alert(`Database error: ${err.message}`);
    }
  };

  const handleDeleteManagement = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from Management?`)) {
      try {
        await apiDeleteManagementMember(id, name);
      } catch (err) {
        console.error("Database deletion error:", err);
      }
      const updated = managementList.filter((m) => m.id !== id && m.name !== name);
      setManagementList(updated);
      localStorage.setItem("asps_management_members", JSON.stringify(updated));
      showToast(`Removed "${name}" from Management.`);
    }
  };

  const handleResetManagement = () => {
    if (window.confirm("Restore official school management defaults?")) {
      setManagementList(DEFAULT_MANAGEMENT);
      saveStoredManagement(DEFAULT_MANAGEMENT);
      showToast("Management board restored to official defaults.");
    }
  };

  // ─── DOCUMENTS CRUD ──────────────────────────────────────────────────────
  const openAddDocument = () => {
    setIsEditing(false);
    setImageInputMode("upload");
    setUploadFileName("");
    setUploadError("");
    setDocForm({
      id: `doc-${Date.now()}`,
      slug: `custom-cert-${Date.now()}`,
      order: documentList.length + 1,
      label: "",
      title: "",
      authority: "Government / Statutory Authority",
      status: "Verified & Submitted",
      desc: "",
      pdfUrls: ["/documents/affiliation-cert.pdf"],
      validUntil: "2028-03-31",
      isPublic: true,
    });
    setModalType("document");
  };

  const openEditDocument = (doc: EditableDocument) => {
    setIsEditing(true);
    setImageInputMode(doc.pdfUrls[0]?.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setUploadError("");
    setDocForm({ ...doc });
    setModalType("document");
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim() || !docForm.authority.trim()) {
      alert("Please provide the certificate title and issuing authority.");
      return;
    }

    let updated: EditableDocument[];
    if (isEditing) {
      updated = documentList.map((d) => (d.id === docForm.id ? docForm : d));
      showToast(`Document "${docForm.title}" updated.`);
    } else {
      updated = [...documentList, docForm];
      showToast(`Document "${docForm.title}" registered.`);
    }
    setDocumentList(updated);
    saveStoredDocuments(updated);
    setModalType(null);
  };

  const handleDeleteDocument = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete certificate: ${title}?`)) {
      const updated = documentList.filter((d) => d.id !== id);
      setDocumentList(updated);
      saveStoredDocuments(updated);
      showToast(`Certificate "${title}" removed.`);
    }
  };

  const handleResetDocuments = () => {
    if (window.confirm("Restore 11 official statutory CBSE documents to defaults?")) {
      setDocumentList(DEFAULT_DOCUMENTS);
      saveStoredDocuments(DEFAULT_DOCUMENTS);
      showToast("Statutory documents restored to defaults.");
    }
  };

  // ─── NEWS CRUD ───────────────────────────────────────────────────────────
  const openAddNews = () => {
    setIsEditing(false);
    setImageInputMode("upload");
    setUploadFileName("");
    setUploadError("");
    setNewsForm({
      id: `news-${Date.now()}`,
      title: "",
      date: new Date().toISOString().split("T")[0],
      category: "Official Notice",
      excerpt: "",
      image: "",
      isFeatured: false,
      published: true,
    });
    setModalType("news");
  };

  const openEditNews = (item: EditableNews) => {
    setIsEditing(true);
    setImageInputMode(item.image?.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setUploadError("");
    setNewsForm({ ...item });
    setModalType("news");
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.excerpt.trim()) {
      alert("Please provide headline and notice description.");
      return;
    }

    let updated: EditableNews[];
    if (isEditing) {
      updated = newsList.map((n) => (n.id === newsForm.id ? newsForm : n));
      showToast(`News "${newsForm.title}" updated.`);
    } else {
      updated = [newsForm, ...newsList];
      showToast(`News "${newsForm.title}" published.`);
    }
    setNewsList(updated);
    saveStoredNews(updated);
    setModalType(null);
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (window.confirm(`Delete news item: "${title}"?`)) {
      const updated = newsList.filter((n) => n.id !== id);
      setNewsList(updated);
      saveStoredNews(updated);
      showToast(`News notice removed.`);
    }
  };

  const handleResetNews = () => {
    if (window.confirm("Restore official school news notices to defaults?")) {
      setNewsList(DEFAULT_NEWS);
      saveStoredNews(DEFAULT_NEWS);
      showToast("News notices restored to defaults.");
    }
  };

  // ─── RESULTS CRUD ────────────────────────────────────────────────────────
  const openAddResult = () => {
    setIsEditing(false);
    setResultForm({
      id: `res-${Date.now()}`,
      classLevel: "Class X",
      year: new Date().getFullYear().toString(),
      registered: 100,
      passed: 100,
      percentage: "100%",
      remarks: "100% Centum Pass Record",
      topperName: "",
      topperScore: "",
      topperImage: "",
    });
    setModalType("result");
  };

  const openEditResult = (res: EditableResult) => {
    setIsEditing(true);
    setResultForm({ ...res });
    setModalType("result");
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: EditableResult[];
    if (isEditing) {
      updated = resultList.map((r) => (r.id === resultForm.id ? resultForm : r));
      showToast(`${resultForm.classLevel} result for ${resultForm.year} updated.`);
    } else {
      updated = [resultForm, ...resultList];
      showToast(`${resultForm.classLevel} result for ${resultForm.year} added.`);
    }
    setResultList(updated);
    saveStoredResults(updated);
    setModalType(null);
  };

  const handleDeleteResult = (id: string, classLevel: string, year: string) => {
    if (window.confirm(`Delete ${classLevel} results record for ${year}?`)) {
      const updated = resultList.filter((r) => r.id !== id);
      setResultList(updated);
      saveStoredResults(updated);
      showToast(`Result record deleted.`);
    }
  };

  const handleResetResults = () => {
    if (window.confirm("Restore official CBSE Board pass statistics to defaults?")) {
      setResultList(DEFAULT_RESULTS);
      saveStoredResults(DEFAULT_RESULTS);
      showToast("Board results restored to defaults.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF2F5]/40 font-sans pb-20">
      
      {/* ─── Toast Notification ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6B0B2E] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#D97706] text-xs font-serif font-bold flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Top Admin Navigation Bar ──────────────────────────────────── */}
      <header className="bg-[#6B0B2E] text-white py-3.5 px-4 sm:px-8 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-10 flex-shrink-0">
              <Image
                src="/images/logo/allsaints-clean-crest.png"
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <span className="font-serif font-bold text-sm block leading-tight">
                All Saints Public School · Master CMS Admin
              </span>
              <span className="text-[10px] text-amber-200 block">
                Logged in: Administrator (admin@allsaintsadoor.com)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full font-serif font-bold transition-all border border-white/20 hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Live Website</span>
              <span>↗</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                window.location.href = "/login";
              }}
              className="text-xs bg-[#4A051E] hover:bg-black text-white px-4 py-1.5 rounded-full font-serif font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Welcome Banner */}
        <div className="bg-white border border-[#EED3DC] rounded-3xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#D97706] block">
                Official School Administration Console
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Authorized
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#4A051E]">
              Content Management System (CMS)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Full administrative privileges to create, update, upload media, and manage <strong>Our Management</strong>, <strong>Statutory Documents</strong>, <strong>School News</strong>, <strong>Board Results</strong>, and <strong>Photo/Video Gallery</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button type="button" onClick={() => { clearAdminSession(); window.location.href = "/login"; }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl text-xs font-serif font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center gap-1.5 order-last sm:order-none" title="Logout Administrator Session"><span>🚪 Logout</span></button>
            <div className="flex items-center gap-2 bg-[#FAF2F5] px-4 py-2.5 rounded-2xl border border-[#EED3DC] text-xs font-semibold text-[#6B0B2E]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Live Sync Active</span>
            </div>
          </div>
        </div>

        {/* ─── Quick Metric Counters ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-[#EED3DC] shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Management Leaders</span>
            <span className="text-2xl font-serif font-black text-[#6B0B2E] mt-1 block">
              {managementList.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#EED3DC] shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">CBSE Certificates</span>
            <span className="text-2xl font-serif font-black text-[#D97706] mt-1 block">
              {documentList.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#EED3DC] shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">News &amp; Bulletins</span>
            <span className="text-2xl font-serif font-black text-[#6B0B2E] mt-1 block">
              {newsList.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#EED3DC] shadow-2xs">
            <span className="text-xs text-slate-500 font-medium block">Board Exam Batches</span>
            <span className="text-2xl font-serif font-black text-slate-800 mt-1 block">
              {resultList.length}
            </span>
          </div>
        </div>

        {/* ─── Section Tabs (Management / Documents / News / Results / Gallery) ─ */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("management")}
            className={`px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "management"
                ? "bg-[#6B0B2E] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-[#FAF2F5] border border-slate-200"
            }`}
          >
            👥 Our Management ({managementList.length})
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "documents"
                ? "bg-[#6B0B2E] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-[#FAF2F5] border border-slate-200"
            }`}
          >
            📜 Documents &amp; Certificates ({documentList.length})
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-[#6B0B2E] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-[#FAF2F5] border border-slate-200"
            }`}
          >
            📰 News &amp; Bulletins ({newsList.length})
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "results"
                ? "bg-[#6B0B2E] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-[#FAF2F5] border border-slate-200"
            }`}
          >
            🏆 Results &amp; Achievements ({resultList.length})
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#6B0B2E] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-[#FAF2F5] border border-slate-200"
            }`}
          >
            📸 Gallery Albums ({albumList.length})
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: OUR MANAGEMENT                                              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "management" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-serif font-black text-[#4A051E]">
                  Leadership, Patrons &amp; Management Board
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes made here update the homepage Management Section and /about/our-management page in real time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddManagement}
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span> Add Management Leader
                </button>
                <button
                  type="button"
                  onClick={handleResetManagement}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  title="Reset to official school defaults"
                >
                  Reset
                </button>
                <Link
                  href="/about/our-management"
                  target="_blank"
                  className="text-xs text-[#6B0B2E] hover:underline px-2 font-bold"
                >
                  View Page ↗
                </Link>
              </div>
            </div>

            {/* Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementList.map((m) => (
                <div
                  key={m.id}
                  className="border-2 border-slate-200 hover:border-[#6B0B2E] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between bg-white group"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-[#EED3DC] flex-shrink-0">
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div>
                        <span className="inline-block bg-[#FAF2F5] text-[#6B0B2E] text-[10px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                          {m.role}
                        </span>
                        <h3 className="font-serif font-bold text-sm text-[#4A051E] leading-snug">
                          {m.name}
                        </h3>
                        {m.subRole && (
                          <p className="text-[11px] text-[#D97706] font-medium mt-0.5">
                            {m.subRole}
                          </p>
                        )}
                      </div>
                    </div>

                    {m.quote && (
                      <p className="text-xs italic text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 line-clamp-3">
                        &ldquo;{m.quote}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Order: #{m.order}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditManagement(m)}
                        className="text-xs bg-slate-100 hover:bg-[#FAF2F5] text-[#6B0B2E] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteManagement(m.id, m.name)}
                        className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: STATUTORY DOCUMENTS                                         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-serif font-black text-[#4A051E]">
                  Statutory CBSE Certificates &amp; Public Disclosures
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish certificates, land deeds, affiliation documents, and government NOCs on /documents.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddDocument}
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span> Upload / Add Certificate
                </button>
                <button
                  type="button"
                  onClick={handleResetDocuments}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  title="Reset to 11 official defaults"
                >
                  Reset
                </button>
                <Link
                  href="/documents"
                  target="_blank"
                  className="text-xs text-[#6B0B2E] hover:underline px-2 font-bold"
                >
                  View Page ↗
                </Link>
              </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-serif font-bold">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Certificate Title</th>
                    <th className="py-3 px-4">Issuing Authority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Document Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documentList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{doc.order}</td>
                      <td className="py-3 px-4 font-serif font-bold text-[#4A051E]">
                        {doc.title}
                        <span className="block text-[11px] font-sans font-normal text-slate-500 mt-0.5 line-clamp-1">
                          {doc.desc}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{doc.authority}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold text-[10px]">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={doc.pdfUrls[0] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B0B2E] hover:underline font-semibold"
                        >
                          View PDF / File ↗
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditDocument(doc)}
                            className="bg-slate-100 hover:bg-[#FAF2F5] text-[#6B0B2E] font-bold px-2.5 py-1 rounded-lg text-xs"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id, doc.title)}
                            className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: NEWS & BULLETINS                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "news" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-serif font-black text-[#4A051E]">
                  School News, Press Releases &amp; Daily Bulletins
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage announcements, daily newspaper clippings, circulars, and event coverage on /news.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddNews}
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span> Add News Bulletin
                </button>
                <button
                  type="button"
                  onClick={handleResetNews}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  title="Reset to official school defaults"
                >
                  Reset
                </button>
                <Link
                  href="/news"
                  target="_blank"
                  className="text-xs text-[#6B0B2E] hover:underline px-2 font-bold"
                >
                  View Page ↗
                </Link>
              </div>
            </div>

            {/* News Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="border-2 border-slate-200 hover:border-[#6B0B2E] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="bg-[#FAF2F5] text-[#6B0B2E] text-[10px] font-serif font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#EED3DC]">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">{item.date}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#4A051E] mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {item.image && (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-medium">● Published Live</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditNews(item)}
                        className="bg-slate-100 hover:bg-[#FAF2F5] text-[#6B0B2E] font-bold px-3 py-1 rounded-lg text-xs cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNews(item.id, item.title)}
                        className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: RESULTS & ACHIEVEMENTS                                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "results" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-serif font-black text-[#4A051E]">
                  CBSE Board Examination Results (Class X &amp; XII)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update registered candidate counts, passed counts, pass percentages, remarks, and toppers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddResult}
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span> Add Result Batch
                </button>
                <button
                  type="button"
                  onClick={handleResetResults}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  title="Reset to official school defaults"
                >
                  Reset
                </button>
                <Link
                  href="/admissions/results"
                  target="_blank"
                  className="text-xs text-[#6B0B2E] hover:underline px-2 font-bold"
                >
                  View Page ↗
                </Link>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-serif font-bold">
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Academic Year</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4">Passed</th>
                    <th className="py-3 px-4">Pass %</th>
                    <th className="py-3 px-4">Remarks</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultList.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-serif font-bold text-[#6B0B2E]">
                        {res.classLevel}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{res.year}</td>
                      <td className="py-3 px-4 text-slate-600">{res.registered}</td>
                      <td className="py-3 px-4 text-slate-600 font-bold">{res.passed}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                          {res.percentage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{res.remarks}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditResult(res)}
                            className="bg-slate-100 hover:bg-[#FAF2F5] text-[#6B0B2E] font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResult(res.id, res.classLevel, res.year)}
                            className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: GALLERY & MEDIA                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-serif font-black text-[#4A051E]">
                  Photo Albums &amp; YouTube Video Gallery
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage albums with live file upload &amp; direct URL support on /gallery.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/gallery"
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                  <span>Open Interactive Gallery Editor ↗</span>
                </Link>
              </div>
            </div>

            {/* Gallery Albums Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albumList.map((alb) => (
                <div
                  key={alb.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all group bg-white"
                >
                  <div className="relative w-full h-44 bg-slate-100">
                    <Image
                      src={alb.image}
                      alt={alb.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {alb.subtitle}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-[#D97706] font-bold uppercase tracking-wider block mb-1">
                      {alb.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#4A051E] line-clamp-1">
                      {alb.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 1: ADD / EDIT MANAGEMENT LEADER ─────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {modalType === "management" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#4A051E]">
                {isEditing ? "Edit Management Member" : "Add Management Member"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveManagement} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Full Name &amp; Ecclesiastical Title *
                </label>
                <input
                  type="text"
                  required
                  value={mgtForm.name}
                  onChange={(e) => setMgtForm({ ...mgtForm, name: e.target.value })}
                  placeholder="e.g. Most Rev. Dr. Samuel Mar Irenios"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
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
                    value={mgtForm.role}
                    onChange={(e) => setMgtForm({ ...mgtForm, role: e.target.value })}
                    placeholder="e.g. Patron & President"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Diocese / Sub-Role
                  </label>
                  <input
                    type="text"
                    value={mgtForm.subRole || ""}
                    onChange={(e) => setMgtForm({ ...mgtForm, subRole: e.target.value })}
                    placeholder="e.g. Bishop of Pathanamthitta"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
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
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      imageInputMode === "upload"
                        ? "bg-[#6B0B2E] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      imageInputMode === "url"
                        ? "bg-[#6B0B2E] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🔗 Image URL / Path
                  </button>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#6B0B2E] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#FAF2F5]/50 transition-colors p-2">
                      <span className="text-xs text-slate-600 font-medium text-center">
                        {uploadFileName ? uploadFileName : "Click to select a photo from your computer"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP (Max 8MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) =>
                            setMgtForm((prev) => ({ ...prev, image: dataUrl }))
                          )
                        }
                      />
                    </label>
                    {uploadError && <p className="text-xs text-rose-600 mt-1">{uploadError}</p>}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={mgtForm.image}
                    onChange={(e) => setMgtForm({ ...mgtForm, image: e.target.value })}
                    placeholder="/images/management/principal.jpg or https://..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                )}

                {/* Preview */}
                {mgtForm.image && (
                  <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        <Image src={mgtForm.image} alt="Preview" fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">Photo ready</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMgtForm((prev) => ({ ...prev, image: "" }));
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
                  value={mgtForm.quote || ""}
                  onChange={(e) => setMgtForm({ ...mgtForm, quote: e.target.value })}
                  placeholder="Official message or guiding quotation..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Guiding Bio / Profile Summary
                </label>
                <textarea
                  rows={2}
                  value={mgtForm.bio || ""}
                  onChange={(e) => setMgtForm({ ...mgtForm, bio: e.target.value })}
                  placeholder="Leadership overview, contributions, or institutional biography..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 2: ADD / EDIT STATUTORY DOCUMENT ─────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {modalType === "document" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#4A051E]">
                {isEditing ? "Edit Statutory Document" : "Register Statutory Certificate"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) =>
                    setDocForm({
                      ...docForm,
                      title: e.target.value,
                      label: e.target.value,
                    })
                  }
                  placeholder="e.g. Building Fitness Certificate (LSGD)"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={docForm.authority}
                    onChange={(e) => setDocForm({ ...docForm, authority: e.target.value })}
                    placeholder="e.g. Assistant Engineer, LSGD Adoor"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Compliance Status
                  </label>
                  <input
                    type="text"
                    value={docForm.status}
                    onChange={(e) => setDocForm({ ...docForm, status: e.target.value })}
                    placeholder="Verified & Submitted"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Description / CBSE Scope
                </label>
                <textarea
                  rows={2}
                  value={docForm.desc}
                  onChange={(e) => setDocForm({ ...docForm, desc: e.target.value })}
                  placeholder="Official certificate summary conforming to CBSE Appendix IX..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              {/* PDF Document Upload vs URL */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Certificate PDF / Document Link *
                </label>
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("upload")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      imageInputMode === "upload"
                        ? "bg-[#6B0B2E] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Upload PDF / Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      imageInputMode === "url"
                        ? "bg-[#6B0B2E] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🔗 Document URL / Path
                  </button>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#6B0B2E] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#FAF2F5]/50 transition-colors p-2">
                      <span className="text-xs text-slate-600 font-medium text-center">
                        {uploadFileName ? uploadFileName : "Select Certificate PDF or Image"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG (Max 8MB)</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) =>
                            setDocForm((prev) => ({ ...prev, pdfUrls: [dataUrl] }))
                          )
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={docForm.pdfUrls[0] || ""}
                    onChange={(e) => setDocForm({ ...docForm, pdfUrls: [e.target.value] })}
                    placeholder="/documents/affiliation-certificate.pdf"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 3: ADD / EDIT NEWS BULLETIN ─────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {modalType === "news" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#4A051E]">
                {isEditing ? "Edit News Bulletin" : "Publish News Bulletin"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  News Headline *
                </label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="e.g. Triumph of Excellence: Class XII CBSE Results 2026"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newsForm.category}
                    onChange={(e) =>
                      setNewsForm({
                        ...newsForm,
                        category: e.target.value as EditableNews["category"],
                      })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#6B0B2E] outline-none bg-white"
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
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
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
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  placeholder="Detailed press release or notice..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              {/* News Image Upload vs URL */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Notice Poster / Newspaper Clipping Image
                </label>
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("upload")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      imageInputMode === "upload"
                        ? "bg-[#6B0B2E] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Upload Poster
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      imageInputMode === "url"
                        ? "bg-[#6B0B2E] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🔗 Image URL / Path
                  </button>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#6B0B2E] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#FAF2F5]/50 transition-colors p-2">
                      <span className="text-xs text-slate-600 font-medium text-center">
                        {uploadFileName ? uploadFileName : "Select news poster image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) =>
                            setNewsForm((prev) => ({ ...prev, image: dataUrl }))
                          )
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newsForm.image}
                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                    placeholder="/images/school_content/1773902602-199036049569bb9b0a252c9_news.jpg"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-md transition-all cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 4: ADD / EDIT RESULTS BATCH ──────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {modalType === "result" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#4A051E]">
                {isEditing ? "Edit Board Results Record" : "Add Board Results Batch"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Class Level *
                  </label>
                  <select
                    value={resultForm.classLevel}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        classLevel: e.target.value as "Class X" | "Class XII",
                      })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#6B0B2E] outline-none bg-white"
                  >
                    <option value="Class X">Class X (AISSE)</option>
                    <option value="Class XII">Class XII (AISSCE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={resultForm.year}
                    onChange={(e) => setResultForm({ ...resultForm, year: e.target.value })}
                    placeholder="2026"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Registered *
                  </label>
                  <input
                    type="number"
                    required
                    value={resultForm.registered}
                    onChange={(e) =>
                      setResultForm({ ...resultForm, registered: Number(e.target.value) })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Passed *
                  </label>
                  <input
                    type="number"
                    required
                    value={resultForm.passed}
                    onChange={(e) =>
                      setResultForm({ ...resultForm, passed: Number(e.target.value) })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Pass % *
                  </label>
                  <input
                    type="text"
                    required
                    value={resultForm.percentage}
                    onChange={(e) => setResultForm({ ...resultForm, percentage: e.target.value })}
                    placeholder="100%"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#6B0B2E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Remarks / Accolades
                </label>
                <input
                  type="text"
                  value={resultForm.remarks}
                  onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
                  placeholder="e.g. 100% Pass Record - 28 Full A1 Grades"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#6B0B2E] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6B0B2E] hover:bg-[#4A051E] text-white px-5 py-2 rounded-xl text-xs font-serif font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Result Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
