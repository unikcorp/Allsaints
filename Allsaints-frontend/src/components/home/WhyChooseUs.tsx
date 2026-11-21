import { FEATURES } from "@/constants";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";

export default function WhyChooseUs() {
  return (
    <section className="section-pad bg-white border-b border-slate-200">
      <div className="container-custom">
        <SectionTitle
          tag="Campus Distinction"
          title="Why Choose All Saints Public School"
          subtitle="Everything carefully designed to nurture character, scholarship, and holistic student well-being."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card key={feature.id} className="p-6 relative group border border-slate-200 hover:border-[#0284C7] rounded-xl transition-all">
              <div className="w-11 h-11 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-slate-800 flex items-center justify-center text-xl mb-4 group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-base font-serif font-bold text-[#0F2744] mb-2 uppercase tracking-tight group-hover:text-[#0284C7] transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
