import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { studyOffers } from "@/data/content";

export function WeeklyOffers() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span className="text-secondary font-semibold">الدراسة بالخارج</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            أفضل أربعة عروض <span className="text-gold">لدراسة اللغة الإنجليزية</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            برامج مرنة مع خيارات سكن وأنشطة طلابية ومرافقة منذ القبول وحتى العودة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyOffers.map((offer, index) => (
            <div
              key={offer.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-primary">
                  {offer.duration}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
                <p className="text-sm text-muted-foreground">{offer.location}</p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                  {offer.includes.map((item) => (
                    <span key={item} className="bg-muted px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">ابتداءً من</p>
                    <p className="text-xl font-bold text-primary">
                      {offer.price} <span className="text-sm">ر.س</span>
                    </p>
                  </div>
                  <Button variant="hero" size="sm">احجز</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/study">
            <Button variant="outline" size="lg" className="gap-2">
              عرض برامج الدراسة
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
