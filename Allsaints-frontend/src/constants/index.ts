import type {
  NavItem,
  Stat,
  Feature,
  AcademicProgram,
  Testimonial,
  NewsItem,
  Facility,
  SchoolVideo,
  StatutoryDocument,
} from "@/types";

// ─── Real School Information ──────────────────────────────────────────────────
export const SCHOOL_INFO = {
  name: "All Saints Public School",
  logo: "/images/logo/allsaints-clean-crest.png",
  crest: "/images/logo/allsaints-clean-crest.png",
  motto: "To Create Creators",
  mottoEnglish: "To Create Creators",
  mottoSanskrit: "स्रष्टून् स्रष्टुम्",
  mottoTransliteration: "Srashtoon Srashtum",
  mottoExplanation:
    "With resolute conviction that education is for creating creators and not consumers, both the disciple and the Guru in its process being the Image and Likeness of God, the Creator as well as humanity as a whole has been divinely assigned with the task of filling and subduing the universe and hence cannot but innately be creators and thus His co-creators, envisioning our every progeny dynamically and productively partake in fashioning the universe ever fresh, we shouldered a celestial vocation - establishing and running a top-rated academic institution in a rural area for faultlessly producing infinite tiptop creators to stimulate accomplishing the divinely assigned human task and hence, the motto.",
  address: "All Saints Public School, Pannivizha P O, Adoor, Pathanamthitta, PIN 691523",
  phone: ["+91-7356804100", "+91-6235522549"],
  email: "allsaintsschool501@gmail.com",
  board: "CBSE Affiliated",
  workingHours: "Mon-Fri: 9:00 AM - 4:00 PM | Sat: 9:00 AM - 3:00 PM",
  website: "/",
  whatsapp: "917356804100",
  socials: {
    facebook: "https://www.facebook.com/allsaintsadoor?mibextid=qi2Omg&rdid=moPh7zkjamnqJRon&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AC4QGLFms%2F%3Fmibextid%3Dqi2Omg#",
    youtube: "https://www.youtube.com/@allsaintspublicschooladoor3598",
    instagram: "https://www.instagram.com/all_saints_public_school_adoor?utm_source=qr&igsh=YnJlbDE0b3k0eTcy",
  },
} as const;

// ─── Complete Multi-Level Navigation Menu (Matching Live Site 100%) ───────────
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About ASPS",
    href: "/about",
    children: [
      { label: "Mission & Vision", href: "/about/mission-and-vision" },
      { label: "Our Management", href: "/about/our-management" },
      { label: "PTA & SMC", href: "/about/pta-and-smc" },
      { label: "Counselling Cell", href: "/about/counselling-cell" },
      { label: "Faculty", href: "/about/faculty" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Annual Report", href: "/academics/annual-report" },
      { label: "Achievementts", href: "/academics/achievements" },
      { label: "Trainings", href: "/academics/trainings" },
      { label: "Admission", href: "/admissions/procedure" },
      { label: "Enrollment", href: "/admissions/strength" },
      { label: "Circulars", href: "/admissions/circulars" },
      { label: "Fee Structure", href: "/admissions/fees" },
      { label: "Academic Calender", href: "/academics/calendar" },
      { label: "Parliament", href: "/academics/parliament" },
      { label: "Textbooks", href: "/academics/textbooks" },
      { label: "Results", href: "/admissions/results" },
      { label: "Courses", href: "/academics/courses" },
      { label: "Special Programs", href: "/academics/non-scholastic-programs" },
      { label: "Uniform", href: "/academics/uniforms" },
    ],
  },
  { label: "Online Admission", href: "/admissions/apply" },
  {
    label: "Facilities",
    href: "/facilities",
    children: [
      { label: "Infrastructure", href: "/facilities/infrastructure" },
      { label: "Conveyance", href: "/facilities/conveyance" },
      { label: "Library", href: "/facilities/library" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
  {
    label: "Documents",
    href: "/documents",
    children: [
      { label: "DEO Request Certificate", href: "/documents/deo-request-certificate" },
      { label: "Recognition Certificate", href: "/documents/recognition-certificate" },
      { label: "Affiliation Certificate", href: "/documents/affiliation-certificate" },
      { label: "Building Fitness Cetificate", href: "/documents/building-fitness-certificate" },
      { label: "Fire and Rescue Certificate", href: "/documents/fire-and-rescue-certificate" },
      { label: "School Management Certificate", href: "/documents/school-management-committee" },
      { label: "Eat Right School Certificate", href: "/documents/eat-right-school-certificate" },
      { label: "Trust Society", href: "/documents/trust-society" },
      { label: "NOC", href: "/documents/noc" },
      { label: "Water, Health and Sanitation Certificate", href: "/documents/water-health-and-sanitation-certificate" },
      { label: "Possession Certificate", href: "/documents/possession-certificate" },
    ],
  },
  { label: "Complain", href: "/contact/complain" },
  { label: "Contact Us", href: "/contact" },
];

// ─── 11 Official Statutory Certificates & Documents (Exact Order matching live site) ───
export const STATUTORY_DOCUMENTS: StatutoryDocument[] = [
  {
    slug: "deo-request-certificate",
    order: 1,
    label: "DEO Request Certificate",
    title: "DEO Request Certificate",
    authority: "District Educational Office (DEO), Pathanamthitta",
    status: "Verified & Submitted",
    desc: "Official DEO Request Certificate and land verification documents submitted for CBSE affiliation.",
    pdfUrls: ["/documents/deo-request-1.pdf", "/documents/deo-request-2.pdf"],
  },
  {
    slug: "recognition-certificate",
    order: 2,
    label: "Recognition Certificate",
    title: "Government Recognition Certificate",
    authority: "General Education Department, Government of Kerala",
    status: "Recognized",
    desc: "Certificate of formal recognition under the Kerala Right of Children to Free and Compulsory Education (RTE) Rules.",
    pdfUrls: ["/documents/recognition-certificate.pdf"],
  },
  {
    slug: "affiliation-certificate",
    order: 3,
    label: "Affiliation Certificate",
    title: "CBSE Affiliation Certificate",
    authority: "Central Board of Secondary Education (CBSE), New Delhi",
    status: "Active & Affiliated",
    desc: "Official CBSE Affiliation Extension and Grant Certificate under Affiliation No: 930501.",
    pdfUrls: ["/documents/affiliation-certificate.pdf"],
  },
  {
    slug: "building-fitness-certificate",
    order: 4,
    label: "Building Fitness Cetificate",
    title: "Building Safety & Fitness Certificate",
    authority: "Assistant Engineer, Local Self Government Department (LSGD)",
    status: "Sound & Certified",
    desc: "Structural stability and building fitness certificate confirming campus safety and compliance.",
    pdfUrls: ["/documents/building-fitness-certificate.pdf"],
  },
  {
    slug: "fire-and-rescue-certificate",
    order: 5,
    label: "Fire and Rescue Certificate",
    title: "Fire and Rescue Safety Certificate",
    authority: "Kerala Fire and Rescue Services Department",
    status: "Approved & Certified",
    desc: "Fire and life safety certificate issued by the Kerala Fire and Rescue Services.",
    pdfUrls: ["/documents/fire-rescue-certificate.pdf"],
  },
  {
    slug: "school-management-committee",
    order: 6,
    label: "School Management Certificate",
    title: "School Management Committee (SMC) Approval",
    authority: "The Malankara Catholic Educational Society, Diocese of Pathanamthitta",
    status: "Constituted & Approved",
    desc: "Constitution and official approval of the School Management Committee (SMC).",
    pdfUrls: ["/documents/school-management-committee.pdf"],
  },
  {
    slug: "eat-right-school-certificate",
    order: 7,
    label: "Eat Right School Certificate",
    title: "Eat Right School Certificate",
    authority: "Food Safety and Standards Authority of India (FSSAI)",
    status: "Certified",
    desc: "Certificate awarded under the Eat Right School initiative for ensuring safe, healthy, and wholesome food culture.",
    pdfUrls: ["/documents/eat-right-school-certificate.pdf"],
  },
  {
    slug: "trust-society",
    order: 8,
    label: "Trust Society",
    title: "Trust Society Registration Certificate",
    authority: "Registrar of Societies, Government of Kerala",
    status: "Registered",
    desc: "Registration deed and legal recognition of The Malankara Catholic Educational Society.",
    pdfUrls: ["/documents/trust-society.pdf"],
  },
  {
    slug: "noc",
    order: 9,
    label: "NOC",
    title: "No Objection Certificate (NOC)",
    authority: "General Education Department, Government of Kerala",
    status: "Issued & Valid",
    desc: "State Government No Objection Certificate for establishing and running a CBSE senior secondary school.",
    pdfUrls: ["/documents/noc.pdf"],
  },
  {
    slug: "water-health-and-sanitation-certificate",
    order: 10,
    label: "Water, Health and Sanitation Certificate",
    title: "Water, Health and Sanitation Certificate",
    authority: "Public Health Laboratory & Community Health Centre",
    status: "Hygienic & Safe",
    desc: "Chemical and bacteriological water purity certification and sanitary inspection report.",
    pdfUrls: ["/documents/health-sanitation-1.pdf", "/documents/health-sanitation-2.pdf"],
  },
  {
    slug: "possssion-certificate",
    order: 11,
    label: "Possession Certificate",
    title: "Land Possession Certificate",
    authority: "Revenue Department, Government of Kerala",
    status: "Clear Title & Possession",
    desc: "Official certificate confirming uninterrupted possession and ownership of school campus land.",
    pdfUrls: ["/documents/possession-certificate.pdf"],
  },
];

// ─── Real Management Team with Actual Photo Assets (100% Matching Live Site) ───
export const MANAGEMENT_TEAM = [
  {
    name: "Rev. Fr. Thomas Kumbakattil",
    role: "Founder Manager",
    designation: "Founder Manager of All Saints Public School (Est. June 2002)",
    image: "/images/management/founder-manager.jpg",
  },
  {
    name: "His Excellency Most Rev. Dr. Samuel Mar Irenios",
    role: "Patron",
    designation: "Bishop of Pathanamthitta Diocese & President, The Malankara Catholic Educational Society",
    image: "/images/management/patron.jpg",
  },
  {
    name: "His Excellency Most Rev. Yoohanon Mar Chrysostom",
    role: "Former Patron",
    designation: "Bishop Emeritus, Diocese of Pathanamthitta",
    image: "/images/management/former-patron.jpg",
  },
  {
    name: "Rev. Dr. James (Joseph) Stephen Olikal",
    role: "Principal",
    designation: "Head of Institution (MA, Ph.D)",
    image: "/images/management/principal.jpg",
  },
  {
    name: "Fr. Philipose Charivupurayidathil (Jobin C Kurian)",
    role: "Director",
    designation: "School Administration & Operational Direction",
    image: "/images/management/director.jpg",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS: Stat[] = [
  { value: "100%", label: "CBSE Board Results", icon: "🎓" },
  { value: "2002", label: "Year Established", icon: "🏛️" },
  { value: "LKG - XII", label: "Academic Levels Offered", icon: "📚" },
  { value: "Top Tier", label: "Smart Infrastructure", icon: "⭐" },
];

// ─── Our Specialities ────────────────────────────────────────────────────────
export const SPECIALITIES = [
  {
    id: 1,
    title: "Individual Attention",
    description:
      "Recognizing that every child possesses a unique spark, we track personal milestones to foster potential in an inclusive environment.",
  },
  {
    id: 2,
    title: "Experiential Discovery",
    description:
      "Education at our campus is designed to provoke natural curiosity, steering child pathways beyond textbooks into creative design logic.",
  },
  {
    id: 3,
    title: "Career-Oriented Training",
    description:
      "Ensuring clear bridges to professional sectors, our senior curriculum sharpens fundamental leadership attributes and technological aptitudes.",
  },
  {
    id: 4,
    title: "World-Class Infrastructure",
    description:
      "Equipped with spacious interactive classrooms, modern resources, and premium facilities aligned beautifully with international educational benchmarks.",
  },
  {
    id: 5,
    title: "Physical Culture & Sports",
    description:
      "Promoting resilience and sportsmanship through comprehensive training tracks, specialized clubs, martial arts, and diverse track events.",
  },
  {
    id: 6,
    title: "Value-Driven Foundation",
    description:
      "Rooting technical skill inside a background of ethical core principles, character design frameworks, and proactive civic responsibilities.",
  },
];

// ─── Why Choose Us Cards ──────────────────────────────────────────────────────
export const FEATURES: Feature[] = [
  {
    id: 1,
    icon: "👩‍🏫",
    title: "Experienced Faculty",
    description: "Highly qualified and dedicated teachers providing individualized mentorship and academic coaching.",
  },
  {
    id: 2,
    icon: "🖥️",
    title: "Smart Classrooms",
    description: "Interactive digiboards and audio-visual multimedia facilities in every class for engaging learning.",
  },
  {
    id: 3,
    icon: "⚽",
    title: "Sports & Activities",
    description: "Coaching for football, basketball, yoga, karate, and various martial arts with vast athletic grounds.",
  },
  {
    id: 4,
    icon: "🏆",
    title: "100% CBSE Results",
    description: "Consistent academic excellence with exemplary track records in CBSE Class X & Class XII examinations.",
  },
  {
    id: 5,
    icon: "🔬",
    title: "Advanced Labs",
    description: "Full-fledged Physics, Chemistry, Biology, Computer Science, and Language laboratories.",
  },
  {
    id: 6,
    icon: "🚌",
    title: "Safe Transportation",
    description: "Well-maintained school fleet operating with experienced drivers across major transport routes in Adoor.",
  },
];

// ─── Programs ────────────────────────────────────────────────────────────────
export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: "primary",
    label: "Primary Education",
    grades: "Grades 1 – 5",
    description:
      "Foundation years focusing on play-based learning, foundational literacy and numeracy, curiosity, and character development through interactive methods.",
    subjects: ["English", "Mathematics", "Environmental Studies (EVS)", "Malayalam", "Hindi", "General Knowledge", "Art & Craft"],
  },
  {
    id: "secondary",
    label: "Secondary Education",
    grades: "Grades 6 – 10",
    description:
      "Curriculum emphasizing critical thinking, STEM foundation, social sciences, languages, and comprehensive subject mastery with project-based learning.",
    subjects: ["English Communicative", "Mathematics", "Science (Physics, Chemistry, Biology)", "Social Science", "Malayalam / Hindi", "Information Technology"],
  },
  {
    id: "higher",
    label: "Higher Secondary",
    grades: "Grades 11 – 12",
    description:
      "Specialized streams preparing students thoroughly for competitive examinations (NEET, JEE, KEAM, CUET) and premier university admissions.",
    subjects: [
      "Science Stream: Physics, Chemistry, Biology, Mathematics / Computer Science",
      "Commerce Stream: Accountancy, Business Studies, Economics, Informatics Practices / Mathematics",
      "Humanities Stream: History, Political Science, Economics, Sociology",
    ],
  },
];

// ─── Real Fee Structure Table (2025–26) ──────────────────────────────────────
export const FEE_STRUCTURE_DATA = [
  { class: "Play Class", annual: "4,500", monthly: "2,000", term1: "-", term2: "-", term3: "-", caution: "-" },
  { class: "LKG", annual: "5,000", monthly: "1,500", term1: "5,800", term2: "5,800", term3: "5,800", caution: "-" },
  { class: "UKG", annual: "5,000", monthly: "1,500", term1: "5,800", term2: "5,800", term3: "5,800", caution: "-" },
  { class: "STD I", annual: "5,000", monthly: "1,500", term1: "6,200", term2: "6,200", term3: "6,200", caution: "-" },
  { class: "STD II", annual: "5,000", monthly: "1,500", term1: "6,200", term2: "6,200", term3: "6,200", caution: "-" },
  { class: "STD III", annual: "5,100", monthly: "1,500", term1: "6,400", term2: "6,400", term3: "6,400", caution: "-" },
  { class: "STD IV", annual: "5,100", monthly: "1,500", term1: "6,400", term2: "6,400", term3: "6,400", caution: "-" },
  { class: "STD V", annual: "5,200", monthly: "1,500", term1: "6,600", term2: "6,600", term3: "6,600", caution: "-" },
  { class: "STD VI", annual: "5,200", monthly: "1,500", term1: "6,600", term2: "6,600", term3: "6,600", caution: "-" },
  { class: "STD VII", annual: "5,300", monthly: "1,500", term1: "6,900", term2: "6,900", term3: "6,900", caution: "-" },
  { class: "STD VIII", annual: "5,400", monthly: "1,500", term1: "6,900", term2: "6,900", term3: "6,900", caution: "-" },
  { class: "STD IX", annual: "6,400", monthly: "1,500", term1: "7,100", term2: "7,100", term3: "7,100", caution: "-" },
  { class: "STD X", annual: "6,600", monthly: "1,500", term1: "7,100", term2: "7,100", term3: "7,100", caution: "-" },
  { class: "XI Bio-Maths", annual: "9,500", monthly: "1,500", term1: "8,500", term2: "8,500", term3: "8,500", caution: "2,000" },
  { class: "XI Maths-Computer", annual: "9,500", monthly: "1,500", term1: "8,500", term2: "8,500", term3: "8,500", caution: "2,000" },
  { class: "XI Commerce", annual: "8,000", monthly: "1,500", term1: "8,000", term2: "8,000", term3: "8,000", caution: "2,000" },
  { class: "XII Bio-Maths", annual: "9,500", monthly: "1,500", term1: "8,500", term2: "8,500", term3: "8,500", caution: "-" },
  { class: "XII Maths-Computer", annual: "9,500", monthly: "1,500", term1: "8,500", term2: "8,500", term3: "8,500", caution: "-" },
  { class: "XII Commerce", annual: "8,000", monthly: "1,500", term1: "8,000", term2: "8,000", term3: "8,000", caution: "-" },
];

// ─── Real Bus Conveyance Routes ──────────────────────────────────────────────
export const BUS_ROUTES = [
  "Adoor", "Pandalam", "Thumpamon", "Kaipattoor", "Kodumon",
  "Chandanapally", "Nooranad", "Kadambanad", "Enathu", "Elamannoor",
  "Poothamkara", "Thengamam", "Parakode", "Pannivizha"
];

// ─── Real Non-Scholastic Flagship Programs ────────────────────────────────────
export const FLAGSHIP_PROGRAMS = [
  {
    code: "LUSE",
    title: "Let Us Speak English",
    description: "Class-wise daily program for improving spoken English fluency based on a customized syllabus monitored by teachers and student captains."
  },
  {
    code: "MMC",
    title: "Mega Music Carnival",
    description: "An open platform where hundreds of students perform live music and choral singing under the leadership of the Music Club to build stage confidence."
  },
  {
    code: "CuC",
    title: "Can You Challenge",
    description: "Class-wise one-minute spontaneous, uninterrupted extempore speech challenge testing fluency, quick analytical thinking, and vocabulary in multiple languages."
  },
  {
    code: "PARL",
    title: "Saintsians Students Parliament",
    description: "Annual democratic student election electing Prime Minister, Ministers for Education, Sports, Culture, and Discipline to inculcate governance and leadership."
  }
];

// ─── Facilities with Local Image Assets ───────────────────────────────────────
export const FACILITIES: Facility[] = [
  {
    id: 1,
    name: "Smart Classrooms",
    description: "Spacious interactive classrooms with comfortable seating and digiboards.",
    icon: "🖥️",
    image: "/images/infrastructure/infra-main.jpg",
    detailedDescription: "Our smart digital classrooms integrate modern audiovisual technology with interactive digiboards to make learning immersive, collaborative, and enjoyable. Teachers leverage digital textbooks, 3D simulations, educational videos, and real-time quizzes to ensure concepts are deeply grasped.",
    features: [
      "Interactive touch-enabled digital whiteboards",
      "High-definition multimedia projectors & audio",
      "Ergonomic dual-desk student seating",
      "Well-ventilated, natural light-infused layouts",
      "High-speed campus network connectivity",
      "Preloaded CBSE-aligned curriculum content"
    ],
    specs: [
      { label: "Classrooms Count", value: "35+ Smart Rooms" },
      { label: "Capacity", value: "35-40 Students / Class" },
      { label: "Board Type", value: "Interactive Touch Panels" },
      { label: "Safety", value: "Dual Emergency Exits & CCTV" }
    ]
  },
  {
    id: 2,
    name: "Science Laboratories",
    description: "Fully equipped Physics, Chemistry, and Biology practical labs.",
    icon: "🔬",
    image: "/images/infrastructure/infra-campus.jpg",
    detailedDescription: "Three fully independent, spacious laboratories for Physics, Chemistry, and Biology engineered in strict compliance with CBSE Senior Secondary norms. Students gain firsthand experiential knowledge through practical experiments under expert teacher supervision.",
    features: [
      "Dedicated Physics lab with optical benches & circuit rigs",
      "Chemistry lab with acid-resistant workstations & fume exhaust",
      "Biology lab with compound microscopes & botanical specimens",
      "Safety emergency shower and first-aid stations",
      "Individual student workspace tables with gas & water taps",
      "Fire safety extinguishers & chemical storage lockers"
    ],
    specs: [
      { label: "Lab Units", value: "Physics, Chemistry, Biology" },
      { label: "Safety Standard", value: "CBSE & Fire Safety Certified" },
      { label: "Workstations", value: "40 Students Simultaneously" },
      { label: "Supervision", value: "Lab Assistant & Faculty Present" }
    ]
  },
  {
    id: 3,
    name: "Computer & Language Lab",
    description: "Advanced systems with high-speed internet, interactive panels, and audio headsets.",
    icon: "💻",
    image: "/images/infrastructure/infra-main.jpg",
    detailedDescription: "Equipped with high-performance desktop computers, optical broadband, and specialized English language lab software. Students acquire essential 21st-century digital literacy, coding, algorithmic thinking, and spoken English communication skills.",
    features: [
      "Modern branded desktop workstations with LED monitors",
      "Dedicated digital language lab software & audio headsets",
      "High-speed optical fiber internet connection",
      "Centralized UPS power backup for uninterrupted sessions",
      "Python, C++, and Scratch programming environments",
      "Safe browsing filters and strict firewall security"
    ],
    specs: [
      { label: "Workstations", value: "50+ Dedicated Computers" },
      { label: "Internet", value: "100 Mbps Dedicated Fiber" },
      { label: "Power", value: "10 KVA Dedicated Online UPS" },
      { label: "Software", value: "Language Lab & Coding Suites" }
    ]
  },
  {
    id: 4,
    name: "Resourceful Library",
    description: "Spacious library with thousands of reference books, periodicals, and study spaces.",
    icon: "📚",
    image: "/images/infrastructure/library.jpg",
    detailedDescription: "A vibrant intellectual hub housing more than 10,000 volumes, reference encyclopedias, national journals, educational periodicals, and daily newspapers. Includes comfortable silent reading zones and digital catalog search.",
    features: [
      "Extensive collection of CBSE curriculum reference books",
      "Wide selection of world fiction, classics, and biographies",
      "Weekly periodicals, science journals, and dailies",
      "Quiet individual study carrels and group reading tables",
      "Computerized barcode library circulation system",
      "Dedicated junior corner for primary and kindergarten kids"
    ],
    specs: [
      { label: "Book Volume", value: "10,000+ Titles" },
      { label: "Periodicals", value: "30+ Magazines & Journals" },
      { label: "Reading Capacity", value: "80 Students at a time" },
      { label: "System", value: "Digital Catalog & Circulation" }
    ]
  },
  {
    id: 5,
    name: "Auditorium & Staff Rooms",
    description: "Grand auditorium for school functions, cultural fests, and spacious faculty rooms.",
    icon: "🏛️",
    image: "/images/infrastructure/infra-campus.jpg",
    detailedDescription: "A grand multi-purpose auditorium built to host school assemblies, inter-school cultural competitions, annual day fests, seminars, and guest lectures. Alongside are well-appointed faculty workrooms with individual teacher stations.",
    features: [
      "Acoustically treated multi-tier indoor auditorium",
      "Professional stage lighting and digital audio mixer setup",
      "Comfortable seating for large student and parent gatherings",
      "Airy faculty staff rooms equipped with lockers and PCs",
      "Dedicated conference space for department meetings",
      "Green rooms and backstage changing areas"
    ],
    specs: [
      { label: "Capacity", value: "1,200+ Seating Capacity" },
      { label: "Acoustics", value: "Digital Line-Array Sound System" },
      { label: "Usage", value: "Assemblies, Fests & Seminars" },
      { label: "Staff Rooms", value: "Dedicated Primary & Senior Wings" }
    ]
  },
  {
    id: 6,
    name: "Vast Sports Grounds",
    description: "Outdoor tracks, courts, and specialized coaching for yoga, karate, and team sports.",
    icon: "⚽",
    image: "/images/gallery/event-1.jpg",
    detailedDescription: "Expansive outdoor sports grounds providing professional facilities for athletic track events, football, cricket, volleyball, basketball, and badminton. Supported by regular physical education classes, yoga sessions, and martial arts training.",
    features: [
      "Full-sized football field and standard cricket pitch",
      "Marked 200m running track for athletic meets",
      "Outdoor basketball, volleyball, and badminton courts",
      "Specialized karate, taekwondo, and martial arts ring",
      "Dedicated yoga pavilion for morning wellness sessions",
      "Indoor games arena for chess, carrom, and table tennis"
    ],
    specs: [
      { label: "Ground Area", value: "Multiple Acres Dedicated" },
      { label: "Sports Offered", value: "Football, Athletics, Cricket, Yoga" },
      { label: "Coaching", value: "Certified Physical Education Mentors" },
      { label: "Events", value: "Annual Saintsian Olympics" }
    ]
  },
  {
    id: 7,
    name: "Clean Amenities & Pure Water",
    description: "Hygienic washrooms with continuous availability of RO-purified drinking water.",
    icon: "🚰",
    image: "/images/infrastructure/infra-main.jpg",
    detailedDescription: "Ensuring the highest standards of student health and hygiene with modern multi-stage Reverse Osmosis (RO) drinking water treatment plants and impeccably sanitized washroom blocks.",
    features: [
      "Commercial RO water purification plants with UV treatment",
      "Regular chemical and biological water purity testing",
      "Stainless steel chilled and normal drinking water stations",
      "Separate hygienic washrooms for boys, girls, and staff on each floor",
      "Continuous 24x7 water supply with dedicated reservoirs",
      "Dedicated sanitation team for routine hourly sanitization"
    ],
    specs: [
      { label: "Water Quality", value: "FSSAI & Health Dept Certified" },
      { label: "Purification", value: "Multi-Stage RO + UV Filtration" },
      { label: "Sanitation", value: "Regular Hourly Cleaning Protocol" },
      { label: "Safety", value: "Touch-free Faucets & Dispensers" }
    ]
  },
  {
    id: 8,
    name: "Safety & CCTV Surveillance",
    description: "Complete CCTV coverage, fire safety installations, and strict security protocol.",
    icon: "🛡️",
    image: "/images/infrastructure/infra-campus.jpg",
    detailedDescription: "Round-the-clock comprehensive campus security network ensuring student safety. Covered with high-definition CCTV surveillance across corridors, gates, grounds, and common areas, backed by security guards and fire safety systems.",
    features: [
      "High-definition IP surveillance cameras covering all zones",
      "Monitored security cabin at campus entry and exit gates",
      "Strict visitor registration and parent gate pass verification",
      "Fire safety hydrants, alarms, and extinguishers per norms",
      "First-aid medical room with trained emergency response",
      "GPS tracking and speed control on all 14 school bus routes"
    ],
    specs: [
      { label: "Surveillance", value: "60+ HD Cameras 24x7" },
      { label: "Fire Safety", value: "Kerala Fire & Rescue Certified" },
      { label: "Transport Safety", value: "GPS & Speed Governors Installed" },
      { label: "Medical Aid", value: "Dedicated First-Aid Infirmary" }
    ]
  },
  {
    id: 9,
    name: "Eco-Friendly & Green Farm Campus",
    description: "Serene campus atmosphere with active agricultural farm units and solar energy.",
    icon: "🌿",
    image: "/images/infrastructure/campus-farm-1.jpg",
    detailedDescription: "Nestled across 10 serene acres with lush herbal gardens, organic vegetable cultivation plots, flowering groves, and solar power installations. Students participate in hands-on organic farming to cultivate environmental stewardship.",
    features: [
      "Student-managed organic vegetable and herbal garden",
      "Solar energy panels contributing clean electricity",
      "Rainwater harvesting systems for groundwater replenishment",
      "Composting pit and eco-waste management protocol",
      "Plastic-free, pollution-free lush green environment",
      "Outdoor biology study spots amidst nature"
    ],
    specs: [
      { label: "Campus Size", value: "10-Acre Eco Sanctuary" },
      { label: "Green Initiatives", value: "Organic Farming & Solar Power" },
      { label: "Water Conservation", value: "Rainwater Harvesting Wells" },
      { label: "Environment", value: "Zero Single-Use Plastic Policy" }
    ]
  },
];

// ─── Real School Videos (All Official YouTube Channel & Website Embeds) ──────
export const SCHOOL_VIDEOS: SchoolVideo[] = [
  // ── Sports & Athletics
  {
    id: "MTEOCQBDy4o",
    title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 6",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/MTEOCQBDy4o",
    youtubeUrl: "https://www.youtube.com/watch?v=MTEOCQBDy4o",
  },
  {
    id: "GEs8hbeXuuQ",
    title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 5",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/GEs8hbeXuuQ",
    youtubeUrl: "https://www.youtube.com/watch?v=GEs8hbeXuuQ",
  },
  {
    id: "vkxLmiMgDdk",
    title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 4",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/vkxLmiMgDdk",
    youtubeUrl: "https://www.youtube.com/watch?v=vkxLmiMgDdk",
  },
  {
    id: "wjV8p3uiw58",
    title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 3",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/wjV8p3uiw58",
    youtubeUrl: "https://www.youtube.com/watch?v=wjV8p3uiw58",
  },
  {
    id: "uFqSzaoz9g0",
    title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Session 2",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/uFqSzaoz9g0",
    youtubeUrl: "https://www.youtube.com/watch?v=uFqSzaoz9g0",
  },
  {
    id: "2o0SRVKmFAM",
    title: "Saintsian Olympics 2K26 @ Kodumon Stadium - Grand Opening",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/2o0SRVKmFAM",
    youtubeUrl: "https://www.youtube.com/watch?v=2o0SRVKmFAM",
  },
  {
    id: "BqvPke7STXM",
    title: "Kids Sports Meet & Athletic Fun Day",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/BqvPke7STXM",
    youtubeUrl: "https://www.youtube.com/watch?v=BqvPke7STXM",
  },
  {
    id: "jYVSrtKqiRE",
    title: "School Football Match & Training Drills",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/jYVSrtKqiRE",
    youtubeUrl: "https://www.youtube.com/watch?v=jYVSrtKqiRE",
  },
  {
    id: "VNW_p9cDD_4",
    title: "Inter-House Football Championship Tournament",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/VNW_p9cDD_4",
    youtubeUrl: "https://www.youtube.com/watch?v=VNW_p9cDD_4",
  },
  {
    id: "hxCnTbPsTAE",
    title: "Sports Club Activity & Physical Conditioning",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/hxCnTbPsTAE",
    youtubeUrl: "https://www.youtube.com/watch?v=hxCnTbPsTAE",
  },
  {
    id: "BYHtD9wyVWA",
    title: "All Saints Chess Championship & Mind Sports",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/BYHtD9wyVWA",
    youtubeUrl: "https://www.youtube.com/watch?v=BYHtD9wyVWA",
  },
  {
    id: "-QoPt0Pb7iY",
    title: "Kick the Goal (Sports Club) - Match 2",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/-QoPt0Pb7iY",
    youtubeUrl: "https://www.youtube.com/watch?v=-QoPt0Pb7iY",
  },
  {
    id: "lKc5Sa40tpg",
    title: "Kick the Goal (Sports Club) - Match 1",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/lKc5Sa40tpg",
    youtubeUrl: "https://www.youtube.com/watch?v=lKc5Sa40tpg",
  },
  {
    id: "QGx7szNSETA",
    title: "Kick the Goal (Sports Club) - Skills Session",
    category: "Sports & Athletics",
    embedUrl: "https://www.youtube.com/embed/QGx7szNSETA",
    youtubeUrl: "https://www.youtube.com/watch?v=QGx7szNSETA",
  },

  // ── Annual Day & Fests
  {
    id: "oatN_3kYZvQ",
    title: "Annual Day Celebrations | SAINTSANTHE 2K23 | Part 01",
    category: "Annual Day & Fests",
    embedUrl: "https://www.youtube.com/embed/oatN_3kYZvQ",
    youtubeUrl: "https://www.youtube.com/watch?v=oatN_3kYZvQ",
  },
  {
    id: "TFRufn6aeSQ",
    title: "Annual Day Celebrations | SAINTSANTHE 2K23 | Part 02",
    category: "Annual Day & Fests",
    embedUrl: "https://www.youtube.com/embed/TFRufn6aeSQ",
    youtubeUrl: "https://www.youtube.com/watch?v=TFRufn6aeSQ",
  },
  {
    id: "jyij6XIslJ0",
    title: "Annual Day Celebrations | SAINTSANTHE 2K23 | Part 03",
    category: "Annual Day & Fests",
    embedUrl: "https://www.youtube.com/embed/jyij6XIslJ0",
    youtubeUrl: "https://www.youtube.com/watch?v=jyij6XIslJ0",
  },
  {
    id: "VP5075l0R7Y",
    title: "ARPEGGIO Season 5 Day 4 - Music & Cultural Gala",
    category: "Annual Day & Fests",
    embedUrl: "https://www.youtube.com/embed/VP5075l0R7Y",
    youtubeUrl: "https://www.youtube.com/watch?v=VP5075l0R7Y",
  },
  {
    id: "wVCFv7EHRKY",
    title: "Arts Fest - Creative & Cultural Stage Performances",
    category: "Annual Day & Fests",
    embedUrl: "https://www.youtube.com/embed/wVCFv7EHRKY",
    youtubeUrl: "https://www.youtube.com/watch?v=wVCFv7EHRKY",
  },

  // ── Campus Life & Ceremonies
  {
    id: "NCYhYtsLGBU",
    title: "ALL SAINTS SCHOOL ANTHEM (Official Video)",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/NCYhYtsLGBU",
    youtubeUrl: "https://www.youtube.com/watch?v=NCYhYtsLGBU",
  },
  {
    id: "pRwRAYmVIQ4",
    title: "All Saints' Public School - Campus Tour & Heritage",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/pRwRAYmVIQ4",
    youtubeUrl: "https://www.youtube.com/watch?v=pRwRAYmVIQ4",
  },
  {
    id: "KcxiKU8D-O0",
    title: "All Saints School - Life at ASPS",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/KcxiKU8D-O0",
    youtubeUrl: "https://www.youtube.com/watch?v=KcxiKU8D-O0",
  },
  {
    id: "BCK00qhRLXM",
    title: "National Anthem & School Flag Ceremonies",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/BCK00qhRLXM",
    youtubeUrl: "https://www.youtube.com/watch?v=BCK00qhRLXM",
  },
  {
    id: "7V3rM65vrdc",
    title: "School Morning Assembly & Moral Reflection",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/7V3rM65vrdc",
    youtubeUrl: "https://www.youtube.com/watch?v=7V3rM65vrdc",
  },
  {
    id: "WWVjEN-tsuU",
    title: "Club Formation & Investiture Ceremony - Main Highlights",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/WWVjEN-tsuU",
    youtubeUrl: "https://www.youtube.com/watch?v=WWVjEN-tsuU",
  },
  {
    id: "IhZhNgCYqRY",
    title: "Club Formation & Investiture Ceremony - Part 1",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/IhZhNgCYqRY",
    youtubeUrl: "https://www.youtube.com/watch?v=IhZhNgCYqRY",
  },
  {
    id: "Sr20fxJQTWk",
    title: "Club Formation & Investiture Ceremony - Part 2",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/Sr20fxJQTWk",
    youtubeUrl: "https://www.youtube.com/watch?v=Sr20fxJQTWk",
  },
  {
    id: "XHKU0ietzlQ",
    title: "School Parliament Election - Democratic Student Leadership",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/XHKU0ietzlQ",
    youtubeUrl: "https://www.youtube.com/watch?v=XHKU0ietzlQ",
  },
  {
    id: "4_3cdU6qyeU",
    title: "Official School Inspection & Quality Assessment",
    category: "Campus Life & Ceremonies",
    embedUrl: "https://www.youtube.com/embed/4_3cdU6qyeU",
    youtubeUrl: "https://www.youtube.com/watch?v=4_3cdU6qyeU",
  },

  // ── Clubs & Academics
  {
    id: "CLbGMii7nbM",
    title: "AI NEXUS - Student Artificial Intelligence Exhibition",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/CLbGMii7nbM",
    youtubeUrl: "https://www.youtube.com/watch?v=CLbGMii7nbM",
  },
  {
    id: "fAK4PY4D8_M",
    title: "Creative Arts Club - Fine Arts & Crafts Exhibition",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/fAK4PY4D8_M",
    youtubeUrl: "https://www.youtube.com/watch?v=fAK4PY4D8_M",
  },
  {
    id: "ED4EFwISFjc",
    title: "Inter-Class Spell Bee Competition & Vocabulary Challenge",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/ED4EFwISFjc",
    youtubeUrl: "https://www.youtube.com/watch?v=ED4EFwISFjc",
  },
  {
    id: "QV2cifyebDQ",
    title: "National Reading Week Celebrations & Book Review Sessions",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/QV2cifyebDQ",
    youtubeUrl: "https://www.youtube.com/watch?v=QV2cifyebDQ",
  },
  {
    id: "l7sh8Fkf0cc",
    title: "Anti-Narcotics Club Awareness Programme - Session 1",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/l7sh8Fkf0cc",
    youtubeUrl: "https://www.youtube.com/watch?v=l7sh8Fkf0cc",
  },
  {
    id: "WOzxWKBit3w",
    title: "Anti-Narcotics Club Awareness Programme - Session 2",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/WOzxWKBit3w",
    youtubeUrl: "https://www.youtube.com/watch?v=WOzxWKBit3w",
  },
  {
    id: "aVm6YaJ2mWk",
    title: "World Environment Day - A Day with Nature & Organic Campus",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/aVm6YaJ2mWk",
    youtubeUrl: "https://www.youtube.com/watch?v=aVm6YaJ2mWk",
  },
  {
    id: "HozHD2616vo",
    title: "SAINTSIAN NEWS - Student Media & Broadcasting Channel",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/HozHD2616vo",
    youtubeUrl: "https://www.youtube.com/watch?v=HozHD2616vo",
  },
  {
    id: "N-Mzhv2wkKQ",
    title: "Result News - 100% CBSE Board Examination Laurels",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/N-Mzhv2wkKQ",
    youtubeUrl: "https://www.youtube.com/watch?v=N-Mzhv2wkKQ",
  },
  {
    id: "IPRkONyNrqs",
    title: "Annual Report Presentation - Milestones & Vision",
    category: "Clubs & Academics",
    embedUrl: "https://www.youtube.com/embed/IPRkONyNrqs",
    youtubeUrl: "https://www.youtube.com/watch?v=IPRkONyNrqs",
  },
];

// ─── Real News Items from the Live Website ────────────────────────────────────
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    title: "Triumph of Excellence: Class XII CBSE Results 2026",
    excerpt: "All Saints Public School students achieve outstanding distinction in the Senior School Certificate Examinations, carrying forward the school's legacy of excellence.",
    date: "2026-05-20",
    category: "result",
    slug: "triumph-of-excellence-class-xii-cbse-results-2026",
  },
  {
    id: 2,
    title: "Class X CBSE Results 2026: A Legacy of Academic Excellence Continued",
    excerpt: "Celebration of 100% board pass percentage in Secondary School Examination with remarkable counts of full A1 graders and subject toppers.",
    date: "2026-04-30",
    category: "result",
    slug: "class-x-cbse-results-2026-a-legacy-of-academic-excellence-continued",
  },
  {
    id: 3,
    title: "Admissions Open 2026–27: Shape Your Child's Future Today",
    excerpt: "Registrations now active from Playschool, LKG, UKG up to Class 11. Secure enrollment in our digital admission portal.",
    date: "2026-01-15",
    category: "notice",
    slug: "admissions-open-2026-27",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "S. Mathew",
    role: "Parent of Class X Student",
    quote: "The personalized attention and values instilled at All Saints have provided my son with immense confidence and exemplary academic clarity.",
    rating: 5,
  },
  {
    id: 2,
    name: "Dr. Elizabeth Thomas",
    role: "Parent of Class XII Alumna",
    quote: "All Saints Public School has created an exceptional environment where teachers take genuine responsibility for every child's moral and intellectual growth.",
    rating: 5,
  },
  {
    id: 3,
    name: "George Kurian",
    role: "Parent of Primary Student",
    quote: "The smart classrooms, serene green campus, and disciplined faculty make this the best CBSE institution in the Adoor region.",
    rating: 5,
  },
];
