"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isAdminAuthenticated } from "@/utils/adminStorage";
import { apiGetAnnualReports, apiSaveAnnualReport, apiUploadFile } from "@/utils/apiService";

export interface AnnualReportData {
  academicYear: string;
  title: string;
  summary: string;
  pdfUrl: string;
}

const DEFAULT_REPORT: AnnualReportData = {
  academicYear: "2024-2025",
  title: "Annual Report 2024-2025",
  summary:
    "Official Annual School Progress Report covering 100% CBSE board results, scholastic achievements, student co-curricular activities, teacher enrichment programs, and infrastructure advancements submitted for CBSE OASIS verification.",
  pdfUrl: "/documents/annual-report-2024-25.pdf",
};

export default function AnnualReportPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [report, setReport] = useState<AnnualReportData>(DEFAULT_REPORT);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<AnnualReportData>(DEFAULT_REPORT);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    document.title = "Annual Report 2024-2025 | All Saints Public School, Adoor";
    setIsAdmin(isAdminAuthenticated());

    try {
      const saved = localStorage.getItem("asps_annual_report_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure legacy placeholder 2025-2026 data gets updated to the official 2024-2025 report
        if (parsed.academicYear === "2025-2026" || parsed.pdfUrl?.includes("2025-26")) {
          setReport(DEFAULT_REPORT);
          localStorage.setItem("asps_annual_report_data", JSON.stringify(DEFAULT_REPORT));
        } else {
          setReport(parsed);
        }
      }
    } catch {}

    // Fetch live from MySQL Database / Backend API
    apiGetAnnualReports().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        const mapped: AnnualReportData = {
          academicYear: latest.academic_year || "2024-2025",
          title: latest.title || "Annual Report 2024-2025",
          summary: latest.summary || DEFAULT_REPORT.summary,
          pdfUrl: latest.pdf_url || DEFAULT_REPORT.pdfUrl,
        };
        setReport(mapped);
        localStorage.setItem("asps_annual_report_data", JSON.stringify(mapped));
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openEdit = () => {
    setFormData({ ...report });
    setUploadFileName("");
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    setUploadLoading(true);

    try {
      const res = await apiUploadFile(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, pdfUrl: res.url }));
        showToast("PDF file uploaded successfully!");
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, pdfUrl: objectUrl }));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.pdfUrl.trim()) return;

    setReport(formData);
    localStorage.setItem("asps_annual_report_data", JSON.stringify(formData));

    // Sync to MySQL Database
    try {
      await apiSaveAnnualReport({
        academic_year: formData.academicYear,
        title: formData.title,
        summary: formData.summary,
        pdf_url: formData.pdfUrl,
        presented_by: "Rev. Dr. James Stephen Olikal (Principal)",
        published_at: new Date().toISOString().split("T")[0],
      });
      showToast("Annual Report updated successfully!");
    } catch {
      showToast("Updated locally.");
    }

    setShowModal(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Restore official school Annual Report 2024-2025 defaults?")) {
      setReport(DEFAULT_REPORT);
      localStorage.setItem("asps_annual_report_data", JSON.stringify(DEFAULT_REPORT));
      showToast("Restored official 2024-2025 report defaults.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAFF] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB900] text-xs font-serif font-bold flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ─── Breadcrumb Navigation ────────────────────────────────────── */}
        <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0875C9] transition-colors">
            Home
          </Link>
          <span>&rsaquo;</span>
          <span className="text-slate-400">Academics</span>
          <span>&rsaquo;</span>
          <span className="text-[#092F78] font-bold">Annual Report</span>
        </nav>

        {/* ─── Top Header Banner Matching School Academics Theme ───────── */}
        <div className="bg-[#0875C9] text-white text-center py-5 px-6 rounded-2xl mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            ANNUAL REPORT
          </h1>
          <p className="text-xs sm:text-sm font-serif font-bold text-[#FFB900] mt-1 uppercase tracking-wider">
            ACADEMIC SESSION 2024-2025
          </p>
        </div>

        {/* ─── Admin Bar (Visible when Admin is Authenticated) ───────────── */}
        {isAdmin && (
          <div className="bg-[#EAF6FF] border-2 border-[#0875C9] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📑</span>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#092F78] flex items-center gap-2">
                  <span>Annual Report Editor</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Admin Active
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Update session year, report title, summary, and upload new official PDF documents.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openEdit}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                ✎ Edit Report / PDF
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                ↺ Defaults
              </button>
            </div>
          </div>
        )}

        {/* ─── Main Content Box Matching Reference Website ─────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#D8EAF8] mb-8">
          
          {/* Header row with Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-3.5 py-1 rounded-full text-xs font-serif font-bold text-[#0875C9] mb-2.5">
                <span>CBSE OASIS Verified</span>
                <span>·</span>
                <span>Session {report.academicYear}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78] tracking-tight">
                {report.title}
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Central Board of Secondary Education (CBSE Affiliation No: 930501) · All Saints Public School, Adoor
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={report.pdfUrl}
                download={`${report.title}.pdf`}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif font-bold tracking-wide shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Download PDF</span>
              </a>

              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#EAF6FF] text-[#0875C9] border border-[#0875C9] px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif font-bold tracking-wide transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Open in Full Window</span>
                <span>&rarr;</span>
              </a>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openEdit}
                  className="bg-[#EAF6FF] hover:bg-[#D9EEFF] text-[#092F78] px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  ✎ Edit
                </button>
              )}
            </div>
          </div>

          {/* Official Document Details Table */}
          <div className="overflow-x-auto border border-[#D8EAF8] rounded-2xl mb-8">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#F4FAFF] text-[#092F78] border-b border-[#D8EAF8] font-bold uppercase text-[11px] tracking-wider">
                  <th className="p-3.5 border-r border-[#D8EAF8]">Document Title</th>
                  <th className="p-3.5 border-r border-[#D8EAF8] w-36">Academic Session</th>
                  <th className="p-3.5 border-r border-[#D8EAF8]">Verification Authority</th>
                  <th className="p-3.5 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="bg-white hover:bg-[#F4FAFF]/80 transition-colors">
                  <td className="p-3.5 border-r border-slate-100 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-sm border border-[#D8EAF8]">
                        📄
                      </span>
                      <div>
                        <span className="block font-serif font-bold text-slate-900">{report.title}</span>
                        <span className="text-[11px] text-slate-500 font-normal">CBSE OASIS Mandatory Annual Disclosure</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 border-r border-slate-100 font-bold text-[#0875C9]">
                    {report.academicYear}
                  </td>
                  <td className="p-3.5 border-r border-slate-100 text-slate-600">
                    CBSE New Delhi / School Affiliation Portal
                  </td>
                  <td className="p-3.5 text-center">
                    <a
                      href={report.pdfUrl}
                      download={`${report.title}.pdf`}
                      className="inline-flex items-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-serif font-bold px-4 py-1.5 rounded-full transition-all shadow-2xs"
                    >
                      <span>📥</span>
                      <span>Download</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Embedded Native PDF Viewer */}
          <div className="border border-[#D8EAF8] rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
            <div className="flex items-center justify-between p-3.5 bg-[#F4FAFF] border-b border-[#D8EAF8]">
              <span className="text-xs font-serif font-bold text-[#092F78] uppercase tracking-wider flex items-center gap-2">
                <span>📄</span>
                <span>Official Document Viewer: {report.title}</span>
              </span>
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0875C9] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Open in fullscreen</span>
                <span>&rarr;</span>
              </a>
            </div>

            <div className="relative w-full h-[700px] sm:h-[850px] lg:h-[950px] bg-slate-100">
              <iframe referrerPolicy="strict-origin-when-cross-origin"
                key={report.pdfUrl}
                src={`${report.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                title={report.title}
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-[#D8EAF8] text-center text-xs text-slate-500">
              <span>If the document does not display in your browser, </span>
              <a href={report.pdfUrl} download={`${report.title}.pdf`} className="text-[#0875C9] font-bold underline">
                click here to download the official Annual Report 2024-2025 PDF directly.
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ─── MODAL: EDIT ANNUAL REPORT ───────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                Edit Annual Report Details
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
                  Academic Session Year *
                </label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="e.g. 2024-2025"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Report 2024-2025"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Summary of verified document..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Upload PDF Document / URL *
                </label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#0875C9] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#EAF6FF]/50 transition-colors p-2 mb-2">
                  <span className="text-xs text-slate-600 font-medium text-center">
                    {uploadLoading
                      ? "Uploading PDF..."
                      : uploadFileName
                      ? `Selected: ${uploadFileName}`
                      : "Click to select a new PDF file from your computer"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">PDF Document (Max 15MB)</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <input
                  type="text"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  placeholder="/documents/annual-report-2024-25.pdf"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
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
                  className="px-5 py-2 rounded-xl text-xs font-serif font-bold text-white bg-[#0875C9] hover:bg-[#0066B5] shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
