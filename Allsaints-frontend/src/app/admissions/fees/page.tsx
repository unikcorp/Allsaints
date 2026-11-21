"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGetFeeStructure, apiSaveFeeStructure, apiDeleteFeeStructure } from "@/utils/apiService";
import { isAdminAuthenticated } from "@/utils/adminStorage";

interface FeeRow {
  class: string;
  annual: string;
  monthly: string;
  t1: string;
  t2: string;
  t3: string;
  t4: string;
  caution: string;
}

const DEFAULT_FEE_DATA: FeeRow[] = [
  { class: "PLAY CLASS", annual: "4500", monthly: "2000", t1: "-", t2: "-", t3: "-", t4: "-", caution: "-" },
  { class: "DIGITAL FEE", annual: "-", monthly: "", t1: "-", t2: "-", t3: "-", t4: "-", caution: "-" },
  { class: "LKG", annual: "5000", monthly: "1500", t1: "5800", t2: "5800", t3: "5800", t4: "-", caution: "-" },
  { class: "UKG", annual: "5000", monthly: "1500", t1: "5800", t2: "5800", t3: "5800", t4: "-", caution: "-" },
  { class: "STD-I", annual: "5000", monthly: "1500", t1: "6200", t2: "6200", t3: "6200", t4: "-", caution: "-" },
  { class: "STD-II", annual: "5000", monthly: "1500", t1: "6200", t2: "6200", t3: "6200", t4: "-", caution: "-" },
  { class: "STD-III", annual: "5100", monthly: "1500", t1: "6400", t2: "6400", t3: "6400", t4: "-", caution: "-" },
  { class: "STD-IV", annual: "5100", monthly: "1500", t1: "6400", t2: "6400", t3: "6400", t4: "-", caution: "-" },
  { class: "STD-V", annual: "5200", monthly: "1500", t1: "6600", t2: "6600", t3: "6600", t4: "-", caution: "-" },
  { class: "STD-VI", annual: "5200", monthly: "1500", t1: "6600", t2: "6600", t3: "6600", t4: "-", caution: "-" },
  { class: "STD-VII", annual: "5300", monthly: "1500", t1: "6900", t2: "6900", t3: "6900", t4: "-", caution: "-" },
  { class: "STD-VIII", annual: "5400", monthly: "1500", t1: "6900", t2: "6900", t3: "6900", t4: "-", caution: "-" },
  { class: "STD-IX", annual: "6400", monthly: "1500", t1: "7100", t2: "7100", t3: "7100", t4: "-", caution: "-" },
  { class: "STD-X", annual: "6600", monthly: "1500", t1: "7100", t2: "7100", t3: "7100", t4: "-", caution: "-" },
  { class: "XI-BIO MATHS", annual: "9500", monthly: "1500", t1: "8500", t2: "8500", t3: "8500", t4: "8500", caution: "2000" },
  { class: "XI-MATHS COMPUTER", annual: "9500", monthly: "1500", t1: "8500", t2: "8500", t3: "8500", t4: "8500", caution: "2000" },
  { class: "XI-BIO COMPUTER", annual: "9500", monthly: "1500", t1: "8500", t2: "8500", t3: "8500", t4: "8500", caution: "2000" },
  { class: "XI-COM WITH MATHS", annual: "8000", monthly: "1500", t1: "8000", t2: "8000", t3: "8000", t4: "8000", caution: "2000" },
  { class: "XI-COMMERCE", annual: "8000", monthly: "1500", t1: "8000", t2: "8000", t3: "8000", t4: "8000", caution: "2000" },
  { class: "XII-BIO MATHS", annual: "9500", monthly: "1500", t1: "8500", t2: "8500", t3: "8500", t4: "8500", caution: "-" },
  { class: "XII-MATHS COMPUTER", annual: "9500", monthly: "1500", t1: "8500", t2: "8500", t3: "8500", t4: "8500", caution: "-" },
  { class: "XII-BIO COMPUTER", annual: "9500", monthly: "1500", t1: "8500", t2: "8500", t3: "8500", t4: "8500", caution: "-" },
  { class: "XII-COM WITH MATHS", annual: "8000", monthly: "1500", t1: "8000", t2: "8000", t3: "8000", t4: "8000", caution: "-" },
  { class: "XII-COMMERCE", annual: "8000", monthly: "1500", t1: "8000", t2: "8000", t3: "8000", t4: "8000", caution: "-" }
];

export default function FeesPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [feeList, setFeeList] = useState<FeeRow[]>(DEFAULT_FEE_DATA);
  const [pdfUrl, setPdfUrl] = useState("/documents/fees-structure-2025-26.pdf");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<FeeRow | null>(null);
  const [formData, setFormData] = useState<FeeRow>({
    class: "",
    annual: "",
    monthly: "",
    t1: "-",
    t2: "-",
    t3: "-",
    t4: "-",
    caution: "-",
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const saved = localStorage.getItem("asps_fee_data");
    if (saved) {
      try { setFeeList(JSON.parse(saved)); } catch {}
    }
    const savedPdf = localStorage.getItem("asps_fee_pdf");
    if (savedPdf) setPdfUrl(savedPdf);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAdd = () => {
    setEditingRow(null);
    setFormData({
      class: "",
      annual: "",
      monthly: "",
      t1: "-",
      t2: "-",
      t3: "-",
      t4: "-",
      caution: "-",
    });
    setShowModal(true);
  };

  const openEdit = (row: FeeRow) => {
    setEditingRow(row);
    setFormData({ ...row });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class.trim()) {
      alert("Class name is required.");
      return;
    }

    let updated: FeeRow[];
    if (editingRow) {
      updated = feeList.map((r) => (r.class === editingRow.class ? formData : r));
    } else {
      updated = [...feeList, formData];
    }

    setFeeList(updated);
    localStorage.setItem("asps_fee_data", JSON.stringify(updated));
    setShowModal(false);
    showToast("Fee schedule updated successfully!");
  };

  const handleDelete = (className: string) => {
    if (!confirm(`Are you sure you want to delete fees for ${className}?`)) return;
    const updated = feeList.filter((r) => r.class !== className);
    setFeeList(updated);
    localStorage.setItem("asps_fee_data", JSON.stringify(updated));
    showToast(`Deleted ${className} fee row.`);
  };

  const handleReset = () => {
    if (!confirm("Reset fee table to original CBSE 2025-26 schedule?")) return;
    setFeeList(DEFAULT_FEE_DATA);
    localStorage.removeItem("asps_fee_data");
    showToast("Reset to official CBSE approved fee schedule.");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FFB900]">
            <span className="text-[#FFB900] text-lg">✓</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Admin Bar */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-[#EAF6FF] border border-[#BFE3FF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-serif font-black text-sm text-[#092F78] flex items-center gap-2">
                  <span>Fee Structure Editor</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-sans px-2 py-0.5 rounded-full uppercase">
                    Admin Active
                  </span>
                </h3>
                <p className="text-xs text-slate-600">
                  Update class annual fees, term schedules, or replace the approved fee schedule circular.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openAdd}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                + Add Fee Row
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

        {/* Top Header Banner in Primary Blue Shade */}
        <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            FEES STRUCTURE 2025-26
          </h1>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Prescribed schedule of school fees approved for All Saints Public School for the academic year 2025–26.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#D8EAF8] mb-8">
          <div>
            <h2 className="font-serif font-bold text-base text-[#092F78]">
              Official Fee Document
            </h2>
            <p className="text-xs text-slate-500">
              Download the official approved circular in PDF format
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow hover:shadow-md cursor-pointer"
            >
              <span>Download Fee Structure (PDF)</span>
            </a>
            {isAdmin && (
              <button
                onClick={() => {
                  const newUrl = prompt("Enter new PDF URL or path:", pdfUrl);
                  if (newUrl) {
                    setPdfUrl(newUrl);
                    localStorage.setItem("asps_fee_pdf", newUrl);
                    showToast("Updated fee document URL.");
                  }
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-full font-bold"
              >
                ✏️ Change PDF
              </button>
            )}
          </div>
        </div>

        {/* Official Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8EAF8] overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#0875C9] text-white font-serif uppercase tracking-wider text-xs">
                  <th className="p-3.5 border-r border-[#0066B5] font-bold text-left pl-4">CLASS</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">ANNUAL FEES (₹)</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">MONTHLY / DIGITAL</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">TERM-1 (₹)</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">TERM-2 (₹)</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">TERM-3 (₹)</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">TERM-4 (₹)</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">CAUTION DEPOSIT (₹)</th>
                  {isAdmin && <th className="p-3.5 font-bold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {feeList.map((row, idx) => (
                  <tr
                    key={row.class + idx}
                    className={
                      row.class === "DIGITAL FEE"
                        ? "bg-[#FFF4CC]/50 font-semibold text-[#092F78]"
                        : idx % 2 === 0
                        ? "bg-white hover:bg-slate-50 transition-colors"
                        : "bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                    }
                  >
                    <td className="p-3.5 font-bold font-serif text-[#092F78] text-left pl-4 border-r border-slate-100">
                      {row.class}
                    </td>
                    <td className="p-3.5 border-r border-slate-100 font-semibold">{row.annual}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.monthly}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.t1}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.t2}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.t3}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.t4}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.caution}</td>
                    {isAdmin && (
                      <td className="p-3.5 flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(row.class)}
                          className="px-2 py-1 text-xs bg-rose-50 hover:bg-rose-100 rounded text-rose-600 font-bold"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <h3 className="font-serif font-black text-lg text-[#092F78] mb-4">
                {editingRow ? `Edit ${formData.class} Fees` : "Add Fee Schedule"}
              </h3>
              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    placeholder="e.g. STD-I or XI-COMMERCE"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Annual Fee (₹)</label>
                    <input
                      type="text"
                      value={formData.annual}
                      onChange={(e) => setFormData({ ...formData, annual: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Monthly (₹)</label>
                    <input
                      type="text"
                      value={formData.monthly}
                      onChange={(e) => setFormData({ ...formData, monthly: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Term 1</label>
                    <input
                      type="text"
                      value={formData.t1}
                      onChange={(e) => setFormData({ ...formData, t1: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-2 py-1.5 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Term 2</label>
                    <input
                      type="text"
                      value={formData.t2}
                      onChange={(e) => setFormData({ ...formData, t2: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-2 py-1.5 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Term 3</label>
                    <input
                      type="text"
                      value={formData.t3}
                      onChange={(e) => setFormData({ ...formData, t3: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-2 py-1.5 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Term 4</label>
                    <input
                      type="text"
                      value={formData.t4}
                      onChange={(e) => setFormData({ ...formData, t4: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-2 py-1.5 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Caution Deposit (₹)</label>
                  <input
                    type="text"
                    value={formData.caution}
                    onChange={(e) => setFormData({ ...formData, caution: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    placeholder="- or 2000"
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
                    Save Fee
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
