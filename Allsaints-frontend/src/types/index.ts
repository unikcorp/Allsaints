// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface Stat {
  value: string;
  label: string;
  icon: string;
}

// ─── Feature / Why Choose Us ─────────────────────────────────────────────────
export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

// ─── Academics ───────────────────────────────────────────────────────────────
export type AcademicLevel = "primary" | "secondary" | "higher";

export interface AcademicProgram {
  id: AcademicLevel;
  label: string;
  grades: string;
  description: string;
  subjects: string[];
  image?: string;
}

// ─── Testimonials ────────────────────────────────────────────────────────────
export interface Testimonial {
  id: number;
  name: string;
  role: string;         // e.g. "Parent of Class 10 student"
  quote: string;
  avatar?: string;
  rating: number;
}

// ─── News / Events ───────────────────────────────────────────────────────────
export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: "news" | "event" | "result" | "notice";
  image?: string;
  slug: string;
}

// ─── Facility ────────────────────────────────────────────────────────────────
export interface Facility {
  id: number;
  name: string;
  description: string;
  icon: string;
  image?: string;
  detailedDescription?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
}

// ─── Achievement ─────────────────────────────────────────────────────────────
export interface Achievement {
  id: number;
  year: string;
  title: string;
  description: string;
  icon?: string;
}

// ─── Video Gallery ───────────────────────────────────────────────────────────
export interface SchoolVideo {
  id: string;
  title: string;
  category: "Sports & Athletics" | "Annual Day & Fests" | "Campus Life & Ceremonies" | "Clubs & Academics";
  embedUrl: string;
  youtubeUrl: string;
  localVideoPath?: string;
}

// ─── Statutory CBSE Documents ────────────────────────────────────────────────
export interface StatutoryDocument {
  slug: string;
  order: number;
  label: string;
  title: string;
  authority: string;
  status: string;
  desc: string;
  pdfUrls: string[];
}

// ─── CMS (Strapi) API Response wrapper ───────────────────────────────────────
export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
