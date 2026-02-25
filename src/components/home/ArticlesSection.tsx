import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import riyadhImg from "@/assets/riyadh-hero.jpg";
import hotelOffer1 from "@/assets/offers/hotel-offer-1.jpg";
import hotelOffer2 from "@/assets/offers/hotel-offer-2.jpg";
import tourOffer1 from "@/assets/offers/tour-offer-1.jpg";
import destOffer1 from "@/assets/offers/destination-offer-1.jpg";
import featuredImg from "@/assets/featured-offer.jpg";

const articles = [
  { title: "دليل السفر إلى العلا", date: "2026-02-01", category: "وجهات", image: destOffer1 },
  { title: "أفضل الأنشطة في جدة البحرية", date: "2026-01-20", category: "نشاطات", image: hotelOffer1 },
  { title: "الرياض الحديثة: ماذا تزور؟", date: "2026-01-10", category: "مدن", image: riyadhImg },
  { title: "شتاء أبها وكيف تستمتع به", date: "2025-12-22", category: "مواسم", image: tourOffer1 },
  { title: "دليل زيارة المدينة المنورة", date: "2025-12-05", category: "روحانيات", image: hotelOffer2 },
  { title: "أفضل وجهات الربيع في السعودية", date: "2025-11-18", category: "مواسم", image: featuredImg },
];

export default function ArticlesSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/articles">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-xl">
              جميع المقالات
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div className="text-right">
            <span className="text-sm text-primary font-medium">الأخبار والمقالات</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-1">دليلك للسفر الذكي</h2>
            <p className="text-muted-foreground mt-1">مقالات متخصصة في السفر والسياحة مع نصائح عملية لاختيار الوجهة والموسم المناسب.</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.title} to="/articles" className="group">
              <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">{article.category}</span>
                  </div>
                </div>
                <div className="p-4 text-right">
                  <h3 className="font-bold text-foreground mb-2">{article.title}</h3>
                  <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                    <span>{article.date}</span>
                    <Calendar className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
