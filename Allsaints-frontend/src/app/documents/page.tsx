"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  EditableDocument,
  DEFAULT_DOCUMENTS,
  getStoredDocuments,
  saveStoredDocuments,
  isAdminAuthenticated,
  clearAdminSession,
} from "@/utils/adminStorage";

export default function DocumentsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [documents, setDocuments] = useState<EditableDocument[]>(DEFAULT_DOCUMENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<EditableDocument | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");

  const [formData, setFormData] = useState<EditableDocument>({
    id: "",
    slug: "",
    order: 1,
    label: "",
    title: "",
    authority: "",
    status: "Verified & Submitted",
    desc: "",
    pdfUrls: [""],
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setDocuments(getStoredDocuments());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, pdfUrls: [reader.result as string] }));
      }
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditingDoc(null);
    setInputMode("upload");
    setUploadFileName("");
    setFormData({
      id: `doc-${Date.now()}`,
      slug: `custom-${Date.now()}`,
      order: documents.length + 1,
      label: "",
      title: "",
      authority: "",
      status: "Verified & Submitted",
      desc: "",
      pdfUrls: [""],
    });
    setShowModal(true);
  };

  const openEdit = (doc: EditableDocument) => {
    setEditingDoc(doc);
    setInputMode(doc.pdfUrls[0]?.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setFormData({ ...doc });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.authority.trim()) {
      alert("Title and authority are required.");
      return;
    }

    let updated: EditableDocument[];
    if (editingDoc) {
      updated = documents.map((d) => (d.id === formData.id ? formData : d));
      showToast(`Updated "${formData.title}".`);
    } else {
      updated = [...documents, formData];
      showToast(`Added "${formData.title}".`);
    }

    setDocuments(updated);
    saveStoredDocuments(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete certificate: "${title}"?`)) {
      const updated = documents.filter((d) => d.id !== id);
      setDocuments(updated);
      saveStoredDocuments(updated);
      showToast(`Deleted certificate.`);
    }
  };

  const handleReset = () => {
    if (window.confirm("Restore 11 official statutory certificates to defaults?")) {
      setDocuments(DEFAULT_DOCUMENTS);
      saveStoredDocuments(DEFAULT_DOCUMENTS);
      showToast("Restored official documents.");
    }
  };

  return (
    <div className="section-pad container-custom font-sans">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB900] text-xs font-serif font-bold flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner in Primary Blue */}
      <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
          STATUTORY CERTIFICATES &amp; DOCUMENTS
        </h1>
      </div>

      {/* Admin Documents Toolbar */}
      {isAdmin && (
        <div className="bg-white border-t-4 border-t-[#0875C9] border-x border-b border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-lg border border-[#D8EAF8] shadow-2xs">
                📜
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                    Statutory Documents &amp; Certificates Editor
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Publish, update, or upload official CBSE certificates, NOCs, and public disclosure records
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-sans font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <span>+ Add Document</span>
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
                title="Restore default documents"
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

      <div className="max-w-4xl mb-10">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          In strict compliance with the Central Board of Secondary Education (CBSE) regulations, the following statutory certificates, state government approvals, building fitness, fire safety, and health certificates are published for public disclosure and parental verification.
        </p>
      </div>

      {/* Quick Summary Bar */}
      <div className="bg-[#EAF6FF]/70 border border-[#D8EAF8] rounded-3xl p-5 mb-10 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0875C9] text-white flex items-center justify-center text-lg flex-shrink-0">
            📜
          </div>
          <div>
            <span className="font-serif font-bold text-sm text-[#092F78] block">
              {documents.length} Official Documents &amp; Certificates
            </span>
            <span className="text-xs text-slate-500 font-sans">
              All documents verified and renewed as per CBSE &amp; Kerala State Education Department norms.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#0875C9] bg-white px-4 py-2 rounded-full border border-[#D8EAF8]">
          <span>Affiliation No: 930501</span>
          <span>·</span>
          <span>School Code: 75786</span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border-2 border-slate-200/90 hover:border-[#0875C9]/60 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center font-serif font-black text-xs">
                  {String(doc.order).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-serif font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {doc.status}
                </span>
              </div>

              <h2 className="font-serif font-bold text-lg text-[#092F78] group-hover:text-[#0875C9] transition-colors leading-snug mb-2">
                {doc.title}
              </h2>

              <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                <span>🏛️</span>
                <span className="truncate">{doc.authority}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans mb-6">
                {doc.desc}
              </p>
            </div>

            <div>
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <a
                  href={doc.pdfUrls[0] || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0875C9] hover:bg-[#0066B5] text-white py-2 px-3 rounded-full text-xs font-serif font-bold text-center tracking-wide shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>👁️ View Certificate</span>
                  <span>&rarr;</span>
                </a>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">#{doc.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(doc)}
                      className="text-xs bg-[#EAF6FF] text-[#0875C9] hover:bg-[#0875C9] hover:text-white px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.title)}
                      className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ─── ADD / EDIT MODAL ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {editingDoc ? "Edit Certificate" : "Add Statutory Certificate"}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, label: e.target.value })}
                  placeholder="e.g. Fire & Rescue Safety Certificate"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
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
                    value={formData.authority}
                    onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                    placeholder="e.g. Kerala Fire & Rescue Services"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="Verified & Submitted"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Description / CBSE Scope
                </label>
                <textarea
                  rows={2}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Official certificate summary conforming to CBSE norms..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                />
              </div>

              {/* Document File / URL Input */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Certificate Document (PDF or Image) *
                </label>
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inputMode === "upload"
                        ? "bg-[#0875C9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inputMode === "url"
                        ? "bg-[#0875C9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🔗 Document URL / Path
                  </button>
                </div>

                {inputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#0875C9] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#EAF6FF]/50 transition-colors p-2">
                      <span className="text-xs text-slate-600 font-medium text-center">
                        {uploadFileName ? uploadFileName : "Select Certificate PDF or Image"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG (Max 8MB)</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.pdfUrls[0] || ""}
                    onChange={(e) => setFormData({ ...formData, pdfUrls: [e.target.value] })}
                    placeholder="/documents/affiliation-certificate.pdf"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  />
                )}
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
