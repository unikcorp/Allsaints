import { redirect, notFound } from "next/navigation";
import DocumentViewerPage, {
  generateStaticParams as docGenerateStaticParams,
  generateMetadata as docGenerateMetadata,
} from "../../documents/[slug]/page";

interface Props {
  params: Promise<{ slug: string }>;
}

const SLUG_MAP: Record<string, string> = {
  // About
  "mission-and-vision": "/about/mission-and-vision",
  "our-management": "/about/our-management",
  "pta-and-spc": "/about/pta-and-smc",
  "pta-and-smc": "/about/pta-and-smc",
  "councelling-cell": "/about/counselling-cell",
  "faculty": "/about/faculty",

  // Academics
  "annual-report": "/academics/annual-report",
  "achievements": "/academics/achievements",
  "teacher-training": "/academics/trainings",
  "trainings": "/academics/trainings",
  "admission-procedures": "/admissions/procedure",
  "admission": "/admissions/procedure",
  "strength": "/admissions/strength",
  "enrollment": "/admissions/strength",
  "circulars": "/admissions/circulars",
  "fees-structure": "/admissions/fees",
  "fee-structure": "/admissions/fees",
  "academic-calendar": "/academics/calendar",
  "parliament": "/academics/parliament",
  "textbooks": "/academics/textbooks",
  "results": "/admissions/results",
  "courses": "/academics/courses",
  "non-scholastic-programs": "/academics/non-scholastic-programs",
  "uniforms": "/academics/uniforms",
  "uniform": "/academics/uniforms",

  // Facilities
  "infrastructure": "/facilities/infrastructure",
  "conveyance": "/facilities/conveyance",
  "library": "/facilities/library",

  // Media & Community
  "gallery": "/gallery",
  "news": "/news",

  // Contact
  "contact-us": "/contact",
  "contact": "/contact",
  "complain": "/contact/complain",

  // Statutory Documents
  "deo-request-certificate": "/documents/deo-request-certificate",
  "recognition-certificate": "/documents/recognition-certificate",
  "affiliation-certificate": "/documents/affiliation-certificate",
  "building-fitness-certificate": "/documents/building-fitness-certificate",
  "fire-and-rescue-certificate": "/documents/fire-and-rescue-certificate",
  "school-management-certificate": "/documents/school-management-committee",
  "school-management-committee": "/documents/school-management-committee",
  "eat-right-school-certificate": "/documents/eat-right-school-certificate",
  "trust-society": "/documents/trust-society",
  "noc": "/documents/noc",
  "water-health-and-sanitation-certificate": "/documents/water-health-and-sanitation-certificate",
  "possession-certificate": "/documents/possession-certificate",
};

export async function generateStaticParams() {
  const docParams = await docGenerateStaticParams();
  const allSlugs = Object.keys(SLUG_MAP);
  return Array.from(new Set([...docParams.map((p) => p.slug), ...allSlugs])).map(
    (slug) => ({ slug })
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (SLUG_MAP[slug]) {
    return {
      title: `${slug.replace(/-/g, " ").toUpperCase()} | All Saints Public School`,
    };
  }
  return docGenerateMetadata({ params });
}

export default async function LegacyPageViewer({ params }: Props) {
  const { slug } = await params;

  if (SLUG_MAP[slug]) {
    redirect(SLUG_MAP[slug]);
  }

  // Check if it's a document slug
  try {
    return await DocumentViewerPage({ params });
  } catch {
    notFound();
  }
}
