import { SPECIALITIES } from "@/constants";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";

export default function SpecialitiesSection() {
  return (
    <section className="section-pad bg-[#F4FAFF] border-b border-slate-200">
      <div className="container-custom">
        <SectionTitle
          tag="Holistic Pedagogy"
          title="Our Specialities"
          subtitle="Nurturing young minds through holistic development paths engineered to transform consumers into future creators."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECIALITIES.map((item) => (
            <Card
              key={item.id}
              className="p-6 bg-white border border-[#D8EAF8] shadow-xs hover:border-[#0875C9] hover:shadow-md transition-all rounded-2xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] group-hover:bg-[#0875C9] group-hover:text-white transition-colors flex items-center justify-center font-bold text-sm mb-3.5 border border-[#D8EAF8]">
                0{item.id}
              </div>
              <h3 className="font-serif font-bold text-[#092F78] text-base mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
