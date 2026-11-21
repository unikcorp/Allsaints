import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeatureTickerSection from "@/components/home/FeatureTickerSection";
import HomeHighlightsSection from "@/components/home/HomeHighlightsSection";
import ManagementSection from "@/components/home/ManagementSection";
import SpecialitiesSection from "@/components/home/SpecialitiesSection";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import VideoSpotlightSection from "@/components/home/VideoSpotlightSection";
import CampusLocationMap from "@/components/home/CampusLocationMap";
import AdmissionCTA from "@/components/home/AdmissionCTA";

export const metadata: Metadata = {
  title: "All Saints Public School, Adoor | CBSE Affiliated (930773)",
  description:
    "Official website of All Saints Public School, Adoor, Pathanamthitta. Affiliated to CBSE, New Delhi. Managed by The Malankara Catholic Educational Society of the Diocese of Pathanamthitta.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero with Automatic Horizontal Background Carousel */}
      <Hero />

      {/* 2. Floating 4-Feature Strip & Horizontal Daily News Ticker */}
      <FeatureTickerSection />

      {/* 3. 3-Column Highlights (About Our School, Latest News, Our Gallery) */}
      <HomeHighlightsSection />

      {/* 4. Leadership & Patrons (Large Stately Portraits for Patron, Former Patron & Principal) */}
      <ManagementSection />

      {/* 5. Specialities & Educational Pillars */}
      <SpecialitiesSection />

      {/* 6. Campus Facilities & Infrastructure */}
      <FacilitiesSection />

      {/* 7. School Videos Spotlight */}
      <VideoSpotlightSection />

      {/* 8. Interactive Campus Location Google Map */}
      <CampusLocationMap />

      {/* 9. Admission Enquiry Call to Action */}
      <AdmissionCTA />
    </>
  );
}
