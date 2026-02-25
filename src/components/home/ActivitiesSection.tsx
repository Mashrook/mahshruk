import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import tourOffer1 from "@/assets/offers/tour-offer-1.jpg";
import destOffer1 from "@/assets/offers/destination-offer-1.jpg";
import riyadhImg from "@/assets/riyadh-hero.jpg";
import hotelOffer1 from "@/assets/offers/hotel-offer-1.jpg";

const activities = [
  {
    title: "جولة بحرية في جدة",
    location: "جدة",
    category: "بحرية",
    tags: ["بحرية", "جدة"],
    price: "180",
    image: hotelOffer1,
    href: "/tours",
  },
  {
    title: "زيارة الدرعية التاريخية",
    location: "الرياض",
    category: "ثقافية",
    tags: ["ثقافية", "الرياض"],
    price: "120",
    image: riyadhImg,
    href: "/tours",
  },
  {
    title: "رحلة هضاب العلا",
    location: "العلا",
    category: "طبيعة",
    tags: ["طبيعة", "العلا"],
    price: "260",
    image: destOffer1,
    href: "/tours",
  },
  {
    title: "أسواق الطائف التقليدية",
    location: "الطائف",
    category: "سوق",
    tags: ["سوق", "الطائف"],
    price: "90",
    image: tourOffer1,
    href: "/tours",
  },
];

export default function ActivitiesSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">تجارب وأنشطة لا تُفوَّت</h2>
          <p className="text-muted-foreground">اختر تجربة تجمع بين المتعة والمغامرة والثقافة حسب وجهتك واهتماماتك.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {activities.map((activity) => (
            <div key={activity.title} className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 group">
              <div className="relative h-44 overflow-hidden">
                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-3 right-3">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">{activity.category}</span>
                </div>
              </div>
              <div className="p-4 text-right">
                <h3 className="font-bold text-foreground mb-1 text-sm">{activity.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{activity.location}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Link to={activity.href}>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs">احجز</Button>
                  </Link>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">يبدأ من</p>
                    <p className="font-bold text-primary">{activity.price} <span className="text-xs">ر.س</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/tours">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-xl px-8">
              عرض المزيد من الأنشطة
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
