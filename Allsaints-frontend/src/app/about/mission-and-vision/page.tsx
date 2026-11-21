import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Mission & Vision | All Saints Public School, Adoor",
  description:
    "Official Mission, Vision, and Motto of All Saints Public School, Adoor under The Malankara Catholic Educational Society of the Diocese of Pathanamthitta.",
};

export default function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-[#F4FAFF] font-sans pb-16">
      
      {/* ─── HERO HEADER SECTION MATCHING EXACT REFERENCE DESIGN ─── */}
      <section className="relative w-full overflow-hidden bg-white border-b border-[#D8EAF8] shadow-xs">
        
        {/* 1. Subtle School Building Image on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/infrastructure/infra-main.jpg"
              alt="All Saints Public School Campus Building"
              fill
              priority
              className="object-cover object-right-top opacity-35"
              sizes="(max-width: 768px) 55vw, 42vw"
            />
            {/* Soft horizontal and vertical gradient masks for smooth transition into white background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
          </div>
        </div>

        {/* 2. Soft Blue Wave Flowing Horizontally Across Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <svg
            className="absolute left-0 bottom-0 h-full w-[70%] sm:w-[60%] md:w-[50%] min-w-[320px] opacity-40"
            viewBox="0 0 600 240"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-20,240 C80,220 140,160 220,140 C310,118 390,165 480,130 C530,110 570,70 600,30 L600,240 Z"
              fill="url(#waveGradient1)"
            />
            <path
              d="M-20,240 C60,240 120,195 190,175 C270,152 350,190 430,160 C500,135 550,95 600,60 L600,240 Z"
              fill="url(#waveGradient2)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="40%" x2="100%" y2="60%">
                <stop offset="0%" stopColor="#0879C9" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EAF5FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="30%" x2="100%" y2="70%">
                <stop offset="0%" stopColor="#0756A5" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#0879C9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3. Header Foreground Content */}
        <div className="container-custom relative z-10 pt-6 sm:pt-8 pb-10 sm:pb-12 md:pb-14">
          
          {/* Breadcrumb Navigation: Home › About ASPS › Mission & Vision */}
          <nav className="mb-6 sm:mb-8 text-xs sm:text-[13px] font-sans font-medium text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#0879C9] transition-colors">
              Home
            </Link>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-500">About ASPS</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-[#0879C9] font-bold">Mission &amp; Vision</span>
          </nav>

          {/* Centered Rounded Blue Gradient Banner with Horizontal Decorative Lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 my-2 sm:my-4">
            
            {/* Left Horizontal Decorative Line (Tapered) */}
            <div
              className="hidden sm:block flex-1 h-[2.5px] max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[240px] bg-gradient-to-r from-transparent via-[#0879C9]/60 to-[#0879C9] rounded-l-full"
              aria-hidden="true"
            />

            {/* Pill Banner */}
            <div className="rounded-full bg-gradient-to-r from-[#0879C9] via-[#0756A5] to-[#0756A5] px-8 sm:px-12 md:px-16 lg:px-20 py-3 sm:py-3.5 md:py-4 shadow-lg shadow-[#0756A5]/25 border border-white/20 flex-shrink-0 transition-transform hover:scale-[1.01]">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-serif font-black uppercase tracking-wider text-white drop-shadow-sm select-none text-center">
                MISSION &amp; VISION
              </h1>
            </div>

            {/* Right Horizontal Decorative Line (Tapered) */}
            <div
              className="hidden sm:block flex-1 h-[2.5px] max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[240px] bg-gradient-to-r from-[#0879C9] via-[#0879C9]/60 to-transparent rounded-r-full"
              aria-hidden="true"
            />
          </div>

        </div>
      </section>

      {/* ─── Mission, Vision & Motto Cards Matching Live Site (100% Preserved) ─── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="space-y-6 sm:space-y-8">
          
          {/* 1. Our Mission */}
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm border-t-4 border-t-[#0875C9] border border-[#D8EAF8] transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78]">
                Our Mission
              </h2>
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0875C9] bg-[#EAF6FF] px-3.5 py-1 rounded-full border border-[#D8EAF8]">
                Mission Statement
              </span>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans">
              We, the &ldquo;Saintsians&rdquo; (after the name All Saints), are dedicated to the execution and fostering of love, justice and service imparted by Jesus Christ, provision of equal opportunity, promotion of gender equality, preservation of the integrity of creation, religious tolerance, national integration etc., empowerment of women and the marginalized, direct involvement in the integral development of the society, combating the evils of discrimination, corruption, violence, communalism and drug abuse, generation and dissemination of true and up-to-date knowledge that leads to wisdom etc. and thus to fulfil the noble dreams of our founders, patrons and forerunners. Competent and dedicated teaching, non-teaching faculty, integrated, quality assured and innovative academic programme, measurable outcome based, art-integrated, gamified and blended teaching-learning and evaluation process, ample hands-on training for competency and skill development, state-of-the-art pedagogical strategies, scientific assessment process, updated technology support, plentiful opportunities for curricular, cocurricular and extracurricular activities and the consequent 360° child development, encouragement for and implementation of innovative and creative ideas, serene and inspiring ambiance, positive outlook and character formation, wellness exercises, motivated discipline, self-confidence boosting exercises, futuristic thinking initiatives and focused freedom of expression, resource mobility, civilization of the individuals and society, cohabitation and teamwork, collaboration with renowned institutions, effective communication among parents, teachers and students, inculcation of human, ethical, societal and national values, effective communication techniques and media, participation and triumphing in national, international competitions, career advancement and entrance oriented coaching etc. are only some of the areas which we have and emphasize upon.
            </p>
          </div>

          {/* 2. Our Vision */}
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm border-t-4 border-t-[#0875C9] border border-[#D8EAF8] transition-all hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78]">
                Our Vision
              </h2>
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0875C9] bg-[#EAF6FF] px-3.5 py-1 rounded-full border border-[#D8EAF8]">
                Visionary Goal
              </span>
            </div>
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans">
              <p>
                Believing that the Creator fashioned the universe not as a finished product but with intrinsic and interminable longing for substantial, determined and constant progression until its goal-fulfilment at the end, and the human, He made him out of its elements, mixing him with divinity and its powers, placing him at its center to vivify and lead the globe to attain its goal, hence, having been convinced that every child is with immense and multifaceted innate potential for being a creative contributor, equally important partaker and with unquenchable craving for innovation in accomplishing the human task, furthermore, having been assertive of our divine task of bringing up truly talented creators for the new-gen world, we, the Malankara Catholic Educational Society of the Diocese of Pathanamthitta, as part of carrying forward its divine vocation of educating and illuminating the generations modelled after Jesus Christ, had started this school in 2002 to facilitate and equip such vibrant young creators. The name of the School, &ldquo;All Saints&rdquo;, has been purposefully chosen with a vision of leading and converting all its stakeholders, especially the learners, and their associated ones into sainthood, the state of being realized and pulled off one’s own assigned task in this world with purity, integrity, companionship and perfection. Hence, the name always urges us to reiterate our commitment of accomplishing the divine task of making all the stakeholders saints. A civilized society full of saints moulded by us is our crest and crown.
              </p>
              <p>
                Inspired by our founders and guided by divine values, we strive to shape young creators who will lead with wisdom, compassion, and excellence in a rapidly evolving world.
              </p>
            </div>
          </div>

          {/* 3. Our Motto */}
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm border-t-4 border-t-[#FFB900] border border-[#D8EAF8] text-center transition-all hover:shadow-md">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#FFB900] block mb-2">
              School Motto
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78] mb-3">
              Our Motto
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700 font-serif mb-2">
              स्रष्टून् स्रष्टुम्
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#FFB900] font-serif mb-6">
              &ldquo;To Create Creators&rdquo;
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mx-auto mb-6" />
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify max-w-6xl mx-auto font-sans">
              With resolute conviction that education is for creating creators and not consumers, both the disciple and the Guru in its process being the Image and Likeness of God, the Creator as well as humanity as a whole has been divinely assigned with the task of filling and subduing the universe and hence cannot but innately be creators and thus His co-creators, envisioning our every progeny dynamically and productively partake in fashioning the universe ever fresh, we shouldered a celestial vocation - establishing and running a top-rated academic institution in a rural area for faultlessly producing infinite tiptop creators to stimulate accomplishing the divinely assigned human task and hence, the motto.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
