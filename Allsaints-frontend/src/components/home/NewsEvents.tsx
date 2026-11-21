import { NEWS_ITEMS } from "@/constants";
import { formatDate } from "@/lib/utils";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function NewsEvents() {
  return (
    <section className="section-pad bg-white border-b border-slate-200">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionTitle
            tag="Latest Circulars"
            title="News, Results &amp; Announcements"
            align="left"
            className="mb-0"
          />
          <Button href="/news" variant="outline" size="sm">
            All School Notices &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ITEMS.map((item) => (
            <Card key={item.id} className="p-6 flex flex-col justify-between border border-slate-200 hover:border-[#0284C7] rounded-xl transition-all shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge label={item.category} variant="blue" />
                  <span className="text-[11px] text-slate-400 font-sans">
                    {formatDate(item.date)}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-[#0F2744] text-base mb-2 leading-snug uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                  {item.excerpt}
                </p>
              </div>

              <Link
                href={`/news/${item.slug}`}
                className="text-[#0284C7] font-bold text-xs uppercase tracking-wider hover:text-[#0369A1] transition-colors flex items-center gap-1"
              >
                Read Official Notice &rarr;
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
