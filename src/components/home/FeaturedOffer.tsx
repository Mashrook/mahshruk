import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import featuredImg from "@/assets/featured-offer.jpg";

export default function FeaturedOffer() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-card">
          <div className="grid md:grid-cols-2 items-center">
            {/* Image */}
            <div className="h-64 md:h-80">
              <img src={featuredImg} alt="عرض الموسم المميز" className="w-full h-full object-cover" loading="lazy" />
            </div>
            {/* Content */}
            <div className="p-8 lg:p-12 text-right">
              <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-4">
                <Sparkles className="w-4 h-4" />
                العرض المميز
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">عرض الموسم المميز</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                اختر باقتك المفضلة واستمتع بتجربة سفر متكاملة بأسعار شفافة وخيارات مرنة.
              </p>
              <Link to="/offers">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-bold text-base">
                  استكشف العرض
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
