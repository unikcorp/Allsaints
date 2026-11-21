import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

export default function VideoSpotlightSection() {
  return (
    <section className="section-pad bg-[#F0F9FF]/40 border-b border-slate-100">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionTitle
            tag="Experience ASPS"
            title="A Glimpse into Life at All Saints"
            align="left"
            className="mb-0"
          />
          <Button href="/gallery#videos" variant="outline" size="sm">
            View All 39 Videos in Gallery &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Video 1: Campus Tour */}
          <div className="bg-white border border-[#BAE6FD] rounded-xl overflow-hidden shadow-sm hover:border-[#0284C7] transition-all">
            <div className="relative aspect-video w-full bg-slate-900">
              <iframe referrerPolicy="strict-origin-when-cross-origin"
                src="https://www.youtube.com/embed/pRwRAYmVIQ4"
                title="All Saints' Public School Campus Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7] block mb-1 font-sans">
                Campus Documentary
              </span>
              <h3 className="font-serif font-bold text-[#0F2744] text-base mb-1 uppercase tracking-tight">
                All Saints&apos; Public School - Campus Tour &amp; Heritage
              </h3>
              <p className="text-slate-600 text-xs font-sans">
                Explore our lush green eco-friendly campus, smart classrooms, athletic infrastructure, and academic ambiance in Adoor.
              </p>
            </div>
          </div>

          {/* Featured Video 2: School Anthem */}
          <div className="bg-white border border-[#BAE6FD] rounded-xl overflow-hidden shadow-sm hover:border-[#0284C7] transition-all">
            <div className="relative aspect-video w-full bg-slate-900">
              <iframe referrerPolicy="strict-origin-when-cross-origin"
                src="https://www.youtube.com/embed/NCYhYtsLGBU"
                title="All Saints School Anthem"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A] block mb-1 font-sans">
                School Heritage
              </span>
              <h3 className="font-serif font-bold text-[#0F2744] text-base mb-1 uppercase tracking-tight">
                Official All Saints School Anthem
              </h3>
              <p className="text-slate-600 text-xs font-sans">
                The inspiring anthem of All Saints Public School, encapsulating the celestial motto: &ldquo;To Create Creators&rdquo;.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
