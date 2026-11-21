"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { isAdminAuthenticated } from "@/utils/adminStorage";

interface CalendarItem {
  id: string;
  src: string;
  title: string;
}

const DEFAULT_CALENDAR_IMAGES: CalendarItem[] = [
  {
    id: "cal-1",
    src: "/images/school_content/1773902398-49138727169bb9a3e7fd88_calendar.jpg",
    title: "Academic Calendar – Term I (June to September)",
  },
  {
    id: "cal-2",
    src: "/images/school_content/1773902398-111435063269bb9a3e7b3ec_calendar1.jpg",
    title: "Academic Calendar – Term II (October to December)",
  },
  {
    id: "cal-3",
    src: "/images/school_content/1773902398-155661104269bb9a3e7703c_calendar2.jpg",
    title: "Academic Calendar – Term III & Annual (January to March)",
  },
];

export default function CalendarPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<CalendarItem[]>(DEFAULT_CALENDAR_IMAGES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const [formData, setFormData] = useState<CalendarItem>({
    id: "",
    title: "",
    src: "",
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    try {
      const saved = localStorage.getItem("asps_academic_calendar");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.some((p) => p && typeof p.src === "string" && p.src.trim().length > 0)
        ) {
          setItems(parsed);
        } else {
          setItems(DEFAULT_CALENDAR_IMAGES);
          localStorage.setItem("asps_academic_calendar", JSON.stringify(DEFAULT_CALENDAR_IMAGES));
        }
      } else {
        localStorage.setItem("asps_academic_calendar", JSON.stringify(DEFAULT_CALENDAR_IMAGES));
      }
    } catch {
      setItems(DEFAULT_CALENDAR_IMAGES);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `cal-${Date.now()}`,
      title: "",
      src: "",
    });
    setShowModal(true);
  };

  const openEdit = (item: CalendarItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.src.trim()) {
      alert("Title and Image URL are required.");
      return;
    }
    let updated: CalendarItem[];
    if (editingItem) {
      updated = items.map((i) => (i.id === formData.id ? formData : i));
      showToast(`Updated "${formData.title}".`);
    } else {
      updated = [...items, formData];
      showToast(`Added "${formData.title}".`);
    }
    setItems(updated);
    localStorage.setItem("asps_academic_calendar", JSON.stringify(updated));
    setShowModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete calendar term "${title}"?`)) {
      const updated = items.filter((i) => i.id !== id);
      setItems(updated);
      localStorage.setItem("asps_academic_calendar", JSON.stringify(updated));
      showToast(`Removed calendar term.`);
    }
  };

  const handleReset = () => {
    if (window.confirm("Restore official CBSE Academic Calendar defaults?")) {
      setItems(DEFAULT_CALENDAR_IMAGES);
      localStorage.setItem("asps_academic_calendar", JSON.stringify(DEFAULT_CALENDAR_IMAGES));
      showToast("Restored official academic calendar.");
    }
  };

  const validItems = items.filter(
    (item) => item && typeof item.src === "string" && item.src.trim().length > 0
  );
  const displayItems = validItems.length > 0 ? validItems : DEFAULT_CALENDAR_IMAGES;

  return (
    <div className="section-pad container-custom font-sans">
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
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-serif font-black text-sm text-[#092F78] flex items-center gap-2">
                <span>Academic Calendar Editor</span>
                <span className="text-[10px] bg-[#22B573] text-white font-sans px-2 py-0.5 rounded-full uppercase">
                  Admin Active
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Update or upload high-resolution scans and term schedules for parents and students.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAdd}
              className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              + Add Calendar Term
            </button>
            <button
              onClick={handleReset}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              ↺ Defaults
            </button>
          </div>
        </div>
      )}

      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">Academics</span>
        <span>&rsaquo;</span>
        <span className="text-[#092F78] font-bold">Academic Calender</span>
      </nav>

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#0875C9]" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0875C9]">
            Annual Academic Planning &amp; Events
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#092F78] mb-3 tracking-tight">
          Academic Calender
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mb-4" />
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          The official Academic Calendar of All Saints Public School outlines the working days, periodic tests, term evaluations, vacations, cultural celebrations, and CBSE board examination schedules.
        </p>
      </div>

      {/* ─── Scanned Calendar Pages from Live Site ────────────────────────── */}
      <div className="space-y-12 mb-12">
        {displayItems.map((item, idx) => (
          <div
            key={item.id || item.src}
            className="relative bg-white border-2 border-[#D8EAF8] rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden"
          >
            {isAdmin && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => openEdit(item)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 font-bold"
                >
                  ✕ Delete
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 pr-28 sm:pr-0">
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#092F78] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center text-xs font-black">
                  {idx + 1}
                </span>
                <span>{item.title}</span>
              </h2>
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0875C9] font-bold hover:underline"
              >
                View Full Size &rarr;
              </a>
            </div>

            <div className="relative w-full h-[600px] sm:h-[800px] md:h-[950px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <Image
                src={item.src}
                alt={item.title}
                fill
                unoptimized
                className="object-contain"
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-serif font-black text-lg text-[#092F78] mb-4">
              {editingItem ? "Edit Calendar Term" : "Add Calendar Term"}
            </h3>
            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Term Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                  placeholder="e.g. Academic Calendar – Term I (June to September)"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                  placeholder="/images/school_content/... or https://..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0875C9] text-white rounded-xl font-bold hover:bg-[#0066B5]"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
