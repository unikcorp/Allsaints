import { TESTIMONIALS } from "@/constants";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";

export default function Testimonials() {
  return (
    <section className="section-pad bg-[#f8fafc] border-b border-slate-200">
      <div className="container-custom">
        <SectionTitle
          tag="Voice of Parents &amp; Alumni"
          title="What Our Community Says"
          subtitle="Experiences and testimonials from families who chose All Saints Public School."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.id} className="p-6 flex flex-col justify-between bg-white border border-slate-200 shadow-sm">
              <div>
                <div className="flex gap-1 text-[#E89D26] mb-3 text-sm">
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 font-sans">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="font-serif font-bold text-[#002855] text-sm">
                  {t.name}
                </div>
                <div className="text-slate-500 text-xs font-sans">
                  {t.role}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
