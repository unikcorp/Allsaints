import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Teacher Training Conducted 2023-2024 | All Saints Public School",
  description:
    "Official record of all 32 Continuous Professional Development (CPD) teacher training programs conducted at All Saints Public School, Adoor for the academic year 2023-2024.",
};

interface TrainingItem {
  id: number;
  text: string;
  topic: string;
  duration?: string;
  hours?: string;
}

const TEACHER_TRAININGS: TrainingItem[] = [
  { id: 1, text: "Adolescent Education Programme ( 2 Days (12 hours))", topic: "Adolescent Education Programme", duration: "2 Days", hours: "12 hours" },
  { id: 2, text: "Art Integration (1 Day (06 hours))", topic: "Art Integration", duration: "1 Day", hours: "06 hours" },
  { id: 3, text: "Career Guidance ( 2 Days (12 hours))", topic: "Career Guidance", duration: "2 Days", hours: "12 hours" },
  { id: 4, text: "Classroom Management (2 Days (12 hours))", topic: "Classroom Management", duration: "2 Days", hours: "12 hours" },
  { id: 5, text: "Critical & Creative Thinking ( 2 Days (12 hours))", topic: "Critical & Creative Thinking", duration: "2 Days", hours: "12 hours" },
  { id: 6, text: "Cyber Safety & Security (1 Day (06 hours))", topic: "Cyber Safety & Security", duration: "1 Day", hours: "06 hours" },
  { id: 7, text: "Ethics & Integrity ( 2 Days(12 hours))", topic: "Ethics & Integrity", duration: "2 Days", hours: "12 hours" },
  { id: 8, text: "Experiential Learning ( 2 Days (12 hours))", topic: "Experiential Learning", duration: "2 Days", hours: "12 hours" },
  { id: 9, text: "Gender Sensitivity in Schools ( 1 Day (06 hours))", topic: "Gender Sensitivity in Schools", duration: "1 Day", hours: "06 hours" },
  { id: 10, text: "Happy Classrooms (1 Day (06 hours))", topic: "Happy Classrooms", duration: "1 Day", hours: "06 hours" },
  { id: 11, text: "Inclusive Education (2 Days (12 hours))", topic: "Inclusive Education", duration: "2 Days", hours: "12 hours" },
  { id: 12, text: "Induction Training Programme (Guru", topic: "Induction Training Programme (Guru", duration: "-", hours: "-" },
  { id: 13, text: "Dakshta) ( 2 Days (12 hours))", topic: "Dakshta)", duration: "2 Days", hours: "12 hours" },
  { id: 14, text: "Leading Transformation ( 3 Day (18 hours))", topic: "Leading Transformation", duration: "3 Days", hours: "18 hours" },
  { id: 15, text: "Learning outcomes & Pedagogies (1 Day (06 hours))", topic: "Learning outcomes & Pedagogies", duration: "1 Day", hours: "06 hours" },
  { id: 16, text: "Life skills (Basic) (1 Day (06 hours))", topic: "Life skills (Basic)", duration: "1 Day", hours: "06 hours" },
  { id: 17, text: "Life skills (Advance) (1 Day (06 hours))", topic: "Life skills (Advance)", duration: "1 Day", hours: "06 hours" },
  { id: 18, text: "National Education Policy 2020(1 Day (06 hours))", topic: "National Education Policy 2020", duration: "1 Day", hours: "06 hours" },
  { id: 19, text: "School Health & Wellness ( 2 Days (12 Hours)", topic: "School Health & Wellness", duration: "2 Days", hours: "12 Hours" },
  { id: 20, text: "Stress Management (1 Day (06 hours))", topic: "Stress Management", duration: "1 Day", hours: "06 hours" },
  { id: 21, text: "Values Education ( 1 Day (06 hours))", topic: "Values Education", duration: "1 Day", hours: "06 hours" },
  { id: 22, text: "Theory of Knowledge (1 Day (06 hours))", topic: "Theory of Knowledge", duration: "1 Day", hours: "06 hours" },
  { id: 23, text: "National Curriculum Framework:Foundational Stage ( 1 Day (06 hours))", topic: "National Curriculum Framework:Foundational Stage", duration: "1 Day", hours: "06 hours" },
  { id: 24, text: "Active Learning ( 1 Day (06 hours))", topic: "Active Learning", duration: "1 Day", hours: "06 hours" },
  { id: 25, text: "Active Learning ( 1 Day (06 hours))", topic: "Active Learning", duration: "1 Day", hours: "06 hours" },
  { id: 26, text: "Competency Based Assessment (SecondaryLevel)-Generic ( 2 Days (12 hours))", topic: "Competency Based Assessment (SecondaryLevel)-Generic", duration: "2 Days", hours: "12 hours" },
  { id: 27, text: "Educating Parents about Education (1 Day(06 hours))", topic: "Educating Parents about Education", duration: "1 Day", hours: "06 hours" },
  { id: 28, text: "Environmental Education and Conservation of Natural Resources ( 1 Day (06 hours))", topic: "Environmental Education and Conservation of Natural Resources", duration: "1 Day", hours: "06 hours" },
  { id: 29, text: "Storytelling as Pedagogy (1 Day (06 hours))", topic: "Storytelling as Pedagogy", duration: "1 Day", hours: "06 hours" },
  { id: 30, text: "Disaster Management ( 1 Day (06 hours))", topic: "Disaster Management", duration: "1 Day", hours: "06 hours" },
  { id: 31, text: "National Curriculum Framework for School Education 2023 ( 1 Day (06 hours))", topic: "National Curriculum Framework for School Education 2023", duration: "1 Day", hours: "06 hours" },
  { id: 32, text: "Promoting Mental Health and Wellness among Students ( 1 Day (06 hours))", topic: "Promoting Mental Health and Wellness among Students", duration: "1 Day", hours: "06 hours" },
];

export default function TrainingsPage() {
  return (
    <div className="section-pad container-custom font-sans">
      
      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">Academics</span>
        <span>&rsaquo;</span>
        <span className="text-[#0875C9] font-bold">Trainings</span>
      </nav>

      {/* ─── Top Header Banner in Primary Blue Shade ───────────────── */}
      <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
          TEACHER TRAINING CONDUCTED - 2023-2024
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#D8EAF8]">
          
          <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78] uppercase tracking-tight">
                TEACHER TRAINING CONDUCTED - 2023-2024
              </h2>
              <span className="text-xs text-slate-500 font-sans mt-0.5 block">
                Official Continuous Professional Development (CPD) Record &bull; 32 Programs
              </span>
            </div>
            <span className="inline-block bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] text-xs font-serif font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              32 Sessions Conducted
            </span>
          </div>

          {/* Exact 32 Items Ordered List */}
          <ol className="space-y-3 font-sans">
            {TEACHER_TRAININGS.map((item) => (
              <li
                key={item.id}
                value={item.id}
                className="flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl transition-all hover:bg-[#F4FAFF] border border-slate-100 hover:border-[#D8EAF8]"
              >
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0875C9] text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs">
                  {item.id}
                </span>
                <div className="flex-1 pt-0.5 sm:pt-1">
                  <span className="text-slate-800 font-medium text-sm sm:text-base leading-snug">
                    {item.text}
                  </span>
                </div>
              </li>
            ))}
          </ol>

        </div>

      </div>

    </div>
  );
}
