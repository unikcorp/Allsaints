import Image from "next/image";
import { FACILITIES } from "@/constants";
import SectionTitle from "@/components/ui/SectionTitle";
import FacilitiesInteractiveGrid from "@/components/facilities/FacilitiesInteractiveGrid";

export default function FacilitiesSection() {
  return (
    <section className="section-pad bg-white border-b border-slate-200">
      <div className="container-custom">
        <SectionTitle
          tag="Campus Facilities"
          title="Modern Infrastructure for Complete Learning"
          subtitle="Equipped spaces supporting daily learning, experimentation, sports, digital literacy, and student safety."
        />

        {/* Featured Campus Images Row */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <div className="relative h-52 rounded-2xl overflow-hidden border border-[#D8EAF8] shadow-sm group">
            <Image
              src="/images/infrastructure/infra-main.jpg"
              alt="School Main Campus Building"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 text-white">
              <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#FFB900] block mb-0.5">
                Main Academic Block
              </span>
              <p className="text-xs text-white/90 font-sans">
                Spacious smart classrooms, administrative offices &amp; auditoriums
              </p>
            </div>
          </div>

          <div className="relative h-52 rounded-2xl overflow-hidden border border-[#D8EAF8] shadow-sm group">
            <Image
              src="/images/infrastructure/infra-campus.jpg"
              alt="School Campus & Green Environment"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 text-white">
              <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#FFB900] block mb-0.5">
                Science Laboratories
              </span>
              <p className="text-xs text-white/90 font-sans">
                Fully equipped Physics, Chemistry, and Biology practical labs.
              </p>
            </div>
          </div>

          <div className="relative h-52 rounded-2xl overflow-hidden border border-[#D8EAF8] shadow-sm group">
            <Image
              src="/images/infrastructure/library.jpg"
              alt="School Resource Library"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 text-white">
              <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#FFB900] block mb-0.5">
                Resourceful Digital Library
              </span>
              <p className="text-xs text-white/90 font-sans">
                Extensive collection of books, periodicals &amp; digital research terminals
              </p>
            </div>
          </div>
        </div>

        {/* Facility Cards Grid */}
        <FacilitiesInteractiveGrid
          facilities={FACILITIES}
          statusLabel="CBSE Compliant Infrastructure"
        />
      </div>
    </section>
  );
}
