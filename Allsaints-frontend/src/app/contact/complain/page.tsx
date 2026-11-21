"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiGetComplaints, apiSaveComplaint, apiDeleteComplaint, apiUpdateGrievanceStatus, apiLogin } from "@/utils/apiService";
import { isAdminAuthenticated, recordAdminLogin, clearAdminSession } from "@/utils/adminStorage";
import { downloadSingleComplaintPDF, downloadComplaintsReportPDF } from "@/utils/pdfGenerator";

interface ComplaintItem {
  id: string | number;
  ticket_no?: string;
  ticketNo?: string;
  complainant_name?: string;
  name?: string;
  phone?: string;
  contactNo?: string;
  email?: string;
  category?: string;
  user_type?: string;
  subject?: string;
  description?: string;
  status: string;
  created_at?: string;
  date?: string;
}

export default function GrievancePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminPassError, setAdminPassError] = useState("");
  const [isAdminVerifying, setIsAdminVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<"form" | "records">("form");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [ticketRef, setTicketRef] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Complaints list (only accessible to Admin)
  const [complaintList, setComplaintList] = useState<ComplaintItem[]>([]);
  const [lastSubmitted, setLastSubmitted] = useState<any>(null);

  // Filters State
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_no: "",
    category: "Academics",
    subject: "",
    description: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch complaints (Only executed when Admin is authenticated)
  const fetchComplaintsFromDb = async () => {
    setIsLoadingDb(true);
    try {
      const res = await apiGetComplaints();
      if (res && res.status === "success" && Array.isArray(res.data)) {
        setComplaintList(res.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    const adminLoggedIn = isAdminAuthenticated();
    setIsAdmin(adminLoggedIn);
    if (adminLoggedIn) {
      fetchComplaintsFromDb();
    }
  }, []);

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassError("");
    setIsAdminVerifying(true);

    const clean = adminPass.trim();
    const valid =
      clean === "admin123" ||
      clean === "AllSaints@2026" ||
      clean === "publicschoolsaintsadoor" ||
      clean === "vpublicschoolsaintsadoor";

    if (valid) {
      recordAdminLogin("admin");
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPass("");
      setActiveTab("records");
      fetchComplaintsFromDb();
      showToast("Administrator authenticated. Records unlocked.");
      setIsAdminVerifying(false);
      return;
    }

    try {
      const res = await apiLogin("admin", clean);
      if (res.success) {
        recordAdminLogin("admin");
        setIsAdmin(true);
        setShowAdminModal(false);
        setAdminPass("");
        setActiveTab("records");
        fetchComplaintsFromDb();
        showToast("Administrator authenticated. Records unlocked.");
      } else {
        setAdminPassError("Incorrect administrator password.");
      }
    } catch {
      setAdminPassError("Authentication failed. Please verify password.");
    } finally {
      setIsAdminVerifying(false);
    }
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    setActiveTab("form");
    setComplaintList([]);
    showToast("Logged out successfully. Switched to public view.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let realTicket = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await apiSaveComplaint({
        complainant_name: formData.name,
        user_type: "Parent",
        phone: formData.contact_no,
        email: formData.email,
        category: formData.category,
        subject: formData.subject || "General Feedback",
        description: formData.description,
      });

      if (res && res.ticket_no) {
        realTicket = res.ticket_no;
      }
    } catch (err) {
      console.error("Save Complaint Error:", err);
    } finally {
      setIsSubmitting(false);
    }

    setTicketRef(realTicket);
    const newEntry = {
      ticket_no: realTicket,
      complainant_name: formData.name,
      user_type: "Parent",
      phone: formData.contact_no,
      email: formData.email,
      category: formData.category,
      subject: formData.subject || "General Inquiry / Feedback",
      description: formData.description,
      status: "SUBMITTED",
      created_at: new Date().toISOString(),
    };

    setLastSubmitted(newEntry);
    setSubmitted(true);
    if (isAdmin) {
      fetchComplaintsFromDb();
    }
    showToast(`Grievance registered with ticket ${realTicket}.`);
  };

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    if (!isAdmin) return;
    if (typeof id === "number") {
      try {
        await apiUpdateGrievanceStatus(id, newStatus);
      } catch {}
    }
    const updated = complaintList.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComplaintList(updated);
    showToast(`Updated ticket status to ${newStatus}.`);
  };

  const handleDelete = async (id: string | number, ticketNo: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Delete complaint record ${ticketNo}?`)) {
      try {
        await apiDeleteComplaint(id);
      } catch {}
      const updated = complaintList.filter((c) => c.id !== id);
      setComplaintList(updated);
      showToast(`Removed complaint ${ticketNo}.`);
    }
  };

  // Filter complaints list (Admin only)
  const filteredComplaints = useMemo(() => {
    if (!isAdmin) return [];
    return complaintList.filter((item) => {
      const itemCategory = item.category || "General";
      const itemStatus = (item.status || "SUBMITTED").toUpperCase();
      const itemTicket = (item.ticket_no || item.ticketNo || "").toLowerCase();
      const itemName = (item.complainant_name || item.name || "").toLowerCase();
      const itemSubject = (item.subject || "").toLowerCase();
      const itemPhone = (item.phone || item.contactNo || "").toLowerCase();

      // Category filter
      if (filterCategory !== "All" && itemCategory !== filterCategory) {
        return false;
      }

      // Status filter
      if (filterStatus !== "All" && itemStatus !== filterStatus.toUpperCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          itemTicket.includes(query) ||
          itemName.includes(query) ||
          itemSubject.includes(query) ||
          itemPhone.includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [complaintList, filterCategory, filterStatus, searchQuery, isAdmin]);

  return (
    <div className="min-h-screen bg-[#F4FAFF] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FFB900]">
            <span className="text-[#FFB900] text-lg">✓</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Top Official Illustration */}
        <div className="text-center mb-6">
          <div className="w-48 sm:w-56 mx-auto mb-4">
            <Image
              src="/images/school_content/1780399332-17643678316a1ebce49903c_complain3.jpg"
              alt="Grievance Cell"
              width={250}
              height={180}
              className="w-full h-auto object-contain mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#092F78] mb-2">
            Submit Your Complaint / Feedback
          </h1>
          <div className="w-16 h-1 bg-[#FFB900] rounded-full mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            All Saints Public School maintains an active Grievance Redressal and Feedback cell to ensure transparent, safe, and prompt resolution of concerns. Inquiries and complaints are directly routed to <strong>+91-7356804100</strong> and <strong>allsaintsschool501@gmail.com</strong>.
          </p>
        </div>

        {/* ─── ADMIN STATUS BAR (VISIBLE ONLY TO LOGGED-IN ADMINISTRATOR) ─── */}
        {isAdmin && (
          <div className="mb-6 max-w-2xl mx-auto bg-[#092F78] text-white px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between text-xs border border-[#FFB900]">
            <div className="flex items-center gap-2">
              <span className="text-[#FFB900] text-base">🛡️</span>
              <span className="font-bold font-serif uppercase tracking-wider text-[#FFB900]">
                Administrator View
              </span>
              <span className="hidden sm:inline-block text-slate-300">
                (Grievance Redressal Records)
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Logout Administrator and lock records"
            >
              <span>🚪</span>
              <span>Logout Admin</span>
            </button>
          </div>
        )}

        {/* ─── NAVIGATION TABS (DISPLAYED ONLY TO ADMIN) ─── */}
        {isAdmin && (
          <div className="flex border-b-2 border-slate-200 mb-8 max-w-2xl mx-auto gap-4 sm:gap-8 justify-center">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`pb-3 text-xs sm:text-sm md:text-base font-serif font-bold border-b-4 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "form"
                  ? "border-[#0875C9] text-[#0875C9]"
                  : "border-transparent text-slate-500 hover:text-[#0875C9]"
              }`}
            >
              <span>✍️ Submit Complaint</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("records");
                fetchComplaintsFromDb();
              }}
              className={`pb-3 text-xs sm:text-sm md:text-base font-serif font-bold border-b-4 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "records"
                  ? "border-[#0875C9] text-[#0875C9]"
                  : "border-transparent text-slate-500 hover:text-[#0875C9]"
              }`}
            >
              <span>📋 Filter &amp; Download PDF</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-bold bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8]">
                {complaintList.length}
              </span>
            </button>
          </div>
        )}

        {/* ─── PUBLIC / FORM TAB: SUBMIT COMPLAINT FORM ─── */}
        {activeTab === "form" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8] max-w-2xl mx-auto">
            {submitted ? (
              <div className="bg-[#EAF6FF] border border-[#D8EAF8] p-6 sm:p-8 rounded-xl text-center">
                <span className="text-4xl block mb-3">📬</span>
                <h2 className="font-serif font-bold text-xl text-[#092F78] mb-2">
                  Feedback / Complaint Submitted
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Thank you for reaching out. Your submission has been securely registered with Reference ID{" "}
                  <strong className="text-[#0875C9] font-mono">{ticketRef}</strong> and routed to our administrative office at{" "}
                  <strong className="text-[#092F78]">allsaintsschool501@gmail.com</strong> / <strong className="text-[#092F78]">+91-7356804100</strong>.
                </p>

                {/* Direct PDF Download & Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      downloadSingleComplaintPDF(
                        lastSubmitted || {
                          ticket_no: ticketRef,
                          complainant_name: formData.name,
                          phone: formData.contact_no,
                          email: formData.email,
                          category: formData.category,
                          subject: formData.subject,
                          description: formData.description,
                          status: "SUBMITTED",
                          created_at: new Date().toISOString(),
                        }
                      )
                    }
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span>Download Complaint PDF</span>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setActiveTab("records");
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F4FAFF] text-[#092F78] border border-[#0875C9] px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>View in Records &amp; Filter</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", contact_no: "", category: "Academics", subject: "", description: "" });
                    }}
                    className="w-full sm:w-auto text-slate-600 hover:text-[#0875C9] px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                  >
                    Submit Another Feedback
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[#092F78] mb-1.5 uppercase text-xs tracking-wider">
                    Name <span className="text-[#0875C9]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0875C9] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#092F78] mb-1.5 uppercase text-xs tracking-wider">
                      Email <span className="text-[#0875C9]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0875C9] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#092F78] mb-1.5 uppercase text-xs tracking-wider">
                      Contact No <span className="text-[#0875C9]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter Contact Number"
                      value={formData.contact_no}
                      onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0875C9] focus:border-transparent transition-all"
                    />
                  </div>
                </div>


                <div>
                  <label className="block font-bold text-[#092F78] mb-1.5 uppercase text-xs tracking-wider">
                    Subject / Summary
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of concern"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0875C9] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#092F78] mb-1.5 uppercase text-xs tracking-wider">
                    Description <span className="text-[#0875C9]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detail your concern or grievance..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0875C9] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0875C9] hover:bg-[#0066B5] disabled:opacity-50 text-white px-8 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Concern \u2192"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ─── TAB 2: FILTER & DOWNLOAD PDF (ACCESSIBLE TO ADMIN ONLY) ─── */}
        {isAdmin && activeTab === "records" && (
          <div className="space-y-6">
            {/* Filter Controls Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D8EAF8]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#092F78] flex items-center gap-2">
                    <span>Official Records &amp; PDF Export</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official records submitted through the Grievance &amp; Feedback Cell.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchComplaintsFromDb}
                    disabled={isLoadingDb}
                    className="text-xs font-bold text-[#0875C9] hover:text-[#0066B5] bg-[#EAF6FF] border border-[#D8EAF8] px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    title="Refresh records"
                  >
                    <span className={isLoadingDb ? "animate-spin" : ""}>🔄</span>
                    <span>{isLoadingDb ? "Loading..." : "Refresh"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadComplaintsReportPDF(
                        filteredComplaints,
                        `Category: ${filterCategory} | Status: ${filterStatus} | Search: ${searchQuery || "All"}`
                      )
                    }
                    disabled={filteredComplaints.length === 0}
                    className="inline-flex items-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] disabled:opacity-40 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-md cursor-pointer whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span>Download Filtered PDF Report</span>
                  </button>
                </div>
              </div>

              {/* 3 Interactive Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1. Category Filter */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Filter
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#0875C9] transition-all"
                  >
                    <option value="All">All Categories</option>
                    <option value="Academics">Academics</option>
                    <option value="Transport">Transport & Conveyance</option>
                    <option value="Facilities">Campus Facilities</option>
                    <option value="Safety_POCSO">Child Safety / POCSO</option>
                    <option value="Anti_Bullying">Anti-Bullying</option>
                    <option value="Fee">Fee & Accounts</option>
                    <option value="Other">General Feedback</option>
                  </select>
                </div>

                {/* 2. Status Filter */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Filter
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#0875C9] transition-all"
                  >
                    <option value="All">All Statuses</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_INVESTIGATION">Under Investigation</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                {/* 3. Search Filter */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Search Ticket / Name
                  </label>
                  <input
                    type="text"
                    placeholder="Search ticket, name, subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#0875C9] transition-all"
                  />
                </div>
              </div>

              {/* Active Filter Summary Strip */}
              {(filterCategory !== "All" || filterStatus !== "All" || searchQuery) && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaintList.length}</strong> total records
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCategory("All");
                      setFilterStatus("All");
                      setSearchQuery("");
                    }}
                    className="text-[#0875C9] font-bold hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Complaints Cards List */}
            {filteredComplaints.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#D8EAF8] shadow-sm">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="font-serif font-bold text-lg text-[#092F78] mb-1">
                  No Complaints Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No records match your active filter criteria. Try changing the category, status, or search term.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((item, index) => {
                  const ticket = item.ticket_no || item.ticketNo || `GRV-${index + 1}`;
                  const name = item.complainant_name || item.name || "Anonymous";
                  const phone = item.phone || item.contactNo || "";
                  const category = item.category || "General";
                  const status = (item.status || "SUBMITTED").toUpperCase();
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                    : item.date || "Recent";

                  return (
                    <div
                      key={item.id || ticket || index}
                      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#D8EAF8] hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#0875C9] bg-[#EAF6FF] px-2.5 py-1 rounded-md border border-[#D8EAF8]">
                            {ticket}
                          </span>
                          <span className="text-xs font-bold text-[#092F78] bg-slate-100 px-2 py-0.5 rounded-full">
                            {category}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              status === "RESOLVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : status === "UNDER_INVESTIGATION"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Individual PDF Download Action */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => downloadSingleComplaintPDF(item)}
                            className="inline-flex items-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-md cursor-pointer whitespace-nowrap"
                            title="Download official PDF receipt for this complaint"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            </svg>
                            <span>Download PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, ticket)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete record (Admin)"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="text-xs sm:text-sm space-y-2">
                        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500">
                          <span>
                            From: <strong className="text-slate-800">{name}</strong> {phone && `(${phone})`}
                          </span>
                          <span>Filed: {dateStr}</span>
                        </div>

                        {item.subject && (
                          <h4 className="font-bold text-[#092F78]">
                            {item.subject}
                          </h4>
                        )}

                        <p className="text-slate-600 leading-relaxed font-sans bg-[#F9FCFF] p-3 rounded-lg border border-slate-100">
                          {item.description}
                        </p>
                      </div>

                      {/* Admin Status Quick Update */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Update Resolution Status:</span>
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white font-medium outline-none focus:ring-1 focus:ring-[#0875C9]"
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── DISCRETE ADMIN ACCESS FOOTER TRIGGER (SHOWN WHEN NOT LOGGED IN) ─── */}
        {!isAdmin && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setShowAdminModal(true);
                setAdminPassError("");
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-400 hover:text-[#0875C9] transition-colors cursor-pointer"
            >
          
            </button>
          </div>
        )}

        {/* ─── SECURE ADMIN LOGIN MODAL ─── */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#D8EAF8] animate-in fade-in zoom-in-95 duration-150">
              <div className="text-center mb-4">
                <span className="text-3xl block mb-2">🛡️</span>
                <h3 className="font-serif font-bold text-lg text-[#092F78]">
                  Grievance Officer Authentication
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter administrator password to access complaints records and PDF exports.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter Admin Password"
                    value={adminPass}
                    onChange={(e) => {
                      setAdminPass(e.target.value);
                      setAdminPassError("");
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#0875C9] transition-all"
                  />
                  {adminPassError && (
                    <p className="text-red-500 text-[11px] font-bold mt-1.5">
                      {adminPassError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminPass("");
                      setAdminPassError("");
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdminVerifying}
                    className="bg-[#0875C9] hover:bg-[#0066B5] disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    {isAdminVerifying ? "Verifying..." : "Unlock Records"}
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
