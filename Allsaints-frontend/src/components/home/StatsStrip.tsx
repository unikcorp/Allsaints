import { STATS } from "@/constants";

export default function StatsStrip() {
  return (
    <section className="bg-[#FAF2F5]/50 border-b border-[#EED3DC]/60 py-10 font-sans">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#EED3DC]/70">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center pt-4 md:pt-0 px-2">
              <div className="text-3xl sm:text-4xl font-serif font-black text-[#4A051E] mb-1">
                {stat.value}
              </div>
              <div className="w-10 h-1 bg-gradient-to-r from-[#6B0B2E] to-[#D97706] mx-auto my-2 rounded-full" />
              <div className="text-xs sm:text-sm font-serif font-bold text-slate-700 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
