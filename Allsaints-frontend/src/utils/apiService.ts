/**
 * All Saints Public School - Node.js Express & MySQL Local Backend API Service
 * Connects Next.js Frontend & Admin CMS to the Node.js Express REST API on Port 5000
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "asps_admin_token";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

/** fetch wrapper that attaches the admin JWT (if logged in) to every API call. */
async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers || {});
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401 && token) {
    // Token expired/invalid: drop it so the UI falls back to logged-out state
    clearAdminToken();
    if (typeof window !== "undefined") {
      try {
        ["asps_admin_logged_in", "asps_admin_user", "asps_admin_last_activity", "asps_admin_login_time"].forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  }
  return res;
}

// ─── FILE / IMAGE / PDF UPLOADER ──────────────────────────────────────────
export async function apiUploadFile(file: File): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiFetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.status === "success") {
      return { success: true, url: data.url };
    }
    return { success: false, url: "", error: data.message || "Upload failed" };
  } catch (err: any) {
    return { success: false, url: "", error: err.message || "Network error" };
  }
}

// ─── AUTHENTICATION / LOGIN ───────────────────────────────────────────────
export async function apiLogin(
  username: string,
  password: string
): Promise<{ success: boolean; user?: any; message?: string }> {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  try {
    const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: cleanUser, password: cleanPass }),
    });
    const data = await res.json();
    if (res.ok && data.status === "success") {
      if (data.token) setAdminToken(data.token);
      return { success: true, user: data.user, message: data.message };
    }
    return { success: false, message: data.message || "Access denied. Only authorized school administrators are permitted to log in." };
  } catch {
    return { success: false, message: "Unable to reach the server. Please try again shortly." };
  }
}

// ─── 1. MANAGEMENT ────────────────────────────────────────────────────────
export async function apiGetManagement() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/management`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiSaveManagementMember(member: any) {
  const method = member.id && !String(member.id).startsWith("mgt-") && !isNaN(Number(member.id)) ? "PUT" : "POST";
  try {
    const res = await apiFetch(`${API_BASE_URL}/management`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteManagementMember(id: string | number, name?: string) {
  try {
    const params = new URLSearchParams();
    if (id) params.append("id", String(id));
    if (name) params.append("name", name);
    const res = await apiFetch(`${API_BASE_URL}/management?${params.toString()}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 2. PTA & SMC ─────────────────────────────────────────────────────────
export async function apiGetCommittee(type?: "PTA" | "SMC") {
  try {
    const url = type ? `${API_BASE_URL}/committee?type=${type}` : `${API_BASE_URL}/committee`;
    const res = await apiFetch(url, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveCommitteeMember(item: any) {
  const method = item.id && !String(item.id).startsWith("lead-") && !String(item.id).startsWith("exec-") && !String(item.id).startsWith("teach-") && !String(item.id).startsWith("smc-") && !isNaN(Number(item.id)) ? "PUT" : "POST";
  try {
    const res = await apiFetch(`${API_BASE_URL}/committee`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteCommitteeMember(id: number | string, name?: string) {
  try {
    const params = new URLSearchParams();
    if (id) params.append("id", String(id));
    if (name) params.append("name", name);
    const res = await apiFetch(`${API_BASE_URL}/committee?${params.toString()}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 3. FACULTY ───────────────────────────────────────────────────────────
export async function apiGetFaculty(dept?: string) {
  try {
    const url = dept ? `${API_BASE_URL}/faculty?dept=${encodeURIComponent(dept)}` : `${API_BASE_URL}/faculty`;
    const res = await apiFetch(url, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveFaculty(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/faculty`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteFaculty(id: number | string, name?: string) {
  try {
    const params = new URLSearchParams();
    if (id) params.append("id", String(id));
    if (name) params.append("name", name);
    const res = await apiFetch(`${API_BASE_URL}/faculty?${params.toString()}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 4. ANNUAL REPORTS ────────────────────────────────────────────────────
export async function apiGetAnnualReports() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/annual-reports`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveAnnualReport(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/annual-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteAnnualReport(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/annual-reports?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 5. ACHIEVEMENTS ──────────────────────────────────────────────────────
export async function apiGetAchievements(cat?: string) {
  try {
    const url = cat ? `${API_BASE_URL}/achievements?category=${encodeURIComponent(cat)}` : `${API_BASE_URL}/achievements`;
    const res = await apiFetch(url, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveAchievement(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/achievements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteAchievement(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/achievements?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 6. ENROLLMENT ────────────────────────────────────────────────────────
export async function apiGetEnrollment() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/enrollment`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveEnrollment(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/enrollment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteEnrollment(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/enrollment?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 7. FEE STRUCTURE ─────────────────────────────────────────────────────
export async function apiGetFeeStructure() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/fee-structure`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveFeeStructure(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/fee-structure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteFeeStructure(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/fee-structure?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 8. ACADEMIC CALENDAR ─────────────────────────────────────────────────
export async function apiGetCalendar() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/calendar`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveCalendarEvent(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/calendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteCalendarEvent(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/calendar?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 9. SCHOOL PARLIAMENT ─────────────────────────────────────────────────
export async function apiGetParliament(year?: string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/parliament`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiSaveParliament(item: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/parliament`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteParliament(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/parliament?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 10. RESULTS & TOPPERS ────────────────────────────────────────────────
export async function apiGetResults() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/results`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiSaveResult(result: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteResult(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/results?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 11. ONLINE ADMISSION ─────────────────────────────────────────────────
export async function apiSubmitAdmission(applicationData: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/admissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiTrackAdmission(appNo: string, pin: string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/admissions?app_no=${encodeURIComponent(appNo)}&pin=${encodeURIComponent(pin)}`);
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiGetAdmissions() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/admissions`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiUpdateAdmissionStatus(id: number, status: string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/admissions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 12. GALLERY ──────────────────────────────────────────────────────────
export async function apiGetGallery(type: "albums" | "videos" = "albums") {
  try {
    const res = await apiFetch(`${API_BASE_URL}/gallery?type=${type}`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiSaveGalleryAlbum(album: any) {
  try {
    const isUpdate = Boolean(album.id && !isNaN(Number(album.id)));
    const method = isUpdate ? "PUT" : "POST";
    const res = await apiFetch(`${API_BASE_URL}/gallery`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...album, type: "album" }),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiSaveGalleryVideo(video: any) {
  try {
    const isUpdate = Boolean(video.id && !isNaN(Number(video.id)));
    const method = isUpdate ? "PUT" : "POST";
    const res = await apiFetch(`${API_BASE_URL}/gallery`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...video, type: "video" }),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteGallery(id: number | string, type: "album" | "video" = "album") {
  try {
    const res = await apiFetch(`${API_BASE_URL}/gallery?id=${id}&type=${type}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 13. NEWS & BULLETINS ─────────────────────────────────────────────────
export async function apiGetNews(featuredOnly: boolean = false) {
  try {
    const url = featuredOnly ? `${API_BASE_URL}/news?featured=1` : `${API_BASE_URL}/news`;
    const res = await apiFetch(url, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiSaveNews(item: any) {
  const isExistingNumericId = item.id !== undefined && item.id !== null && !isNaN(Number(item.id)) && !String(item.id).startsWith("news-");
  const method = isExistingNumericId ? "PUT" : "POST";
  try {
    const res = await apiFetch(`${API_BASE_URL}/news`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteNews(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/news?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 14. STATUTORY DOCUMENTS ──────────────────────────────────────────────
export async function apiGetDocuments() {
  try {
    const res = await apiFetch(`${API_BASE_URL}/documents`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiSaveDocument(doc: any) {
  const method = doc.id && !String(doc.id).startsWith("doc-") && !isNaN(Number(doc.id)) ? "PUT" : "POST";
  try {
    const res = await apiFetch(`${API_BASE_URL}/documents`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteDocument(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/documents?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 15. GRIEVANCES & COMPLAINTS ──────────────────────────────────────────
export async function apiSubmitGrievance(grievance: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(grievance),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiGetGrievances(ticketNo?: string) {
  try {
    const url = ticketNo ? `${API_BASE_URL}/complaints?ticket=${encodeURIComponent(ticketNo)}` : `${API_BASE_URL}/complaints`;
    const res = await apiFetch(url, { cache: "no-store" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiUpdateGrievanceStatus(id: number, status: string, resolution_notes?: string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/complaints`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, resolution_notes }),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 16. CONTACT & ENQUIRIES ──────────────────────────────────────────────
export async function apiSubmitContact(inquiry: any) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiGetContacts(type?: string) {
  try {
    const url = type ? `${API_BASE_URL}/contact?type=${encodeURIComponent(type)}` : `${API_BASE_URL}/contact`;
    const res = await apiFetch(url, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : [];
  } catch {
    return [];
  }
}

export async function apiUpdateContactStatus(id: number, status: string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteContact(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/contact?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── 17. HERO CAMPUS SLIDES ───────────────────────────────────────────────
export interface EditableHeroSlide {
  id?: number | string;
  image_url: string;
  title: string;
  caption?: string;
  display_order?: number;
  is_active?: boolean | number;
}

export async function apiGetHeroSlides(): Promise<EditableHeroSlide[] | null> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/hero-slides`, { cache: "no-store" });
    const json = await res.json();
    return json.status === "success" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiSaveHeroSlide(slide: EditableHeroSlide) {
  const isExistingNumericId = slide.id !== undefined && slide.id !== null && !isNaN(Number(slide.id));
  const method = isExistingNumericId ? "PUT" : "POST";
  try {
    const res = await apiFetch(`${API_BASE_URL}/hero-slides`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slide),
    });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export async function apiDeleteHeroSlide(id: number | string) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/hero-slides?id=${id}`, { method: "DELETE" });
    return await res.json();
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

// ─── ALIASES FOR COMPONENT IMPORT CONVENIENCE ─────────────────────────────
export const apiGetAcademicCalendar = apiGetCalendar;
export const apiSaveParliamentMember = apiSaveParliament;
export const apiDeleteParliamentMember = apiDeleteParliament;
export const apiGetComplaints = apiGetGrievances;
export const apiSaveComplaint = apiSubmitGrievance;
export const apiDeleteComplaint = apiDeleteContact;
export const apiGetContactEnquiries = apiGetContacts;
export const apiSaveContactEnquiry = apiSubmitContact;
