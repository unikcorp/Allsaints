import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingSidebar from "@/components/layout/FloatingSidebar";
import SchoolAdmissionPopup from "@/components/common/SchoolAdmissionPopup";

export const metadata: Metadata = {
  title: {
    default: "All Saints Public School, Adoor | CBSE Affiliated (930501)",
    template: "%s | All Saints Public School, Adoor",
  },
  description:
    "All Saints Public School — A premier CBSE-affiliated Senior Secondary institution in Adoor, Kerala. Managed by The Malankara Catholic Educational Society of the Diocese of Pathanamthitta.",
  keywords: [
    "All Saints Public School",
    "All Saints Public School Adoor",
    "CBSE school Adoor",
    "Pathanamthitta CBSE schools",
    "CBSE admission Kerala",
    "930501",
  ],
  icons: {
    icon: "/images/logo/allsaints-clean-crest.png",
    apple: "/images/logo/allsaints-clean-crest.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "All Saints Public School, Adoor",
    title: "All Saints Public School, Adoor | To Create Creators",
    description: "Premier CBSE-affiliated Senior Secondary school in Adoor, Kerala.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <FloatingSidebar />
        <Footer />
      </body>
    </html>
  );
}
