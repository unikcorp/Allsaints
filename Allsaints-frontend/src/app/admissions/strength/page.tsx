"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGetEnrollment, apiSaveEnrollment, apiDeleteEnrollment } from "@/utils/apiService";
import { isAdminAuthenticated } from "@/utils/adminStorage";

interface EnrollmentRow {
  id?: string;
  class: string;
  sections: number;
  intake: number;
  girls: number;
  boys: number;
  trans: number;
  total: number;
  cwsn: number;
}

const DEFAULT_ENROLLMENT_DATA: EnrollmentRow[] = [
  { class: "Pre-school 1", sections: 0, intake: 0, girls: 0, boys: 0, trans: 0, total: 0, cwsn: 0 },
  { class: "Pre-school 2", sections: 3, intake: 30, girls: 45, boys: 35, trans: 0, total: 80, cwsn: 0 },
  { class: "Pre-school 3", sections: 4, intake: 30, girls: 44, boys: 46, trans: 0, total: 90, cwsn: 0 },
  { class: "1", sections: 4, intake: 35, girls: 66, boys: 57, trans: 0, total: 123, cwsn: 0 },
  { class: "2", sections: 4, intake: 35, girls: 70, boys: 51, trans: 0, total: 121, cwsn: 0 },
  { class: "3", sections: 4, intake: 35, girls: 54, boys: 57, trans: 0, total: 111, cwsn: 0 },
  { class: "4", sections: 4, intake: 35, girls: 62, boys: 65, trans: 0, total: 127, cwsn: 0 },
  { class: "5", sections: 4, intake: 35, girls: 63, boys: 54, trans: 0, total: 117, cwsn: 0 },
  { class: "6", sections: 4, intake: 35, girls: 52, boys: 65, trans: 0, total: 117, cwsn: 0 },
  { class: "7", sections: 4, intake: 35, girls: 50, boys: 42, trans: 0, total: 92, cwsn: 0 },
  { class: "8", sections: 4, intake: 35, girls: 57, boys: 40, trans: 0, total: 106, cwsn: 0 },
  { class: "9", sections: 3, intake: 40, girls: 69, boys: 42, trans: 0, total: 111, cwsn: 0 },
  { class: "10", sections: 3, intake: 40, girls: 54, boys: 54, trans: 0, total: 108, cwsn: 0 },
  { class: "11", sections: 4, intake: 40, girls: 22, boys: 19, trans: 0, total: 41, cwsn: 0 },
  { class: "12", sections: 4, intake: 15, girls: 24, boys: 21, trans: 0, total: 45, cwsn: 0 }
];

export default function StrengthPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<EnrollmentRow[]>(DEFAULT_ENROLLMENT_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<EnrollmentRow | null>(null);
  const [formData, setFormData] = useState<EnrollmentRow>({
    class: "",
    sections: 1,
    intake: 40,
    girls: 0,
    boys: 0,
    trans: 0,
    total: 0,
    cwsn: 0,
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const saved = localStorage.getItem("asps_enrollment_data");
    if (saved) {
      try { setData(JSON.parse(saved)); } catch {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAdd = () => {
    setEditingRow(null);
    setFormData({
      class: "",
      sections: 1,
      intake: 40,
      girls: 0,
      boys: 0,
      trans: 0,
      total: 0,
      cwsn: 0,
    });
    setShowModal(true);
  };

  const openEdit = (row: EnrollmentRow) => {
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
    const computedTotal = Number(formData.girls) + Number(formData.boys) + Number(formData.trans);
    const toSave: EnrollmentRow = {
      ...formData,
      sections: Number(formData.sections) || 0,
      intake: Number(formData.intake) || 0,
      girls: Number(formData.girls) || 0,
      boys: Number(formData.boys) || 0,
      trans: Number(formData.trans) || 0,
      total: computedTotal,
      cwsn: Number(formData.cwsn) || 0,
    };

    let updated: EnrollmentRow[];
    if (editingRow) {
      updated = data.map((r) => (r.class === editingRow.class ? toSave : r));
    } else {
      updated = [...data, toSave];
    }

    setData(updated);
    localStorage.setItem("asps_enrollment_data", JSON.stringify(updated));
    setShowModal(false);
    showToast("Enrollment records updated successfully!");
  };

  const handleDelete = (className: string) => {
    if (!confirm(`Are you sure you want to delete class ${className}?`)) return;
    const updated = data.filter((r) => r.class !== className);
    setData(updated);
    localStorage.setItem("asps_enrollment_data", JSON.stringify(updated));
    showToast(`Class ${className} deleted.`);
  };

  const handleReset = () => {
    if (!confirm("Reset all enrollment data to original CBSE submission values?")) return;
    setData(DEFAULT_ENROLLMENT_DATA);
    localStorage.removeItem("asps_enrollment_data");
    showToast("Reset to official CBSE Oasis disclosure data.");
  };

  const totalStudents = data.reduce((acc, curr) => acc + curr.total, 0);
  const totalGirls = data.reduce((acc, curr) => acc + curr.girls, 0);
  const totalBoys = data.reduce((acc, curr) => acc + curr.boys, 0);
  const totalSections = data.reduce((acc, curr) => acc + curr.sections, 0);

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
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-serif font-black text-sm text-[#092F78] flex items-center gap-2">
                  <span>Student Strength &amp; Enrollment Editor</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-sans px-2 py-0.5 rounded-full uppercase">
                    Admin Active
                  </span>
                </h3>
                <p className="text-xs text-slate-600">
                  Update class intakes, section counts, and student gender distributions in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openAdd}
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                + Add Class
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

        {/* Breadcrumb Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFB900] block mb-2">
            Academics &bull; OASIS Disclosures
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#092F78] mb-3">
            STUDENT BODY
          </h1>
          <div className="w-16 h-1 bg-[#FFB900] rounded-full mx-auto mb-4" />
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive class-wise section allocation, intake capacity, and gender distribution at All Saints Public School, Adoor.
          </p>
        </div>

        {/* Highlight Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#D8EAF8] text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Students
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0875C9]">
              {totalStudents}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#D8EAF8] text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Girls
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0875C9]">
              {totalGirls}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#D8EAF8] text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Boys
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0066B5]">
              {totalBoys}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#D8EAF8] text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Sections
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#092F78]">
              {totalSections}
            </span>
          </div>
        </div>

        {/* Official Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8EAF8] overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#0875C9] text-white font-serif uppercase tracking-wider text-xs">
                  <th className="p-3.5 border-r border-[#0066B5] font-bold text-left pl-4">Class</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">Total Sections</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">Max Per Class Intake</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">Girls</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">Boys</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">Transgenders</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">Total Students</th>
                  <th className="p-3.5 border-r border-[#0066B5] font-bold">CWSN</th>
                  {isAdmin && <th className="p-3.5 font-bold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.map((row, idx) => (
                  <tr
                    key={row.class + idx}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-slate-50 transition-colors"
                        : "bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                    }
                  >
                    <td className="p-3.5 font-bold font-serif text-[#092F78] text-left pl-4 border-r border-slate-100">
                      {row.class}
                    </td>
                    <td className="p-3.5 border-r border-slate-100">{row.sections}</td>
                    <td className="p-3.5 border-r border-slate-100">{row.intake}</td>
                    <td className="p-3.5 border-r border-slate-100 font-semibold text-[#0875C9]">
                      {row.girls}
                    </td>
                    <td className="p-3.5 border-r border-slate-100 font-semibold text-[#0066B5]">
                      {row.boys}
                    </td>
                    <td className="p-3.5 border-r border-slate-100">{row.trans}</td>
                    <td className="p-3.5 border-r border-slate-100 font-bold text-[#0875C9]">
                      {row.total}
                    </td>
                    <td className="p-3.5 border-r border-slate-100">{row.cwsn}</td>
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
                {editingRow ? `Edit Class ${formData.class}` : "Add Class Enrollment"}
              </h3>
              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    placeholder="e.g. 10 or Pre-school 2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sections</label>
                    <input
                      type="number"
                      value={formData.sections}
                      onChange={(e) => setFormData({ ...formData, sections: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Intake</label>
                    <input
                      type="number"
                      value={formData.intake}
                      onChange={(e) => setFormData({ ...formData, intake: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Girls</label>
                    <input
                      type="number"
                      value={formData.girls}
                      onChange={(e) => setFormData({ ...formData, girls: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Boys</label>
                    <input
                      type="number"
                      value={formData.boys}
                      onChange={(e) => setFormData({ ...formData, boys: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CWSN</label>
                    <input
                      type="number"
                      value={formData.cwsn}
                      onChange={(e) => setFormData({ ...formData, cwsn: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                    />
                  </div>
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
                    Save Statistics
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
