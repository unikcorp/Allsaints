"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  EditableResult,
  DEFAULT_RESULTS,
  getStoredResults,
  saveStoredResults,
  isAdminAuthenticated,
  clearAdminSession,
} from "@/utils/adminStorage";

export default function ResultsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [results, setResults] = useState<EditableResult[]>(DEFAULT_RESULTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState<EditableResult | null>(null);
  const [topperInputMode, setTopperInputMode] = useState<"upload" | "url">("upload");
  const [uploadFileName, setUploadFileName] = useState("");

  const [formData, setFormData] = useState<EditableResult>({
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

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setResults(getStoredResults());
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
        setFormData((prev) => ({ ...prev, topperImage: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditingResult(null);
    setTopperInputMode("upload");
    setUploadFileName("");
    setFormData({
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
    setShowModal(true);
  };

  const openEdit = (res: EditableResult) => {
    setEditingResult(res);
    setTopperInputMode(res.topperImage?.startsWith("data:") ? "upload" : "url");
    setUploadFileName("");
    setFormData({ ...res });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: EditableResult[];
    if (editingResult) {
      updated = results.map((r) => (r.id === formData.id ? formData : r));
      showToast(`Updated ${formData.classLevel} results for ${formData.year}.`);
    } else {
      updated = [formData, ...results];
      showToast(`Added ${formData.classLevel} results for ${formData.year}.`);
    }

    setResults(updated);
    saveStoredResults(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string, classLevel: string, year: string) => {
    if (window.confirm(`Delete ${classLevel} results record for ${year}?`)) {
      const updated = results.filter((r) => r.id !== id);
      setResults(updated);
      saveStoredResults(updated);
      showToast(`Result record deleted.`);
    }
  };

  const handleReset = () => {
    if (window.confirm("Restore official CBSE Board pass statistics to defaults?")) {
      setResults(DEFAULT_RESULTS);
      saveStoredResults(DEFAULT_RESULTS);
      showToast("Restored official board results.");
    }
  };

  const classXResults = results.filter((r) => r.classLevel === "Class X");
  const classXIIResults = results.filter((r) => r.classLevel === "Class XII");

  const totalRegistered = results.reduce((acc, r) => acc + (Number(r.registered) || 0), 0);
  const totalPassed = results.reduce((acc, r) => acc + (Number(r.passed) || 0), 0);

  return (
    <div className="section-pad container-custom font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB900] text-xs font-serif font-bold flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">Academics</span>
        <span>&rsaquo;</span>
        <span className="text-[#0875C9] font-bold">Results</span>
      </nav>

      {/* Top Header Banner */}
      <div className="bg-[#0875C9] text-white text-center py-6 px-6 sm:px-10 rounded-3xl mb-10 shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black uppercase tracking-wider text-white">
          RESULTS
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#FFB900] mt-2 uppercase tracking-wider">
          CBSE BOARD EXAMINATION RESULTS &amp; PASS STATISTICS
        </p>
      </div>

      {/* Admin Results Toolbar */}
      {isAdmin && (
        <div className="bg-white border-t-4 border-t-[#0875C9] border-x border-b border-[#D8EAF8] rounded-2xl p-4 sm:p-5 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-lg border border-[#D8EAF8] shadow-2xs">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                    Board Results &amp; Statistics Editor
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Update candidate registrations, pass records, full A1 distinctions, and toppers
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-sans font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <span>+ Add Result Batch</span>
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
                title="Restore default results"
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

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
        <div className="bg-[#F4FAFF] border-2 border-[#D8EAF8] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl sm:text-6xl font-serif font-black text-[#0875C9] mb-2 tracking-tight">
            100%
          </div>
          <div className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider text-[#092F78] mb-1">
            Class X CBSE Pass Record
          </div>
          <p className="text-sm text-slate-600 font-sans">
            Continuous Centum Pass across all Batches
          </p>
        </div>

        <div className="bg-[#F4FAFF] border-2 border-[#D8EAF8] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl sm:text-6xl font-serif font-black text-[#0875C9] mb-2 tracking-tight">
            100%
          </div>
          <div className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider text-[#092F78] mb-1">
            Class XII CBSE Pass Record
          </div>
          <p className="text-sm text-slate-600 font-sans">
            Science &amp; Commerce 100% Success
          </p>
        </div>

        <div className="bg-[#F4FAFF] border-2 border-[#D8EAF8] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl sm:text-6xl font-serif font-black text-[#FFB900] mb-2 tracking-tight">
            {totalPassed} / {totalRegistered}
          </div>
          <div className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider text-[#092F78] mb-1">
            Total Candidates Passed
          </div>
          <p className="text-sm text-slate-600 font-sans">
            Centum Success Record
          </p>
        </div>
      </div>

      {/* ─── CLASS X TABLE ─────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-serif font-bold text-[#FFB900] uppercase tracking-wider block mb-1">
              Secondary School Examination (AISSE)
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
              Class X Board Examination Pass Statistics
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-[#D8EAF8] bg-[#EAF6FF] text-[#092F78] font-serif font-bold">
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">No. of Registered Students</th>
                <th className="py-3.5 px-4">No. of Students Passed</th>
                <th className="py-3.5 px-4">Pass Percentage</th>
                <th className="py-3.5 px-4">Remarks</th>
                {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classXResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-[#0875C9] text-base">{r.year}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{r.registered}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{r.passed}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200 text-xs">
                      {r.percentage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{r.remarks}</td>
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="bg-[#EAF6FF] text-[#0875C9] hover:bg-[#0875C9] hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, r.classLevel, r.year)}
                          className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── CLASS XII TABLE ────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-serif font-bold text-[#FFB900] uppercase tracking-wider block mb-1">
              Senior School Certificate Examination (AISSCE)
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
              Class XII Board Examination Pass Statistics
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-[#D8EAF8] bg-[#EAF6FF] text-[#092F78] font-serif font-bold">
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">No. of Registered Students</th>
                <th className="py-3.5 px-4">No. of Students Passed</th>
                <th className="py-3.5 px-4">Pass Percentage</th>
                <th className="py-3.5 px-4">Remarks</th>
                {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classXIIResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-[#0875C9] text-base">{r.year}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{r.registered}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{r.passed}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200 text-xs">
                      {r.percentage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{r.remarks}</td>
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="bg-[#EAF6FF] text-[#0875C9] hover:bg-[#0875C9] hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, r.classLevel, r.year)}
                          className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ADD / EDIT MODAL ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {editingResult ? "Edit Board Results Record" : "Add Board Results Batch"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Class Level *
                  </label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        classLevel: e.target.value as "Class X" | "Class XII",
                      })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#0875C9] outline-none bg-white"
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
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                  >
                  </input>
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
                    value={formData.registered}
                    onChange={(e) =>
                      setFormData({ ...formData, registered: Number(e.target.value) })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Passed *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.passed}
                    onChange={(e) =>
                      setFormData({ ...formData, passed: Number(e.target.value) })
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                    Pass % *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="100%"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:border-[#0875C9] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Remarks / Accolades
                </label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. 100% Pass Record - 28 Full A1 Grades"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              {/* Topper Photo Option */}
              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1.5">
                  Toppers Photo / Certificate (Optional)
                </label>
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setTopperInputMode("upload")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      topperInputMode === "upload"
                        ? "bg-[#0875C9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopperInputMode("url")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      topperInputMode === "url"
                        ? "bg-[#0875C9] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🔗 Image URL / Path
                  </button>
                </div>

                {topperInputMode === "upload" ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[#D8EAF8] hover:border-[#0875C9] rounded-xl cursor-pointer bg-slate-50 hover:bg-[#EAF6FF] transition-colors p-2">
                      <span className="text-xs text-slate-600 font-medium text-center">
                        {uploadFileName ? uploadFileName : "Select Topper Photo or Certificate"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.topperImage || ""}
                    onChange={(e) => setFormData({ ...formData, topperImage: e.target.value })}
                    placeholder="/images/school_content/revaluation-a1-toppers.png"
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
