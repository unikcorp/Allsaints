"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { isAdminAuthenticated } from "@/utils/adminStorage";
import { apiSaveFaculty, apiDeleteFaculty } from "@/utils/apiService";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: "Higher Secondary and Secondary" | "Upper Primary" | "Primary" | "K.G Section";
}

const DEFAULT_HIGHER_SEC: Teacher[] = [
  { id: "hss-1", name: "Anjana K", email: "anjanakrishnank007@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-2", name: "Mrs. Suja George", email: "asheeforjesus@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-3", name: "Dency Dominic", email: "denzdominic18dd@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-4", name: "Manju P Kochummen", email: "manjupkochummen1976@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-5", name: "Shobhana G", email: "sobhanag80@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-6", name: "Krishna Kumari", email: "krishnasatheesh15@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-7", name: "Rany P Thomas", email: "ranyjames1234@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-8", name: "Kala R", email: "kalar9196@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-9", name: "Rajani K K", email: "rajanikk0123@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-10", name: "Sreekala A", email: "sreekalasubhash3300@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-11", name: "Sinimol T J", email: "tharayilsini@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-12", name: "Jeethumol R P", email: "rpjeethumol@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-13", name: "Ashna Nizar", email: "ashnaashi16@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-14", name: "Sree Lakshmi V", email: "kanmani29.4@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-15", name: "Anu Jyothi S", email: "anujyothi30@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-16", name: "Sindhu Sreekumar", email: "sindhuanil1911@gmail.com", department: "Higher Secondary and Secondary" },
  { id: "hss-17", name: "Manoj Kumar (PT)", email: "vasudevmanoj9@gmail.com", department: "Higher Secondary and Secondary" },
];

const DEFAULT_UPPER_PRIMARY: Teacher[] = [
  { id: "up-1", name: "Jijimol S", email: "moljiji32@gmail.com", department: "Upper Primary" },
  { id: "up-2", name: "Susan Xavior", email: "susanxavior@gmail.com", department: "Upper Primary" },
  { id: "up-3", name: "Deepa M Philip", email: "deepaajithkoshy@gmail.com", department: "Upper Primary" },
  { id: "up-4", name: "Simi Philip", email: "simiphilip1134@gmail.com", department: "Upper Primary" },
  { id: "up-5", name: "Sruthi K Soman", email: "mayasruthi98@gmail.com", department: "Upper Primary" },
  { id: "up-6", name: "Geeta K Nair", email: "geetavinod78@gmail.com", department: "Upper Primary" },
  { id: "up-7", name: "Manju T Nair", email: "nairmanju307@gmail.com", department: "Upper Primary" },
  { id: "up-8", name: "Pooja Bharghav", email: "poojasuneesh454@gmail.com", department: "Upper Primary" },
  { id: "up-9", name: "Sajimole Varghese", email: "sajimolevarghese@gmail.com", department: "Upper Primary" },
  { id: "up-10", name: "Sreekala A", email: "sreekalasubhash3300@gmail.com", department: "Upper Primary" },
  { id: "up-11", name: "Beena Baby", email: "beenababy75@gmail.com", department: "Upper Primary" },
  { id: "up-12", name: "Sudha T K", email: "sudhakrishnan397@gmail.com", department: "Upper Primary" },
  { id: "up-13", name: "Sheeja Joy", email: "sheejasappumanu@gmail.com", department: "Upper Primary" },
  { id: "up-14", name: "Vandana Sreekumar", email: "sreeshma2011shreya@gmail.com", department: "Upper Primary" },
  { id: "up-15", name: "Jyothi V Pillai", email: "jyothivpillai09@gmail.com", department: "Upper Primary" },
  { id: "up-16", name: "Nisha A", email: "kishornanda2010@gmail.com", department: "Upper Primary" },
  { id: "up-17", name: "Renju Krishnan G", email: "renjuresmigk1997@gmail.com", department: "Upper Primary" },
  { id: "up-18", name: "Jincy Jose", email: "jincyjose24695@gmail.com", department: "Upper Primary" },
  { id: "up-19", name: "Reena A", email: "reenageorge1998@gmail.com", department: "Upper Primary" },
  { id: "up-20", name: ". Sinta Mathew", email: "sintamathew625@gmail.com", department: "Upper Primary" },
  { id: "up-21", name: "Aksa Mathew", email: "aksajesmathew@gmail.com", department: "Upper Primary" },
  { id: "up-22", name: "Manoja Kumari", email: "manojatn25@gmail.com", department: "Upper Primary" },
  { id: "up-23", name: "Amritha Reghu", email: "amrithareghu007@gmail.com", department: "Upper Primary" },
  { id: "up-24", name: "Athulya M Chandran", email: "athulyamchandran600@gmail.com", department: "Upper Primary" },
];

const DEFAULT_PRIMARY: Teacher[] = [
  { id: "pr-1", name: "Shyni C Jinu", email: "shinyjinu1984@gmail.com", department: "Primary" },
  { id: "pr-2", name: "Sini George", email: "sinigiju2016@gmail.com", department: "Primary" },
  { id: "pr-3", name: "Rejani A.P", email: "rajaniaprajaniap@gmail.com", department: "Primary" },
  { id: "pr-4", name: "Kavitha P", email: "jayankavitha6@gmail.com", department: "Primary" },
  { id: "pr-5", name: "Deepa S", email: "adoordeepa8484@gmail.com", department: "Primary" },
  { id: "pr-6", name: "Manju J", email: "manjuj44t@gmail.com", department: "Primary" },
  { id: "pr-7", name: "Susan Harison", email: "susanharison@gmail.com", department: "Primary" },
  { id: "pr-8", name: "Tezzy N George", email: "tezzytezzy359@gmail.com", department: "Primary" },
  { id: "pr-9", name: "Shyama S Pillai", email: "shyamapillai987@gmail.com", department: "Primary" },
  { id: "pr-10", name: "Jayalekshmi. P. N", email: "jayalekshmi6725@gmail.com", department: "Primary" },
  { id: "pr-11", name: "Archa Krishnan G", email: "archadhanu@gmail.com", department: "Primary" },
  { id: "pr-12", name: "Aswathy T R", email: "aswathythachaneth@gmail.com", department: "Primary" },
  { id: "pr-13", name: "Steffy K Thomas", email: "steffyk1995@gmail.com", department: "Primary" },
  { id: "pr-14", name: "Bini Susan K Mathew", email: "binironni2010@gmail.com", department: "Primary" },
  { id: "pr-15", name: "Radhika S Krishnan", email: "radhikaskrishnan1998@gmail.com", department: "Primary" },
  { id: "pr-16", name: "Archana V", email: "archanaanoop45@gmail.com", department: "Primary" },
];

const DEFAULT_KG: Teacher[] = [
  { id: "kg-1", name: "Beena Raju", email: "annaaleena13112000@gmail.com", department: "K.G Section" },
  { id: "kg-2", name: "Daisy Jose", email: "daisyjosegraceland@gmail.com", department: "K.G Section" },
  { id: "kg-3", name: "Alice Reji", email: "alicereji959@gmail.com", department: "K.G Section" },
  { id: "kg-4", name: "Jeena Varghese", email: "jeenavarghese419@gmail.com", department: "K.G Section" },
  { id: "kg-5", name: "Manju G Chandran", email: "manjuchandran52@gmail.com", department: "K.G Section" },
  { id: "kg-6", name: "Manjusha M", email: "mahadheva13@gmail.com", department: "K.G Section" },
  { id: "kg-7", name: "Priya P G", email: "pgpriya60@gmail.com", department: "K.G Section" },
  { id: "kg-8", name: "Simi Thankachan", email: "kwkw990@gmail.com", department: "K.G Section" },
];

export default function FacultyPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [higherSec, setHigherSec] = useState<Teacher[]>(DEFAULT_HIGHER_SEC);
  const [upperPrimary, setUpperPrimary] = useState<Teacher[]>(DEFAULT_UPPER_PRIMARY);
  const [primary, setPrimary] = useState<Teacher[]>(DEFAULT_PRIMARY);
  const [kg, setKg] = useState<Teacher[]>(DEFAULT_KG);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formTeacher, setFormTeacher] = useState<Teacher>({
    id: "",
    name: "",
    email: "",
    department: "Higher Secondary and Secondary",
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    try {
      const savedHSS = localStorage.getItem("asps_faculty_hss");
      if (savedHSS) setHigherSec(JSON.parse(savedHSS));
      const savedUP = localStorage.getItem("asps_faculty_up");
      if (savedUP) setUpperPrimary(JSON.parse(savedUP));
      const savedPR = localStorage.getItem("asps_faculty_pr");
      if (savedPR) setPrimary(JSON.parse(savedPR));
      const savedKG = localStorage.getItem("asps_faculty_kg");
      if (savedKG) setKg(JSON.parse(savedKG));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAdd = (dept?: Teacher["department"]) => {
    setIsEditing(false);
    setFormTeacher({
      id: `fac-${Date.now()}`,
      name: "",
      email: "",
      department: dept || "Higher Secondary and Secondary",
    });
    setShowModal(true);
  };

  const openEdit = (teacher: Teacher) => {
    setIsEditing(true);
    setFormTeacher({ ...teacher });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTeacher.name.trim() || !formTeacher.email.trim()) return;

    if (formTeacher.department === "Higher Secondary and Secondary") {
      const next = isEditing
        ? higherSec.map((t) => (t.id === formTeacher.id ? formTeacher : t))
        : [...higherSec, formTeacher];
      setHigherSec(next);
      localStorage.setItem("asps_faculty_hss", JSON.stringify(next));
    } else if (formTeacher.department === "Upper Primary") {
      const next = isEditing
        ? upperPrimary.map((t) => (t.id === formTeacher.id ? formTeacher : t))
        : [...upperPrimary, formTeacher];
      setUpperPrimary(next);
      localStorage.setItem("asps_faculty_up", JSON.stringify(next));
    } else if (formTeacher.department === "Primary") {
      const next = isEditing
        ? primary.map((t) => (t.id === formTeacher.id ? formTeacher : t))
        : [...primary, formTeacher];
      setPrimary(next);
      localStorage.setItem("asps_faculty_pr", JSON.stringify(next));
    } else {
      const next = isEditing
        ? kg.map((t) => (t.id === formTeacher.id ? formTeacher : t))
        : [...kg, formTeacher];
      setKg(next);
      localStorage.setItem("asps_faculty_kg", JSON.stringify(next));
    }

    try {
      apiSaveFaculty({
        name: formTeacher.name,
        email: formTeacher.email,
        department: formTeacher.department,
      });
    } catch {}

    showToast(`${isEditing ? "Updated" : "Added"} "${formTeacher.name}"`);
    setShowModal(false);
  };

  const handleDelete = (teacher: Teacher) => {
    if (!window.confirm(`Delete ${teacher.name} from faculty directory?`)) return;

    try {
      apiDeleteFaculty(teacher.id, teacher.name);
    } catch {}

    if (teacher.department === "Higher Secondary and Secondary") {
      const next = higherSec.filter((t) => t.id !== teacher.id);
      setHigherSec(next);
      localStorage.setItem("asps_faculty_hss", JSON.stringify(next));
    } else if (teacher.department === "Upper Primary") {
      const next = upperPrimary.filter((t) => t.id !== teacher.id);
      setUpperPrimary(next);
      localStorage.setItem("asps_faculty_up", JSON.stringify(next));
    } else if (teacher.department === "Primary") {
      const next = primary.filter((t) => t.id !== teacher.id);
      setPrimary(next);
      localStorage.setItem("asps_faculty_pr", JSON.stringify(next));
    } else {
      const next = kg.filter((t) => t.id !== teacher.id);
      setKg(next);
      localStorage.setItem("asps_faculty_kg", JSON.stringify(next));
    }
    showToast(`Removed "${teacher.name}"`);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Restore official school faculty directory defaults?")) {
      setHigherSec(DEFAULT_HIGHER_SEC);
      setUpperPrimary(DEFAULT_UPPER_PRIMARY);
      setPrimary(DEFAULT_PRIMARY);
      setKg(DEFAULT_KG);
      localStorage.setItem("asps_faculty_hss", JSON.stringify(DEFAULT_HIGHER_SEC));
      localStorage.setItem("asps_faculty_up", JSON.stringify(DEFAULT_UPPER_PRIMARY));
      localStorage.setItem("asps_faculty_pr", JSON.stringify(DEFAULT_PRIMARY));
      localStorage.setItem("asps_faculty_kg", JSON.stringify(DEFAULT_KG));
      showToast("Restored official faculty defaults.");
    }
  };

  function FacultyTable({
    title,
    teachers,
    headerBg,
    headerTextColor = "text-slate-900",
    dept,
  }: {
    title: string;
    teachers: Teacher[];
    headerBg: string;
    headerTextColor?: string;
    dept: Teacher["department"];
  }) {
    return (
      <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-[#D8EAF8] shadow-xs bg-white">
        <div className={`${headerBg} ${headerTextColor} py-3.5 px-6 font-serif font-black flex items-center justify-between uppercase tracking-wider`}>
          <span className="text-lg sm:text-xl mx-auto">{title}</span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => openAdd(dept)}
              className="text-xs bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-lg font-sans font-bold cursor-pointer"
            >
              + Add
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse font-sans">
            <thead>
              <tr className="bg-[#F4FAFF] text-[#092F78] uppercase text-[11px] font-bold border-b border-[#D8EAF8]">
                <th className="py-3 px-4 sm:px-6 w-16 text-center border-r border-[#D8EAF8]">SL</th>
                <th className="py-3 px-4 sm:px-6 border-r border-[#D8EAF8]">NAME</th>
                <th className="py-3 px-4 sm:px-6 border-r border-[#D8EAF8]">EMAIL</th>
                {isAdmin && <th className="py-3 px-4 text-right">ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t, idx) => (
                <tr
                  key={t.id || idx}
                  className={idx % 2 === 0 ? "bg-white hover:bg-[#F4FAFF]/80" : "bg-[#F4FAFF]/50 hover:bg-[#F4FAFF]"}
                >
                  <td className="py-3 px-4 sm:px-6 text-center font-medium text-slate-500 border-r border-slate-100">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 sm:px-6 font-semibold text-slate-800 border-r border-slate-100">
                    {t.name}
                  </td>
                  <td className="py-3 px-4 sm:px-6 border-r border-slate-100">
                    <a
                      href={`mailto:${t.email}`}
                      className="text-[#0875C9] hover:underline font-mono text-xs sm:text-sm break-all"
                    >
                      {t.email}
                    </a>
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="text-xs bg-[#EAF6FF] text-[#0875C9] hover:bg-[#0875C9] hover:text-white px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t)}
                          className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
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
    );
  }

  return (
    <div className="py-6 sm:py-8 lg:py-10 container-custom font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0875C9] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FFB900] text-xs font-serif font-bold flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">About ASPS</span>
        <span>&rsaquo;</span>
        <span className="text-[#092F78] font-bold">Faculty</span>
      </nav>

      {/* ─── Top Header Banner in Primary Blue ──────────────────────────── */}
      <div className="bg-[#0875C9] text-white text-center py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl mb-5 sm:mb-6 shadow-xs">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
          FACULTY
        </h1>
      </div>

      {/* ─── Admin Bar (Visible when Admin is Authenticated) ─────────────── */}
      {isAdmin && (
        <div className="bg-[#EAF6FF] border-2 border-[#0875C9] rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👩‍🏫</span>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#092F78] flex items-center gap-2">
                <span>Faculty Directory Editor</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Admin Active
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Add, edit, or remove faculty members across Higher Secondary, Upper Primary, Primary, and KG sections.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAdd()}
              className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              + Add Faculty Member
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

      <div className="w-full">
        
        {/* ─── Official Faculty Hero Photo from Live Site ───────────────── */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-[#D8EAF8] mb-5 sm:mb-6 text-center">
          <div className="relative w-full max-w-5xl mx-auto h-[260px] sm:h-[380px] md:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-slate-50 shadow-inner">
            <Image
              src="/images/school_content/1773902602-182554790869bb9b0a0ee16_faculty.jpg"
              alt="Faculty"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 860px"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#092F78] uppercase tracking-wider mb-2">
            FACULTY
          </h2>
          <div className="w-16 h-1 bg-[#FFB900] rounded-full mx-auto mb-6" />
        </div>

        {/* ─── Exact Original Description from Live Site ─────────────────── */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs border border-[#D8EAF8] mb-5 sm:mb-6">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans">
            All members of the faculty are sincere, dedicated and skillful, having real passion for teaching learning process and adequately qualified and trained. Some of them hold higher qualifications and many of them are pursuing for the same. All of them are technically capable and advanced in order to be equipped with up-to-date pedagogical strategies for authentically taking up all the tasks of education fruitfully. Our teachers are emotionally matured so as to extent themselves to the realm of children, to heed them patiently, to feel the pulse of the new generation as well as to love, accept, consider and care them as they are and make them matured along with their upward intellectual, emotional and moral growth. Securing 100% result in Board exams every year is only one of the golden feathers they adorn on their heads that reveals their competence. All teachers mandatorily undergo regular training conducted by the CBSE, various other agencies as well as by the school.
          </p>
        </div>

        {/* ─── Leadership Grid (Principal & Vice Principal) Matching Live Site ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Principal Card */}
          <div className="bg-gradient-to-br from-[#EAF6FF] via-white to-[#EAF6FF] border-2 border-[#D8EAF8] rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all">
            <span className="inline-block bg-[#0875C9] text-white text-[11px] font-serif font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-3 shadow-2xs">
              PRINCIPAL
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-black text-[#092F78] mb-1">
              DR. FR. JAMES STEPHEN OLIKAL
            </h3>
            <p className="text-xs font-semibold text-[#FFB900] font-sans">
              (MA, Ph.D)
            </p>
          </div>

          {/* Vice Principal Card */}
          <div className="bg-gradient-to-br from-[#EAF6FF] via-white to-[#EAF6FF] border-2 border-[#D8EAF8] rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all">
            <span className="inline-block bg-[#0875C9] text-white text-[11px] font-serif font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-3 shadow-2xs">
              VICE PRINCIPAL
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-black text-[#092F78] mb-1">
              ANJANA K
            </h3>
            <p className="text-xs font-semibold text-[#FFB900] font-sans">
              (MA, BEd)
            </p>
          </div>

        </div>

        {/* ─── Faculty List Title ─────────────────────────────────────────── */}
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78] uppercase tracking-wider inline-block bg-[#EAF6FF] px-8 py-3 rounded-2xl border border-[#D8EAF8]">
            Faculty List
          </h2>
        </div>

        {/* ─── 4 Tables in Exact Order Matching Live Site ─────────────────── */}
        <FacultyTable
          title="Higher Secondary and Secondary"
          teachers={higherSec}
          headerBg="bg-[#FFB900]"
          headerTextColor="text-slate-900"
          dept="Higher Secondary and Secondary"
        />

        <FacultyTable
          title="Upper Primary"
          teachers={upperPrimary}
          headerBg="bg-[#0875C9]"
          headerTextColor="text-white"
          dept="Upper Primary"
        />

        <FacultyTable
          title="Primary"
          teachers={primary}
          headerBg="bg-[#22B573]"
          headerTextColor="text-white"
          dept="Primary"
        />

        <FacultyTable
          title="K.G Section"
          teachers={kg}
          headerBg="bg-[#0066B5]"
          headerTextColor="text-white"
          dept="K.G Section"
        />

      </div>

      {/* ─── MODAL: ADD / EDIT FACULTY ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#092F78]">
                {isEditing ? "Edit Faculty Member" : "Add Faculty Member"}
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
                  Department / Section *
                </label>
                <select
                  value={formTeacher.department}
                  onChange={(e) =>
                    setFormTeacher({ ...formTeacher, department: e.target.value as Teacher["department"] })
                  }
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                >
                  <option value="Higher Secondary and Secondary">Higher Secondary and Secondary</option>
                  <option value="Upper Primary">Upper Primary</option>
                  <option value="Primary">Primary</option>
                  <option value="K.G Section">K.G Section</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Teacher Name *
                </label>
                <input
                  type="text"
                  required
                  value={formTeacher.name}
                  onChange={(e) => setFormTeacher({ ...formTeacher, name: e.target.value })}
                  placeholder="e.g. Mrs. Suja George"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-[#0875C9] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formTeacher.email}
                  onChange={(e) => setFormTeacher({ ...formTeacher, email: e.target.value })}
                  placeholder="e.g. teacher@gmail.com"
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
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
