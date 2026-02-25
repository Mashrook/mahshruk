import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import travelMapImg from "@/assets/travel-map.jpg";

export default function AppDownloadCTA() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-background rounded-3xl overflow-hidden border-4 border-primary/30">
          <div className="grid md:grid-cols-2 items-center">
            {/* Image */}
            <div className="h-56 md:h-72 overflow-hidden rounded-2xl m-2">
              <img src={travelMapImg} alt="تطبيق مشروك" className="w-full h-full object-cover" loading="lazy" />
            </div>
            {/* Content */}
            <div className="p-8 lg:p-12 text-right">
              <span className="text-sm font-medium bg-secondary-foreground/20 text-secondary-foreground px-3 py-1 rounded-full inline-flex items-center gap-1 mb-4">
                <Smartphone className="w-4 h-4" />
                تحميل التطبيق
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-secondary-foreground mb-4">
                عروض حصرية في جيبك مع تطبيق مشروك
              </h2>
              <p className="text-secondary-foreground/80 mb-6 text-sm leading-relaxed">
                حمّل التطبيق لتتابع حجوزاتك، تحصل على عروض التطبيق الحصرية وتستلم تنبيهات فورية لكل جديد.
              </p>
              <Button className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 rounded-xl px-8 py-3 font-bold">
                حمّل التطبيق الآن
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
