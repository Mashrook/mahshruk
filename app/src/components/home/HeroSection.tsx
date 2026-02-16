import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plane,
  Hotel,
  Calendar,
  Users,
  MapPin,
  PlayCircle,
} from "lucide-react";
import { stats } from "@/data/content";

export function HeroSection() {
  const [searchType, setSearchType] = useState<"flights" | "hotels">("flights");
  const promoVideoUrl = import.meta.env.VITE_PROMO_VIDEO_URL as string | undefined;
  const showVideo = Boolean(promoVideoUrl);

  const searchLabel = useMemo(
    () => (searchType === "flights" ? "رحلات الطيران" : "الفنادق"),
    [searchType]
  );

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      <div className="absolute inset-0 dot-pattern opacity-25" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-secondary/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-40 left-20 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          {/* Badge */}
          <div className="text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-primary-foreground text-sm font-medium">
                منصة شاملة للسفر والسياحة في السعودية والشرق الأوسط
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
              اكتشف العالم مع
              <span className="block mt-2 font-changa text-secondary">مشروك</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl lg:max-w-none animate-fade-up" style={{ animationDelay: "0.2s" }}>
              رحلات مدروسة، عروض موسمية، وحجوزات ذكية في مكان واحد. اختر وجهتك، ونحن نهتم بالتفاصيل.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              <Button variant="hero" size="lg" className="gap-2">
                ابدأ رحلتك الآن
              </Button>
              <Button variant="outline" size="lg" className="bg-primary-foreground/15 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/25">
                تعرف على العروض
              </Button>
            </div>

            {/* Search Box */}
            <div className="bg-card rounded-2xl p-6 shadow-hover animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex flex-wrap gap-3 mb-5">
                <button
                  onClick={() => setSearchType("flights")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all ${
                    searchType === "flights"
                      ? "hero-gradient text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Plane className="w-4 h-4" />
                  رحلات الطيران
                </button>
                <button
                  onClick={() => setSearchType("hotels")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all ${
                    searchType === "hotels"
                      ? "hero-gradient text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Hotel className="w-4 h-4" />
                  الفنادق
                </button>
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  نتائج {searchLabel} خلال ثوانٍ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={searchType === "flights" ? "من أين؟" : "الوجهة"}
                    className="pr-10 h-12 bg-muted border-0"
                  />
                </div>
                {searchType === "flights" && (
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="إلى أين؟"
                      className="pr-10 h-12 bg-muted border-0"
                    />
                  </div>
                )}
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="التاريخ"
                    className="pr-10 h-12 bg-muted border-0"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="عدد المسافرين"
                    className="pr-10 h-12 bg-muted border-0"
                  />
                </div>
              </div>

              <Button variant="hero" size="lg" className="w-full md:w-auto mt-6 gap-2">
                <Search className="w-5 h-5" />
                ابحث الآن
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/70 text-sm md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-3xl border border-primary-foreground/20 p-4 shadow-hover animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-foreground/70 text-sm">الفيديو التعريفي</p>
                <h3 className="text-xl font-semibold text-primary-foreground">مشروك في دقيقة</h3>
              </div>
              <span className="text-xs text-primary-foreground/70">يتم تحديثه من لوحة الإدارة</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-background/20 min-h-[260px] flex items-center justify-center">
              {showVideo ? (
                <video className="w-full h-full object-cover" controls preload="metadata" src={promoVideoUrl} />
              ) : (
                <div className="flex flex-col items-center gap-3 text-primary-foreground/70 py-12">
                  <PlayCircle className="w-16 h-16 text-secondary" />
                  <p className="font-semibold">لا يوجد فيديو مرفوع بعد</p>
                  <p className="text-sm">يمكنك رفعه من لوحة تحكم الإدارة.</p>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-primary-foreground/80">
              <div className="bg-primary-foreground/10 rounded-xl p-3">
                <p className="font-semibold">عروض الموسم</p>
                <p className="text-xs">باقات شاملة للطيران والفندق والأنشطة.</p>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-3">
                <p className="font-semibold">مساعد ذكي</p>
                <p className="text-xs">يرشدك لأفضل وجهة حسب الموسم.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
