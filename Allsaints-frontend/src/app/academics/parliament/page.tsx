"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiGetParliament, apiSaveParliamentMember, apiDeleteParliamentMember, apiUploadFile } from "@/utils/apiService";
import { isAdminAuthenticated } from "@/utils/adminStorage";

interface ParliamentRow {
  position: number;
  candidate: string;
  votes: number;
}

const DEFAULT_ELECTION_RESULTS: ParliamentRow[] = [
  { position: 1, candidate: "ALAN.P.GEORGE", votes: 94 },
  { position: 2, candidate: "AARON.P.BIJU", votes: 69 },
  { position: 3, candidate: "EVANA ABRAHAM", votes: 69 },
  { position: 4, candidate: "DARSHAN.P.RINJU", votes: 46 },
  { position: 5, candidate: "JOAN DAVID SHAJI", votes: 38 },
  { position: 6, candidate: "MUHAMMED FAIZAN", votes: 36 },
  { position: 7, candidate: "ANN MARIAM BINU", votes: 34 },
  { position: 8, candidate: "GEORDY.P.SABU", votes: 32 },
  { position: 9, candidate: "ASHIMA.A", votes: 31 },
];

export default function ParliamentPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [results, setResults] = useState<ParliamentRow[]>(DEFAULT_ELECTION_RESULTS);
  const [sessionYear, setSessionYear] = useState("2024-'25");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>("/images/school_content/parliament-election-2k26.jpg");
  const [posterImgError, setPosterImgError] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<ParliamentRow | null>(null);
  const [formData, setFormData] = useState<ParliamentRow>({
    position: 1,
    candidate: "",
    votes: 0,
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const saved = localStorage.getItem("asps_parliament_results");
    if (saved) {
      try { setResults(JSON.parse(saved)); } catch {}
    }
    const savedPoster = localStorage.getItem("asps_parliament_poster");
    if (savedPoster) {
      setPosterUrl(savedPoster);
    }
  }, []);

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      alert("Unauthorized: Only administrators are permitted to upload or change the election poster.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPoster(true);
    try {
      const res = await apiUploadFile(file);
      if (res.success && res.url) {
        const fullUrl = res.url;
        setPosterUrl(fullUrl);
        setPosterImgError(false);
        localStorage.setItem("asps_parliament_poster", fullUrl);
        showToast("Parliament Election Poster updated successfully!");
      } else {
        alert("Upload failed: " + (res.error || "Please try again."));
      }
    } catch (err: any) {
      alert("Upload error: " + err.message);
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAdd = () => {
    if (!isAdmin) return;
    setEditingRow(null);
    setFormData({
      position: results.length + 1,
      candidate: "",
      votes: 0,
    });
    setShowModal(true);
  };

  const openEdit = (row: ParliamentRow) => {
    if (!isAdmin) return;
    setEditingRow(row);
    setFormData({ ...row });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (!formData.candidate.trim()) {
      alert("Candidate name is required.");
      return;
    }
    const toSave: ParliamentRow = {
      position: Number(formData.position) || results.length + 1,
      candidate: formData.candidate.toUpperCase(),
      votes: Number(formData.votes) || 0,
    };

    let updated: ParliamentRow[];
    if (editingRow) {
      updated = results.map((r) => (r.position === editingRow.position ? toSave : r));
      showToast(`Updated candidate ${toSave.candidate}.`);
    } else {
      updated = [...results, toSave];
      showToast(`Added representative ${toSave.candidate}.`);
    }
    setResults(updated);
    localStorage.setItem("asps_parliament_results", JSON.stringify(updated));
    setShowModal(false);
  };

  const handleDelete = (position: number, name: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Delete candidate ${name}?`)) {
      const updated = results.filter((r) => r.position !== position);
      setResults(updated);
      localStorage.setItem("asps_parliament_results", JSON.stringify(updated));
      showToast(`Removed candidate.`);
    }
  };

  const handleReset = () => {
    if (!isAdmin) return;
    if (window.confirm("Restore official election results?")) {
      setResults(DEFAULT_ELECTION_RESULTS);
      localStorage.removeItem("asps_parliament_results");
      showToast("Restored official election counts.");
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

      {/* Admin Bar */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-[#EAF6FF] border border-[#BFE3FF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h3 className="font-serif font-black text-sm text-[#092F78] flex items-center gap-2">
                <span>School Parliament Results Editor</span>
                <span className="text-[10px] bg-emerald-600 text-white font-sans px-2 py-0.5 rounded-full uppercase">
                  Admin Active
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Update elected student representatives, votes received, or session details.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5">
              <span>📸</span>
              <span>{isUploadingPoster ? "Uploading..." : "Upload Poster"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
                disabled={isUploadingPoster}
              />
            </label>
            <button
              onClick={openAdd}
              className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              + Add Candidate
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
        <span className="text-[#0875C9] font-bold">Parliament</span>
      </nav>

      {/* ─── Top Header Banner in Primary Blue Shade ───────────────── */}
      <div className="bg-[#0875C9] text-white text-center py-2.5 px-4 rounded-2xl mb-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
          SAINTSIANS PARLIAMENT
        </h1>
        <p className="text-sm sm:text-base font-serif font-bold text-[#FFB900] mt-1 uppercase tracking-wider">
          ELECTION REPORT {sessionYear}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ─── Official Election Poster 2K26 ───────────────── */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-[#D8EAF8] text-center">
          {!posterImgError ? (
            <div>
              <div className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <Image
                  src={posterUrl}
                  alt="Saintsian Parliament Election 2K26 Official Poster"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                  onError={() => setPosterImgError(true)}
                />
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
                <div className="text-left">
                  <h2 className="font-serif font-black text-lg sm:text-xl text-[#092F78] uppercase tracking-wide">
                    Saintsian Parliament Election 2K26
                  </h2>
                  <p className="text-xs sm:text-sm font-sans text-slate-600 mt-0.5">
                    Official Notification, Election Guidelines &amp; Student Leadership Schedule
                  </p>
                </div>
                {isAdmin && (
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#D8EAF8] text-[#0875C9] font-bold text-xs transition-all border border-[#BFE3FF] whitespace-nowrap">
                  <span>📸</span>
                  <span>{isUploadingPoster ? "Uploading..." : "Change Poster"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                    disabled={isUploadingPoster}
                  />
                </label>
                )}

              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-7 text-center bg-gradient-to-br from-[#092F78] via-[#0875C9] to-[#04427E] text-white rounded-2xl shadow-inner relative overflow-hidden">
              <div className="relative z-10 space-y-3 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#FFB900] text-xs font-serif font-black tracking-widest uppercase">
                  ★ Official Election Notice ★
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide text-white">
                  SAINTSIAN PARLIAMENT ELECTION 2K26
                </h2>
                <p className="text-sm sm:text-base font-serif font-bold text-[#FFB900] tracking-widest uppercase">
                  Lead • Listen • Serve
                </p>
                <p className="text-xs sm:text-sm text-sky-100/90 italic leading-relaxed max-w-lg mx-auto">
                  &ldquo;Saintsian Parliament election is not just a voting, it is a step towards building a better school, a brighter future and a stronger nation.&rdquo;
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20">
                    <span className="block text-[11px] font-bold text-[#FFB900] uppercase tracking-wider">🗓 Election Date</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">11th September Friday 2026</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20">
                    <span className="block text-[11px] font-bold text-[#FFB900] uppercase tracking-wider">📍 Polling Station</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">School Auditorium</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFB900] hover:bg-[#E0A300] text-[#092F78] font-bold text-sm shadow-lg transition-all active:scale-95">
                    <span className="text-base">📸</span>
                    <span>{isUploadingPoster ? "Uploading Poster..." : "Upload Poster Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      className="hidden"
                      disabled={isUploadingPoster}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => { setPosterImgError(false); }}
                    className="text-xs text-sky-200 hover:text-white underline cursor-pointer"
                  >
                    Retry loading image
                  </button>
                </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* ─── Main Description ───────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8]">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-left font-sans">
            The Students Parliament election for the academic year 2024-25 was conducted on 13th November 2024 in the School auditorium under the supervision of the Election Committee led by Principal Dr. Fr. James Steephen Olokal and teacher-in-charge Mrs. Sreekala S. The election aimed to select students representatives to promote leadership and student engagement to school activities.
          </p>

          {/* Election Process */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="font-serif font-black text-xl text-[#092F78] mb-4 uppercase tracking-wide">
              Election process
            </h3>
            <ol className="space-y-3 text-slate-700 text-sm sm:text-base font-sans list-none">
              <li className="flex items-start gap-3">
                <span className="font-serif font-bold text-[#0875C9] min-w-[24px]">I.</span>
                <span>Nomination opened on 9th August.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-serif font-bold text-[#0875C9] min-w-[24px]">II.</span>
                <span>Manifesto preparation on 16<sup>th</sup> August.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-serif font-bold text-[#0875C9] min-w-[24px]">III.</span>
                <span>Campaigning took place from 11<sup>th</sup> November 2024 to 12<sup>th</sup> November 2024 during which candidates presented this agendas through speeches, posters etc.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-serif font-bold text-[#0875C9] min-w-[24px]">IV.</span>
                <span>The voting process was conducted through secret ballot, ensuring a fair election. The votes were counted in the presence of school authorities and student representatives.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* ─── 3 Official Photos ──────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-3 shadow-xs hover:shadow-md transition-all">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src="/images/school_content/1773902398-96723836769bb9a3e71b91_Parliament.png"
                alt="Students Parliament Election"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-3 shadow-xs hover:shadow-md transition-all">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src="/images/school_content/1773902398-50110115069bb9a3e6fc99_Parliament1.png"
                alt="Parliament Ballot &amp; Polling"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-3 shadow-xs hover:shadow-md transition-all">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src="/images/school_content/1773902398-18081623369bb9a3e6cd39_Parliament12.png"
                alt="Parliament Investiture"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* ─── Election Results Table with Exact Representatives ───────────────── */}
        <div className="bg-white rounded-3xl border border-[#D8EAF8] overflow-hidden shadow-sm">
          <div className="bg-[#F4FAFF] px-6 py-3 border-b border-[#D8EAF8] text-center">
            <h3 className="font-serif font-black text-xl text-[#092F78] uppercase tracking-wide">
              Election Results
            </h3>
            <span className="text-xs text-slate-500 font-sans mt-0.5 block">
              {results.length} Elected Student Representatives
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse font-sans">
              <thead>
                <tr className="bg-[#0875C9] text-white uppercase text-[11px] font-serif font-bold tracking-wider">
                  <th className="py-2.5 px-4 w-28 text-center border-r border-[#0066B5]">POSITION</th>
                  <th className="py-2.5 px-4 border-r border-[#0066B5]">ELECTED CANDIDATE</th>
                  <th className="py-2.5 px-4 w-44 text-center border-r border-[#0066B5]">VOTES RECIEVED</th>
                  {isAdmin && <th className="py-2.5 px-4 text-center">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((row) => (
                  <tr
                    key={row.position}
                    className={row.position % 2 === 0 ? "bg-slate-50/60 hover:bg-slate-50" : "bg-white hover:bg-slate-50"}
                  >
                    <td className="py-2.5 px-4 text-center font-bold text-slate-800 border-r border-slate-100">
                      {row.position}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-100">
                      {row.candidate}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-[#0875C9] border-r border-slate-100">
                      {row.votes}
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-4 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(row.position, row.candidate)}
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

      </div>

      {/* Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-serif font-black text-lg text-[#092F78] mb-4">
              {editingRow ? "Edit Candidate Record" : "Add Student Representative"}
            </h3>
            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Position Rank *</label>
                  <input
                    type="number"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Votes Received *</label>
                  <input
                    type="number"
                    required
                    value={formData.votes}
                    onChange={(e) => setFormData({ ...formData, votes: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.candidate}
                  onChange={(e) => setFormData({ ...formData, candidate: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#0875C9]"
                  placeholder="e.g. ALAN.P.GEORGE"
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
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
