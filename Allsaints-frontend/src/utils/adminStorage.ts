/**
 * Admin Storage and Persistence Manager for All Saints Public School CMS
 * Manages local persistence for Management, Documents, News, Results, and Gallery.
 */

import { STATUTORY_DOCUMENTS } from "@/constants";

// ─── 1. MANAGEMENT ─────────────────────────────────────────────────────────
export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  subRole?: string;
  image: string;
  quote?: string;
  bio?: string;
  order: number;
}

export const DEFAULT_MANAGEMENT: ManagementMember[] = [
  {
    id: "1",
    name: "His Excellency Most Rev. Dr. Samuel Mar Irenios",
    role: "Patron & President",
    subRole: "Bishop of Pathanamthitta Diocese",
    image: "/images/management/patron.jpg",
    quote: "To create creators of tomorrow — empowering young minds with divine wisdom, moral excellence, and academic distinction.",
    bio: "President of The Malankara Catholic Educational Society of the Diocese of Pathanamthitta.",
    order: 1,
  },
  {
    id: "2",
    name: "His Excellency Most Rev. Yoohanon Mar Chrysostom",
    role: "Former Patron",
    subRole: "Bishop Emeritus, Diocese of Pathanamthitta",
    image: "/images/management/former-patron.jpg",
    quote: "Guided the school with steadfast faith, laying foundations of academic rigor, character building, and holistic education.",
    bio: "Blessings that fostered generations of students since the inception of All Saints Public School in June 2002.",
    order: 2,
  },
  {
    id: "3",
    name: "Rev. Fr. Thomas Kumbakattil",
    role: "Founder Manager",
    subRole: "Founder & Spiritual Architect",
    image: "/images/management/founder-manager.jpg",
    quote: "Dedicated to holistic education that illuminates minds and uplifts rural communities.",
    bio: "Founded the institution in June 2002 under the blessings of Moran Mor Cyril Baselios Catholicose.",
    order: 3,
  },
  {
    id: "4",
    name: "Rev. Dr. James (Joseph) Stephen Olikal",
    role: "Principal",
    subRole: "Academic & Administrative Head",
    image: "/images/management/principal.jpg",
    quote: "Excellence in academics goes hand in hand with integrity, moral fortitude, and compassionate service.",
    bio: "Steering the faculty and student body toward continuous 100% CBSE board achievement.",
    order: 4,
  },
  {
    id: "5",
    name: "Fr. Philipose Charivupurayidathil (Jobin C Kurian)",
    role: "Director",
    subRole: "Institutional Director",
    image: "/images/management/director.jpg",
    quote: "Committed to providing world-class infrastructure and student-centered growth environments.",
    bio: "Guiding modern development, laboratory advancements, and campus operations.",
    order: 5,
  },
];

// ─── 2. STATUTORY DOCUMENTS ────────────────────────────────────────────────
export interface EditableDocument {
  id: string;
  slug: string;
  order: number;
  label: string;
  title: string;
  authority: string;
  status: string;
  desc: string;
  pdfUrls: string[];
  validUntil?: string;
  isPublic?: boolean;
}

export const DEFAULT_DOCUMENTS: EditableDocument[] = STATUTORY_DOCUMENTS.map((doc, idx) => ({
  id: `doc-${doc.slug || idx}`,
  slug: doc.slug,
  order: doc.order || idx + 1,
  label: doc.label,
  title: doc.title,
  authority: doc.authority,
  status: doc.status || "Verified & Submitted",
  desc: doc.desc,
  pdfUrls: doc.pdfUrls || [],
  validUntil: "2028-03-31",
  isPublic: true,
}));

// ─── 3. NEWS & BULLETINS ───────────────────────────────────────────────────
export interface EditableNews {
  id: string;
  title: string;
  date: string;
  category: "Official Notice" | "Press Release" | "Board Result" | "Campus Event" | "General";
  excerpt: string;
  image: string;
  videoUrl?: string;
  isFeatured?: boolean;
  published: boolean;
}

export const DEFAULT_NEWS: EditableNews[] = [
  {
    id: "1",
    title: "Triumph of Excellence: Class XII CBSE Results 2026",
    date: "2026-05-20",
    category: "Board Result",
    excerpt: "All Saints Public School secures 100% pass rate in the CBSE Senior School Certificate Examination (Class XII) 2026, with an extraordinary tally of full A1 grades and school toppers across Science and Commerce streams.",
    image: "/images/school_content/1773902602-199036049569bb9b0a252c9_news.jpg",
    isFeatured: true,
    published: true,
  },
  {
    id: "2",
    title: "Class X CBSE Results 2026: A Legacy of Academic Excellence Continued",
    date: "2026-04-30",
    category: "Board Result",
    excerpt: "We are immensely proud to announce 100% pass results in the Secondary School Examination (Class X) 2026, upholding our enduring tradition of academic dedication, discipline, and holistic excellence.",
    image: "/images/school_content/class-x-results-2026.png",
    isFeatured: false,
    published: true,
  },
  {
    id: "3",
    title: "Admissions Open for Pre-Primary to Class XII (Session 2026-27)",
    date: "2026-03-15",
    category: "Official Notice",
    excerpt: "Admissions are officially open for academic session 2026-27. Enroll your child in a vibrant CBSE atmosphere combining high scholastic rigor, smart digital classrooms, and state-of-the-art sports academies.",
    image: "/images/infrastructure/infra-campus.jpg",
    isFeatured: false,
    published: true,
  },
  {
    id: "news-4",
    title: "Annual Sports Day & Cultural Fest 2026 – Grand Celebrations",
    date: "10-02-2026",
    category: "Campus Event",
    excerpt: "A splendid showcase of athletic endurance, sportsmanship, and cultural artistry at the All Saints Central Sports Arena with over 800 student participants.",
    image: "/images/gallery/event-5.jpg",
    isFeatured: false,
    published: true,
  },
];

// ─── 4. BOARD RESULTS ──────────────────────────────────────────────────────
export interface EditableResult {
  id: string;
  classLevel: "Class X" | "Class XII";
  year: string;
  registered: number;
  passed: number;
  percentage: string;
  remarks: string;
  topperName?: string;
  topperScore?: string;
  topperImage?: string;
}

export const DEFAULT_RESULTS: EditableResult[] = [
  // Class X
  {
    id: "res-x-2024",
    classLevel: "Class X",
    year: "2024",
    registered: 89,
    passed: 89,
    percentage: "100%",
    remarks: "100% Centum Pass - 28 Full A1s",
    topperName: "Class X Topper Roll",
    topperScore: "99.2%",
    topperImage: "/images/school_content/revaluation-a1-toppers.png",
  },
  {
    id: "res-x-2023",
    classLevel: "Class X",
    year: "2023",
    registered: 110,
    passed: 110,
    percentage: "100%",
    remarks: "100% Pass Record",
  },
  {
    id: "res-x-2022",
    classLevel: "Class X",
    year: "2022",
    registered: 96,
    passed: 96,
    percentage: "100%",
    remarks: "100% Pass Record",
  },
  // Class XII
  {
    id: "res-xii-2024",
    classLevel: "Class XII",
    year: "2024",
    registered: 15,
    passed: 15,
    percentage: "100%",
    remarks: "100% Pass - State Rank Honors",
    topperName: "Science & Commerce Toppers",
    topperScore: "98.8%",
    topperImage: "/images/school_content/revaluation-a1-toppers.png",
  },
  {
    id: "res-xii-2023",
    classLevel: "Class XII",
    year: "2023",
    registered: 49,
    passed: 49,
    percentage: "100%",
    remarks: "100% Centum Pass",
  },
  {
    id: "res-xii-2022",
    classLevel: "Class XII",
    year: "2022",
    registered: 30,
    passed: 30,
    percentage: "100%",
    remarks: "100% Pass Record",
  },
];

// ─── STORAGE ACCESSORS WITH SAFE FALLBACKS & LOCAL MYSQL DB SYNC ───────────

import {
  apiGetManagement,
  apiSaveManagementMember,
  apiGetNews,
  apiSaveNews,
  apiGetDocuments,
  apiSaveDocument,
  apiGetResults,
  apiSaveResult,
} from "./apiService";

export function getStoredManagement(): ManagementMember[] {
  if (typeof window === "undefined") return DEFAULT_MANAGEMENT;
  try {
    const data = localStorage.getItem("asps_management_members");
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_MANAGEMENT;
}

export function saveStoredManagement(members: ManagementMember[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("asps_management_members", JSON.stringify(members));

  // Sync to Local MySQL Database via Node/Express Backend
  members.forEach((m) => {
    apiSaveManagementMember({
      id: m.id && !String(m.id).startsWith("mgt-") && !isNaN(Number(m.id)) ? Number(m.id) : undefined,
      name: m.name,
      role: m.role,
      sub_role: m.subRole || null,
      photo_url: m.image,
      quote: m.quote || null,
      bio: m.bio || null,
      display_order: m.order,
      is_patron: m.role.toLowerCase().includes("patron") ? 1 : 0,
    }).catch(() => {});
  });
}

export function getStoredDocuments(): EditableDocument[] {
  if (typeof window === "undefined") return DEFAULT_DOCUMENTS;
  try {
    const data = localStorage.getItem("asps_statutory_documents");
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_DOCUMENTS;
}

export function saveStoredDocuments(docs: EditableDocument[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("asps_statutory_documents", JSON.stringify(docs));

  // Sync to Local MySQL Database via PHP Backend
  docs.forEach((d) => {
    apiSaveDocument({
      id: d.id,
      title: d.title,
      category: d.label || "Mandatory Disclosure",
      doc_number: d.slug,
      issuing_authority: d.authority,
      valid_until: d.validUntil || "2028-03-31",
      compliance_status: d.status,
      file_url: d.pdfUrls?.[0] || "/documents/cbse-affiliation.pdf",
      file_type: "PDF",
      description: d.desc,
      display_order: d.order,
    }).catch(() => {});
  });
}

export function getStoredNews(): EditableNews[] {
  if (typeof window === "undefined") return DEFAULT_NEWS;
  try {
    const data = localStorage.getItem("asps_school_news");
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_NEWS;
}

export function saveStoredNews(news: EditableNews[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("asps_school_news", JSON.stringify(news));

  // Sync to Local MySQL Database via PHP Backend
  // Background sync is handled directly by form submit handlers with live feedback
  if (false) news.forEach((n) => {
    apiSaveNews({
      id: n.id,
      title: n.title,
      category: n.category,
      publish_date: n.date,
      excerpt: n.excerpt,
      image_url: n.image,
      video_url: n.videoUrl || null,
      is_featured: n.isFeatured ? 1 : 0,
      is_published: n.published ? 1 : 0,
    }).catch(() => {});
  });
}

export function getStoredResults(): EditableResult[] {
  if (typeof window === "undefined") return DEFAULT_RESULTS;
  try {
    const data = localStorage.getItem("asps_board_results");
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_RESULTS;
}

export function saveStoredResults(results: EditableResult[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("asps_board_results", JSON.stringify(results));

  // Sync to Local MySQL Database via PHP Backend
  results.forEach((r) => {
    apiSaveResult({
      id: r.id,
      academic_year: r.year,
      standard: r.classLevel,
      total_registered: r.registered,
      total_passed: r.passed,
      pass_percentage: parseFloat(String(r.percentage).replace("%", "")) || 100,
      remarks: r.remarks,
      toppers: r.topperName
        ? [
            {
              student_name: r.topperName,
              percentage: parseFloat(String(r.topperScore).replace("%", "")) || 98.5,
              photo_url: r.topperImage || null,
            },
          ]
        : [],
    }).catch(() => {});
  });
}

/**
 * Fetch fresh data directly from Local MySQL database and update cache
 */
export async function syncAllFromLocalDb(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    // 1. Management
    const dbMgt = await apiGetManagement();
    if (dbMgt && Array.isArray(dbMgt) && dbMgt.length > 0) {
      const mapped: ManagementMember[] = dbMgt.map((m: any) => ({
        id: String(m.id),
        name: m.name,
        role: m.role,
        subRole: m.sub_role || "",
        image: m.photo_url || "/images/management/principal.jpg",
        quote: m.quote || "",
        bio: m.bio || "",
        order: Number(m.display_order) || 1,
      }));
      localStorage.setItem("asps_management_members", JSON.stringify(mapped));
    }

    // 2. News
    const dbNews = await apiGetNews();
    if (dbNews && Array.isArray(dbNews) && dbNews.length > 0) {
      const mappedNews: EditableNews[] = dbNews.map((n: any) => ({
        id: String(n.id),
        title: n.title,
        date: n.publish_date,
        category: n.category,
        excerpt: n.excerpt,
        image: n.image_url || "",
        videoUrl: n.video_url || "",
        isFeatured: Boolean(n.is_featured),
        published: Boolean(n.is_published),
      }));
      localStorage.setItem("asps_school_news", JSON.stringify(mappedNews));
    }
  } catch {}
}

// ─── 6. ADMIN SESSION & AUTO-LOGOUT (10 MINUTE TIMEOUT) ───────────────────
export const ADMIN_SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

export function recordAdminLogin(userEmailOrName: string) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  localStorage.setItem("asps_admin_logged_in", "true");
  localStorage.setItem("asps_admin_user", userEmailOrName.trim());
  localStorage.setItem("asps_admin_last_activity", String(now));
  localStorage.setItem("asps_admin_login_time", String(now));
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("asps_admin_logged_in");
  localStorage.removeItem("asps_admin_user");
  localStorage.removeItem("asps_admin_last_activity");
  localStorage.removeItem("asps_admin_login_time");
  localStorage.removeItem("asps_admin_token");
}

export function updateAdminActivity() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("asps_admin_logged_in") === "true") {
    localStorage.setItem("asps_admin_last_activity", String(Date.now()));
  }
}

export function getAdminRemainingTimeMs(): number {
  if (typeof window === "undefined") return 0;
  if (localStorage.getItem("asps_admin_logged_in") !== "true") return 0;
  const lastActivityStr = localStorage.getItem("asps_admin_last_activity");
  if (!lastActivityStr) return ADMIN_SESSION_TIMEOUT_MS;
  const elapsed = Date.now() - Number(lastActivityStr);
  const remaining = ADMIN_SESSION_TIMEOUT_MS - elapsed;
  return remaining > 0 ? remaining : 0;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const isLoggedIn = localStorage.getItem("asps_admin_logged_in") === "true";
  if (!isLoggedIn) return false;
  // A valid server-issued token is required; stale flags without one are cleared
  if (!localStorage.getItem("asps_admin_token")) { clearAdminSession(); return false; }

  const lastActivityStr = localStorage.getItem("asps_admin_last_activity");
  if (!lastActivityStr) {
    localStorage.setItem("asps_admin_last_activity", String(Date.now()));
    return true;
  }

  const elapsed = Date.now() - Number(lastActivityStr);
  if (elapsed > ADMIN_SESSION_TIMEOUT_MS) {
    // 10 minutes exceeded: auto-logout
    clearAdminSession();
    return false;
  }

  return true;
}

/**
 * Sets up activity event listeners and a periodic interval to automatically
 * logout the administrator after 10 minutes of inactivity.
 * Returns a cleanup function.
 */
export function setupAdminAutoLogout(onTimeout?: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  let lastThrottledUpdate = Date.now();

  const handleUserActivity = () => {
    const now = Date.now();
    if (now - lastThrottledUpdate > 5000) {
      lastThrottledUpdate = now;
      updateAdminActivity();
    }
  };

  const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
  activityEvents.forEach((evt) => {
    window.addEventListener(evt, handleUserActivity, { passive: true });
  });

  const intervalId = setInterval(() => {
    if (!isAdminAuthenticated()) {
      clearAdminSession();
      if (onTimeout) {
        onTimeout();
      }
    }
  }, 10000);

  return () => {
    activityEvents.forEach((evt) => {
      window.removeEventListener(evt, handleUserActivity);
    });
    clearInterval(intervalId);
  };
}
