import Button from "@/components/ui/Button";

export default function AboutSnapshot() {
  return (
    <section className="section-pad bg-[#f8fafc] border-b border-slate-200">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E89D26] block mb-2 font-sans">
              Welcome to All Saints
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#002855] leading-tight mb-3">
              An Institution Dedicated to Character, Culture &amp; Excellence
            </h2>
            <div className="w-14 h-1 bg-[#E89D26] rounded-full mb-6" />

            <p className="text-slate-600 text-sm leading-relaxed mb-4 font-sans">
              Founded with the vision to deliver quality education, All Saints Public School in Adoor, Kerala is affiliated with the Central Board of Secondary Education (CBSE), New Delhi. We combine rigorous academic programs with high moral grounding.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
              Under the guidance of passionate educators, our students grow up in a supportive, disciplined environment where they explore sciences, arts, sports, and leadership.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button href="/about" variant="primary" size="md">
                Read School History
              </Button>
              <Button href="/about/principal" variant="outline" size="md">
                Principal&apos;s Message
              </Button>
            </div>
          </div>

          {/* Right Feature Card */}
          <div className="bg-white border-2 border-slate-200 rounded-lg p-8 shadow-sm relative">
            <div className="w-2 h-full bg-[#E89D26] absolute left-0 top-0 rounded-l" />
            <h3 className="text-xl font-serif font-bold text-[#002855] mb-4">
              Our Educational Mission
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-sans">
              <div className="flex gap-3 items-start">
                <span className="text-[#E89D26] font-bold text-base mt-[-2px]">✓</span>
                <div>
                  <strong className="text-[#002855]">Intellectual Growth:</strong> Fostering deep conceptual clarity and problem-solving through activity-based learning.
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#E89D26] font-bold text-base mt-[-2px]">✓</span>
                <div>
                  <strong className="text-[#002855]">Modern Infrastructure:</strong> Interactive smart digiboards, computer centers, and specialized science labs.
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#E89D26] font-bold text-base mt-[-2px]">✓</span>
                <div>
                  <strong className="text-[#002855]">Value-Centered Community:</strong> Imparting empathy, integrity, and social responsibility in every student.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-xl font-serif font-bold text-[#002855]">25+ Years</span>
                <span className="text-xs text-slate-500 font-sans">Educational Service</span>
              </div>
              <div className="text-right">
                <span className="block text-xl font-serif font-bold text-[#E89D26]">100%</span>
                <span className="text-xs text-slate-500 font-sans">CBSE Board Success</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
