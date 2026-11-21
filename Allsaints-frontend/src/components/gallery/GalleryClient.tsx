"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SCHOOL_VIDEOS } from "@/constants";
import type { SchoolVideo } from "@/types";
import { YoutubeIcon } from "@/components/common/SocialIcons";
import {
  apiGetGallery,
  apiSaveGalleryAlbum,
  apiSaveGalleryVideo,
  apiDeleteGallery,
  apiUploadFile,
  apiLogin,
} from "@/utils/apiService";
import {
  isAdminAuthenticated,
  recordAdminLogin,
  clearAdminSession,
  setupAdminAutoLogout,
} from "@/utils/adminStorage";

export interface GalleryAlbum {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  isFeatured?: boolean;
}

export const DEFAULT_ALBUMS: GalleryAlbum[] = [
  {
    id: "karate-sessions",
    title: "Karate Sessions",
    subtitle: "Build up Self defence",
    category: "Martial Arts",
    image: "/images/school_content/1774685585-96686839769c78d9152c1b_WhatsApp_Image_2026-03-03_at_11.50.59_AM.jpeg",
    isFeatured: true,
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "Athletic Excellence & Champions",
    category: "Sports Day",
    image: "/images/school_content/1774685426-47014966169c78cf275d5b_Screenshot_2026-03-28_133946.png",
    isFeatured: true,
  },
  {
    id: "nature-club-and-farm-visit",
    title: "Nature club and farm visit",
    subtitle: "Exploring Nature",
    category: "Eco Club",
    image: "/images/school_content/1774684577-113630572269c789a155891_farm.jpeg",
    isFeatured: true,
  },
  {
    id: "main-campus",
    title: "Main Campus & Infrastructure Block",
    subtitle: "Eco-Friendly 10-Acre Campus",
    category: "Infrastructure",
    image: "/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg",
  },
  {
    id: "educational-blocks",
    title: "Educational Blocks & Laboratories",
    subtitle: "Modern Amenities & Practical Labs",
    category: "Facilities",
    image: "/images/school_content/1773902398-212600336869bb9a3e5ae72_infra1.jpg",
  },
  {
    id: "library",
    title: "School Library & Resource Room",
    subtitle: "Rich Knowledge Repository",
    category: "Library",
    image: "/images/school_content/1773902398-97681020769bb9a3e580eb_library.jpg",
  },
  {
    id: "bus-fleet",
    title: "School Bus Fleet",
    subtitle: "Safe & Disciplined Transport",
    category: "Conveyance",
    image: "/images/school_content/1773902602-131014106869bb9b0a29dea_bus.jpg",
  },
  {
    id: "faculty-mentors",
    title: "School Faculty & Mentors",
    subtitle: "Dedicated Teaching Staff",
    category: "Faculty",
    image: "/images/school_content/1773902602-182554790869bb9b0a0ee16_faculty.jpg",
  },
  {
    id: "toppers",
    title: "CBSE Board Examination Toppers",
    subtitle: "Class XII & X Academic Laurels",
    category: "Academics",
    image: "/images/school_content/1779345475-8217333446a0ea843eda53_WhatsApp_Image_2026-05-20_at_10.03.38_AM.jpeg",
  },
  {
    id: "extra-activity-1",
    title: "Campus Activity & Student Practice",
    subtitle: "All Saints Public School, Adoor",
    category: "Activities",
    image: "/images/school_content/1773908752-173959853269bbb3108cd3c_WhatsApp_Image_2026-03-03_at_11.50.59_AM.jpeg",
  },
  {
    id: "extra-activity-2",
    title: "Sports & Field Day Highlights",
    subtitle: "All Saints Public School, Adoor",
    category: "Sports",
    image: "/images/school_content/1773909027-4939578469bbb42338cc6_WhatsApp_Image_2026-03-03_at_11.54.31_AM_(1).jpeg",
  },
];

// ─── Category Icon Resolver (Exact matching icons for Martial Arts, Sports Day, Eco Club) ───
function getCategoryIcon(category: string) {
  const norm = (category || "").toLowerCase();

  // Martial Arts / Karate
  if (norm.includes("martial") || norm.includes("karate")) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 100 4 2 2 0 000-4zm6.5 8.5l-3-1.5-2.5 3 2 4.5-1.5.8-2-4.5-2.5 1.5V22h-2v-6.5l-2.5-1.5-2 4.5-1.5-.8 2-4.5-2.5-3-3 1.5-.8-1.8 3.5-1.8 3.5 1.8 3.5-2.3-.8-3.5 1.9-.5 1.1 3.5 3.5 2.3 3.5-1.8 3.5 1.8-.7 1.8z" />
      </svg>
    );
  }

  // Sports Day / Athletics
  if (norm.includes("sport") || norm.includes("athletic")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <circle cx="14" cy="5" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 22l3-7-2-3 4-2 3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 14l4-2 2 3-3 7" />
      </svg>
    );
  }

  // Eco Club / Nature Farm
  if (norm.includes("eco") || norm.includes("nature") || norm.includes("farm") || norm.includes("club")) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 3H10C5.58 3 2 6.58 2 11c0 4.08 3.05 7.44 7 7.93V21h2v-2.07c3.95-.49 7-3.85 7-7.93 0-2.21-.9-4.21-2.34-5.66L17 3zm-2 8c0 2.76-2.24 5-5 5-2.42 0-4.44-1.72-4.9-4H10v-2H5.1c.46-2.28 2.48-4 4.9-4h5v5z" />
      </svg>
    );
  }

  // Generic Camera
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

export default function GalleryClient() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Gallery state
  const [albums, setAlbums] = useState<GalleryAlbum[]>(DEFAULT_ALBUMS);
  const [videos, setVideos] = useState<SchoolVideo[]>(SCHOOL_VIDEOS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lightbox view state for albums
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

  // Video filtering states
  const [videoSearch, setVideoSearch] = useState("");
  const [videoCategory, setVideoCategory] = useState("All");
  const [visibleVideoCount, setVisibleVideoCount] = useState(12);

  // Modals for editing/adding
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [albumFormData, setAlbumFormData] = useState({
    title: "",
    subtitle: "",
    category: "Campus Events",
    image: "",
    isFeatured: false,
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<SchoolVideo | null>(null);
  const [videoFormData, setVideoFormData] = useState<{
    title: string;
    youtubeUrl: string;
    category: SchoolVideo["category"];
  }>({
    title: "",
    youtubeUrl: "",
    category: "Sports & Athletics",
  });

  // Check admin status and load saved gallery from backend / localStorage
  useEffect(() => {
    const adminLoggedIn = isAdminAuthenticated();
    setIsAdmin(adminLoggedIn);

    let cleanupAutoLogout: (() => void) | undefined;
    if (adminLoggedIn) {
      cleanupAutoLogout = setupAdminAutoLogout(() => {
        clearAdminSession();
        setIsAdmin(false);
      });
    }

    const savedAlbums = localStorage.getItem("asps_gallery_albums");
    if (savedAlbums) {
      try {
        setAlbums(JSON.parse(savedAlbums));
      } catch {
        // fallback to default
      }
    }

    const savedVideos = localStorage.getItem("asps_gallery_videos");
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch {
        // fallback to default
      }
    }

    // Fetch live from MySQL database & mirror to local view
    apiGetGallery("albums").then((dbAlbums) => {
      if (dbAlbums && Array.isArray(dbAlbums) && dbAlbums.length > 0) {
        const mapped: GalleryAlbum[] = dbAlbums.map((a: any) => ({
          id: String(a.id),
          title: a.title,
          subtitle: a.subtitle || "",
          category: a.category || "Campus Events",
          image: a.cover_image_url || "/images/infrastructure/infra-campus.jpg",
          isFeatured: Boolean(a.is_featured),
        }));
        setAlbums(mapped);
      }
    });

    apiGetGallery("videos").then((dbVideos) => {
      if (dbVideos && Array.isArray(dbVideos) && dbVideos.length > 0) {
        const mapped: SchoolVideo[] = dbVideos.map((v: any) => {
          const ytId = extractYoutubeId(v.youtube_url || "");
          return {
            id: String(v.id),
            title: v.title,
            category: v.category || "Sports & Athletics",
            embedUrl: `https://www.youtube.com/embed/${ytId}`,
            youtubeUrl: v.youtube_url || "",
          };
        });
        setVideos(mapped);
      }
    });

    return () => {
      if (cleanupAutoLogout) cleanupAutoLogout();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await apiLogin(loginUsername, loginPassword);
      if (res.success) {
        recordAdminLogin(loginUsername.trim());
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginError("");
        setLoginUsername("");
        setLoginPassword("");
        showToast("Administrator authenticated: You can now edit the gallery!");
      } else {
        setLoginError("Invalid credentials. Please enter authorized admin details.");
      }
    } catch {
      setLoginError("Authentication error. Please try again.");
    }
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    showToast("Signed out from Administrator mode.");
  };

  const handleResetToDefaults = () => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to restore official default gallery albums and videos?")) {
      localStorage.removeItem("asps_gallery_albums");
      localStorage.removeItem("asps_gallery_videos");
      setAlbums(DEFAULT_ALBUMS);
      setVideos(SCHOOL_VIDEOS);
      showToast("Gallery restored to official school defaults.");
    }
  };

  // Save changes
  const saveAlbums = (newAlbums: GalleryAlbum[]) => {
    setAlbums(newAlbums);
    localStorage.setItem("asps_gallery_albums", JSON.stringify(newAlbums));
  };

  const saveVideos = (newVideos: SchoolVideo[]) => {
    setVideos(newVideos);
    localStorage.setItem("asps_gallery_videos", JSON.stringify(newVideos));
  };

  // File upload handler for gallery album cover
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setUploadError("");
    setUploadFileName(file.name);

    try {
      const upRes = await apiUploadFile(file);
      if (upRes.success && upRes.url) {
        setAlbumFormData((prev) => ({ ...prev, image: upRes.url }));
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setAlbumFormData((prev) => ({ ...prev, image: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAlbumFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const closeAlbumModal = () => {
    setAlbumModalOpen(false);
    setEditingAlbum(null);
    setUploadFileName("");
    setUploadError("");
    setAlbumFormData({
      title: "",
      subtitle: "",
      category: "Campus Events",
      image: "",
      isFeatured: false,
    });
  };

  // Open album add/edit modal
  const openAddAlbum = () => {
    if (!isAdmin) return;
    setEditingAlbum(null);
    setImageInputMode("upload");
    setUploadFileName("");
    setUploadError("");
    setAlbumFormData({
      title: "",
      subtitle: "",
      category: "Campus Events",
      image: "",
      isFeatured: false,
    });
    setAlbumModalOpen(true);
  };

  const openEditAlbum = (album: GalleryAlbum) => {
    if (!isAdmin) return;
    setEditingAlbum(album);
    setImageInputMode("upload");
    setUploadFileName("");
    setUploadError("");
    setAlbumFormData({
      title: album.title,
      subtitle: album.subtitle,
      category: album.category,
      image: "",
      isFeatured: !!album.isFeatured,
    });
    setAlbumModalOpen(true);
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this album?")) {
      await apiDeleteGallery(id, "album");
      const updated = albums.filter((a) => a.id !== id);
      saveAlbums(updated);
      showToast("Album deleted successfully.");
    }
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!albumFormData.title.trim()) return;

    const finalImage = albumFormData.image.trim() || (editingAlbum ? editingAlbum.image : "");
    if (!finalImage) {
      setUploadError("Please provide an image by uploading a file or entering an image URL.");
      return;
    }

    if (editingAlbum) {
      const isNumericId = !isNaN(Number(editingAlbum.id));
      await apiSaveGalleryAlbum({
        id: isNumericId ? Number(editingAlbum.id) : undefined,
        title: albumFormData.title.trim(),
        subtitle: albumFormData.subtitle.trim(),
        category: albumFormData.category.trim(),
        cover_image_url: finalImage,
        is_featured: albumFormData.isFeatured ? 1 : 0,
        display_order: 1,
      });

      const updated = albums.map((a) =>
        a.id === editingAlbum.id
          ? {
              ...a,
              title: albumFormData.title.trim(),
              subtitle: albumFormData.subtitle.trim(),
              category: albumFormData.category.trim(),
              image: finalImage,
              isFeatured: albumFormData.isFeatured,
            }
          : a
      );
      saveAlbums(updated);
      showToast("Album updated successfully.");
    } else {
      const res = await apiSaveGalleryAlbum({
        title: albumFormData.title.trim(),
        subtitle: albumFormData.subtitle.trim(),
        category: albumFormData.category.trim(),
        cover_image_url: finalImage,
        is_featured: albumFormData.isFeatured ? 1 : 0,
        display_order: 1,
      });

      const newId = res && res.id ? String(res.id) : `album-${Date.now()}`;
      const newAlbum: GalleryAlbum = {
        id: newId,
        title: albumFormData.title.trim(),
        subtitle: albumFormData.subtitle.trim(),
        category: albumFormData.category.trim(),
        image: finalImage,
        isFeatured: albumFormData.isFeatured,
      };
      saveAlbums([newAlbum, ...albums]);
      showToast("New album created successfully.");
    }
    closeAlbumModal();
  };

  // Video management
  const openAddVideo = () => {
    if (!isAdmin) return;
    setEditingVideo(null);
    setVideoFormData({
      title: "",
      youtubeUrl: "",
      category: "Sports & Athletics",
    });
    setVideoModalOpen(true);
  };

  const openEditVideo = (video: SchoolVideo) => {
    if (!isAdmin) return;
    setEditingVideo(video);
    setVideoFormData({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
    });
    setVideoModalOpen(true);
  };

  const handleDeleteVideo = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this video?")) {
      await apiDeleteGallery(id, "video");
      const updated = videos.filter((v) => v.id !== id);
      saveVideos(updated);
      showToast("Video removed from gallery.");
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!videoFormData.title.trim() || !videoFormData.youtubeUrl.trim()) return;

    const ytId = extractYoutubeId(videoFormData.youtubeUrl.trim());
    const embed = `https://www.youtube.com/embed/${ytId}`;

    if (editingVideo) {
      const isNumericId = !isNaN(Number(editingVideo.id));
      await apiSaveGalleryVideo({
        id: isNumericId ? Number(editingVideo.id) : undefined,
        title: videoFormData.title.trim(),
        category: videoFormData.category,
        youtube_url: videoFormData.youtubeUrl.trim(),
      });

      const updated = videos.map((v) =>
        v.id === editingVideo.id
          ? {
              ...v,
              title: videoFormData.title.trim(),
              category: videoFormData.category,
              youtubeUrl: videoFormData.youtubeUrl.trim(),
              embedUrl: embed,
            }
          : v
      );
      saveVideos(updated);
      showToast("Video updated successfully.");
    } else {
      const res = await apiSaveGalleryVideo({
        title: videoFormData.title.trim(),
        category: videoFormData.category,
        youtube_url: videoFormData.youtubeUrl.trim(),
      });

      const newId = res && res.id ? String(res.id) : ytId || `vid-${Date.now()}`;
      const newVideo: SchoolVideo = {
        id: newId,
        title: videoFormData.title.trim(),
        category: videoFormData.category,
        embedUrl: embed,
        youtubeUrl: videoFormData.youtubeUrl.trim(),
      };
      saveVideos([newVideo, ...videos]);
      showToast("New YouTube video added to gallery.");
    }
    setVideoModalOpen(false);
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  // Video filtering
  const filteredVideos = videos.filter((v) => {
    const matchCategory = videoCategory === "All" || v.category === videoCategory;
    const matchSearch =
      v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(videoSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const displayedVideos = filteredVideos.slice(0, visibleVideoCount);

  const featuredAlbums = albums.filter((a) => a.isFeatured);
  const otherAlbums = albums.filter((a) => !a.isFeatured);

  return (
    <div>
      {/* ─── Toast Notification ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#0875C9] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-[#FFB900] text-sm font-sans flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <span className="text-[#FFB900] font-bold text-lg">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── ADMIN EDIT MODE CONTROL BAR (Visible when Admin is Authenticated) ─── */}
      {isAdmin && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-8 shadow-sm border border-[#D8EAF8] border-t-4 border-t-[#0875C9]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Status & Permissions info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-[#092F78] leading-tight">
                    Gallery Administration
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Create and manage campus photo albums and YouTube video entries
                </p>
              </div>
            </div>

            {/* Seamless, beautifully aligned action buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={openAddAlbum}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-sans font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Album</span>
              </button>

              <button
                type="button"
                onClick={openAddVideo}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#EAF6FF] text-[#0875C9] border border-[#0875C9] px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial shadow-2xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Add Video</span>
              </button>

              <Link
                href="/admin/dashboard"
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap"
              >
                <span>Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={handleResetToDefaults}
                className="inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-2 rounded-xl text-xs font-sans font-medium transition-all"
                title="Restore default albums and videos"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex items-center justify-center gap-1 text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 1: Featured School Events (Exact Match to Screenshot) ─── */}
      <section className="mb-14 sm:mb-16">
        
        {/* Header Bar with 3-Petal Icon, Title, and Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 sm:mb-8 pb-3">
          
          {/* Left: 3-Petal Emblem + Title + Subtitle + Golden Accent */}
          <div className="flex items-start gap-3 sm:gap-4">
            
            {/* Artistic 3-Petal Emblem (Golden Yellow #FFB900, Sky Blue #BFE3FF, Royal Blue #0875C9) */}
            <div className="w-7 h-9 sm:w-8 sm:h-10 shrink-0 mt-0.5">
              <svg viewBox="0 0 32 40" fill="none" className="w-full h-full">
                <path d="M4 26C4 26 14 24 12 12C10 2 2 10 4 26Z" fill="#FFB900" />
                <path d="M15 32C15 32 25 28 21 16C17 6 11 16 15 32Z" fill="#BFE3FF" />
                <path d="M25 36C25 36 33 30 27 20C23 12 19 22 25 36Z" fill="#0875C9" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78] tracking-tight">
                Featured School Events
              </h2>
              <p className="text-xs sm:text-sm font-sans italic text-slate-600 mt-1">
                Official highlights of recent co-curricular activities, self-defence workshops, and farm visits.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#FFB900] via-[#FFB900]/80 to-transparent rounded-full mt-2" />
            </div>
          </div>

          {/* Right: Admin Edit Gallery & Showing Events Buttons */}
          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            
            {/* Admin Edit Gallery Button - ONLY visible to logged-in Admin */}
            {isAdmin && (
            <button
              type="button"
              onClick={() => {
                if (isAdmin) {
                  openAddAlbum();
                } else {
                  setLoginUsername("");
                  setLoginPassword("");
                  setLoginError("");
                  setShowLoginModal(true);
                }
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EAF6FF] text-[#092F78] border border-[#BFE3FF] hover:border-[#0875C9] px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4 text-[#0875C9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Admin Edit Gallery</span>
            </button>

            )}

            {/* Showing Events Pill Indicator */}
            <div className="inline-flex items-center gap-2 bg-white text-[#0875C9] border-2 border-[#0875C9] px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-bold shadow-2xs whitespace-nowrap">
              <svg className="w-4 h-4 text-[#0875C9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Showing : {featuredAlbums.length} Events</span>
              <svg className="w-3.5 h-3.5 text-[#0875C9]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>

        {/* 3-Column Event Cards Grid (Exact Screenshot Styling) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {featuredAlbums.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedAlbum(event)}
              className="bg-white rounded-[26px] overflow-hidden border-2 border-[#D8EAF8] shadow-md hover:shadow-xl hover:border-[#0875C9] transition-all flex flex-col group relative cursor-pointer"
            >
              {/* Admin Overlay Buttons */}
              {isAdmin && (
                <div
                  className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xs p-1.5 rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => openEditAlbum(event)}
                    className="p-1.5 bg-[#FFB900] text-black rounded-lg text-xs font-bold hover:bg-[#E0A400] cursor-pointer"
                    title="Edit Album"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAlbum(event.id)}
                    className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500 cursor-pointer"
                    title="Delete Album"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* Card Photo Area */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Top-Left Category Badge in Solid Royal Blue #0875C9 */}
                <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0875C9] text-white rounded-full text-xs font-bold font-sans shadow-sm tracking-wide">
                  {getCategoryIcon(event.category)}
                  <span>{event.category}</span>
                </div>
              </div>

              {/* Card Bottom Area with "View Gallery ➔" and Golden Accent Curve */}
              <div className="p-5 sm:p-6 bg-white flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center gap-2 text-[#0875C9] group-hover:text-[#0066B5] transition-colors py-1">
                  <span className="font-sans font-bold text-sm sm:text-base tracking-tight">
                    View Gallery
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#0875C9] group-hover:bg-[#0066B5] text-white flex items-center justify-center text-xs shadow-xs group-hover:translate-x-1 transition-transform">
                    ➔
                  </span>
                </div>

                {/* Golden Yellow Accent Underline at Bottom */}
                <div className="w-4/5 h-1 rounded-full bg-gradient-to-r from-transparent via-[#FFB900] to-transparent mt-3 opacity-90" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ─── Centered Open Book Divider Emblem (Matching Reference Screenshot) ─── */}
      <div className="flex items-center justify-center my-12 sm:my-16 gap-4">
        <div className="h-0.5 w-24 sm:w-40 bg-gradient-to-r from-transparent via-[#0875C9] to-[#0875C9] rounded-full" />
        <div className="p-1.5 text-[#0875C9]">
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="h-0.5 w-24 sm:w-40 bg-gradient-to-l from-transparent via-[#0875C9] to-[#0875C9] rounded-full" />
      </div>

      {/* ─── SECTION 2: Campus Life & Infrastructure Albums ─────────────── */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D8EAF8] mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78]">
              Campus Life &amp; Infrastructure Albums
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
              Photographs of our classrooms, faculty, laboratories, and conveyance fleet.
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={openAddAlbum}
              className="text-xs font-bold bg-[#0875C9] text-white px-4 py-2 rounded-xl hover:bg-[#0066B5] cursor-pointer shadow-xs"
            >
              + Add Photo Album
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {otherAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#D8EAF8] hover:shadow-md hover:border-[#0875C9] transition-all flex flex-col group relative cursor-pointer"
            >
              {/* Admin Overlay Buttons */}
              {isAdmin && (
                <div
                  className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xs p-1.5 rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => openEditAlbum(album)}
                    className="p-1.5 bg-[#FFB900] text-black rounded-lg text-xs font-bold hover:bg-[#E0A400] cursor-pointer"
                    title="Edit Album"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500 cursor-pointer"
                    title="Delete Album"
                  >
                    🗑️
                  </button>
                </div>
              )}

              <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 bg-[#0875C9] text-white rounded-full text-xs font-bold font-sans shadow-xs">
                    {album.category}
                  </span>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#092F78] mb-1 group-hover:text-[#0875C9] transition-colors">
                    {album.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    {album.subtitle}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0875C9]">
                  <span className="group-hover:underline">View Album &rarr;</span>
                  {isAdmin && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      Editable
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 3: School Video Gallery ────────────────────────────── */}
      <section id="videos" className="pt-8 border-t border-[#D8EAF8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#FFB900] block mb-1.5">
              Official YouTube Broadcasts
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#092F78]">
              School Video Gallery ({videos.length} Videos)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-sans">
              Watch all official video broadcasts covering Saintsian Olympics 2K26, sports days, celebrations, and extracurricular activities.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={openAddVideo}
                className="inline-flex items-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wide transition-all shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Video</span>
              </button>
            )}
            <a
              href="https://www.youtube.com/@allsaintspublicschooladoor3598"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white px-6 py-2.5 rounded-xl font-serif text-xs sm:text-sm font-bold tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>YouTube Channel &rarr;</span>
            </a>
          </div>
        </div>

        {/* Video Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["All", "Sports & Athletics", "Annual Day & Fests", "Campus Life & Ceremonies", "Clubs & Academics"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setVideoCategory(cat);
                    setVisibleVideoCount(12);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold tracking-wide transition-all cursor-pointer ${
                    videoCategory === cat
                      ? "bg-[#0875C9] text-white shadow-xs"
                      : "bg-[#EAF6FF] text-[#092F78] hover:bg-[#BFE3FF] border border-[#D8EAF8]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Search Input Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search video library..."
              value={videoSearch}
              onChange={(e) => {
                setVideoSearch(e.target.value);
                setVisibleVideoCount(12);
              }}
              className="w-full px-4 py-2 border border-[#D8EAF8] bg-white rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0875C9] shadow-2xs"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#D8EAF8] hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Admin Overlay on Video */}
              {isAdmin && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => openEditVideo(video)}
                    className="p-1 bg-[#FFB900] text-black rounded text-[11px] font-bold hover:bg-[#E0A400] cursor-pointer"
                    title="Edit Video"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-1 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-500 cursor-pointer"
                    title="Delete Video"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* YouTube Embed Player */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <iframe referrerPolicy="strict-origin-when-cross-origin"
                  src={video.embedUrl}
                  title={video.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Title & Metadata */}
              <div className="p-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-serif font-bold uppercase text-[#FFB900] tracking-wider block mb-1">
                    {video.category}
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#092F78] leading-snug">
                    {video.title}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0875C9] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Watch on YouTube</span>
                    <span>↗</span>
                  </a>
                  {isAdmin && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      Admin Sync
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleVideoCount < filteredVideos.length && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleVideoCount((prev) => prev + 12)}
              className="bg-[#EAF6FF] hover:bg-[#0875C9] text-[#0875C9] hover:text-white border border-[#D8EAF8] px-8 py-3 rounded-xl text-xs sm:text-sm font-sans font-bold transition-all shadow-xs cursor-pointer"
            >
              Load More Videos ({filteredVideos.length - visibleVideoCount} remaining)
            </button>
          </div>
        )}
      </section>

      {/* ─── MODAL: Lightbox Photo Viewer ─────────────────────────────────── */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-[250] bg-[#092F78]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedAlbum(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-[#D8EAF8] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8EAF8] bg-[#F4FAFF]">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-[#0875C9] text-white rounded-full text-xs font-bold font-sans">
                  {selectedAlbum.category}
                </span>
                <h3 className="font-serif font-black text-lg sm:text-xl text-[#092F78]">
                  {selectedAlbum.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#EAF6FF] text-slate-500 hover:text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full h-80 sm:h-96 bg-slate-100">
              <Image
                src={selectedAlbum.image}
                alt={selectedAlbum.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#0875C9] uppercase tracking-wider block mb-0.5">
                  All Saints Public School Album
                </span>
                <p className="text-sm text-slate-600 font-sans">
                  {selectedAlbum.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="px-5 py-2 rounded-xl bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Admin Login Prompt ───────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#D8EAF8]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#092F78]">
                    Administrator Access
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Authenticate to enable Gallery Edit Mode
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter administrator email or username"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Sign In As Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add / Edit Photo Album ──────────────────────────────── */}
      {albumModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#D8EAF8]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <h3 className="font-serif font-black text-xl text-[#092F78]">
                {editingAlbum ? "Edit Photo Album" : "Add New Photo Album"}
              </h3>
              <button
                type="button"
                onClick={closeAlbumModal}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumFormData.title}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                  placeholder="e.g. Science Exhibition 2026"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={albumFormData.subtitle}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, subtitle: e.target.value })}
                  placeholder="e.g. Exploring Innovative Scientific Talents"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={albumFormData.category}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, category: e.target.value })}
                  placeholder="e.g. Martial Arts / Sports Day / Eco Club"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Cover Image Source *
                </label>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-2 mb-3 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("upload")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageInputMode === "upload"
                        ? "bg-[#0875C9] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>📁</span> Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageInputMode === "url"
                        ? "bg-[#0875C9] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>🔗</span> Image URL
                  </button>
                </div>

                {imageInputMode === "upload" && (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-[#D8EAF8] hover:border-[#0875C9] bg-[#EAF6FF]/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="text-2xl mb-1">📷</span>
                      <span className="font-bold text-[#0875C9] text-xs">
                        {uploadFileName ? "Change Uploaded Image" : "Click to Browse & Upload Image"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, JPEG, WEBP (Up to 5MB)
                      </span>
                    </label>

                    {uploadFileName && (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span>✓</span> Selected: {uploadFileName}
                      </p>
                    )}

                    {uploadError && (
                      <p className="text-[11px] text-rose-600 font-semibold">
                        ⚠️ {uploadError}
                      </p>
                    )}
                  </div>
                )}

                {imageInputMode === "url" && (
                  <div>
                    <input
                      type="text"
                      value={albumFormData.image}
                      onChange={(e) => setAlbumFormData({ ...albumFormData, image: e.target.value })}
                      placeholder="https://... or /images/school_content/..."
                      className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                    />
                  </div>
                )}

                {editingAlbum && !albumFormData.image && (
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Current cover photo is kept. Select or enter a new photo above if you want to replace it.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={albumFormData.isFeatured}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, isFeatured: e.target.checked })}
                  className="rounded text-[#0875C9] focus:ring-[#0875C9]"
                />
                <label htmlFor="isFeatured" className="font-semibold text-slate-700 cursor-pointer">
                  Feature in &ldquo;Featured School Events&rdquo; top section
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeAlbumModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingAlbum ? "Save Album Changes" : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add / Edit YouTube Video ────────────────────────────── */}
      {videoModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#D8EAF8]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <h3 className="font-serif font-black text-xl text-[#092F78]">
                {editingVideo ? "Edit School Video" : "Add New YouTube Video"}
              </h3>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="e.g. Saintsian Olympics 2K26 - Relay Finals"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  YouTube Video Link or Video ID *
                </label>
                <input
                  type="text"
                  required
                  value={videoFormData.youtubeUrl}
                  onChange={(e) => setVideoFormData({ ...videoFormData, youtubeUrl: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/watch?v=MTEOCQBDy4o or MTEOCQBDy4o"
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={videoFormData.category}
                  onChange={(e) => setVideoFormData({ ...videoFormData, category: e.target.value as SchoolVideo["category"] })}
                  className="w-full border border-[#D8EAF8] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0875C9] bg-white"
                >
                  <option value="Sports & Athletics">Sports &amp; Athletics</option>
                  <option value="Annual Day & Fests">Annual Day &amp; Fests</option>
                  <option value="Campus Life & Ceremonies">Campus Life &amp; Ceremonies</option>
                  <option value="Clubs & Academics">Clubs &amp; Academics</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-xl text-xs font-sans font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingVideo ? "Save Video Changes" : "Add Video to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
