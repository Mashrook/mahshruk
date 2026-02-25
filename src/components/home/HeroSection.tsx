import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Calendar, MapPin, Users, Search, Headphones, Package, Play } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/riyadh-hero.jpg";
import { supabase } from "@/integrations/supabase/client";

export default function HeroSection() {
  const [promoUrl, setPromoUrl] = useState("");
  const [promoType, setPromoType] = useState<"video" | "image">("video");
  const [searchTab, setSearchTab] = useState<"flights" | "hotels">("flights");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");

  useEffect(() => {
    const loadPromo = async () => {
      const [urlRes, typeRes] = await Promise.all([
        supabase.from("site_settings").select("setting_value").eq("setting_key", "promo_media_url").maybeSingle(),
        supabase.from("site_settings").select("setting_value").eq("setting_key", "promo_media_type").maybeSingle(),
      ]);
      if (urlRes.data?.setting_value) setPromoUrl(urlRes.data.setting_value);
      if (typeRes.data?.setting_value) setPromoType(typeRes.data.setting_value as "video" | "image");
    };
    loadPromo();
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
      </div>
      {/* Top Banner */}
      <div className="bg-primary/20 backdrop-blur-sm border-b border-primary/30 py-2 text-center">
        <p className="text-sm text-foreground/80 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          رفيقك الموثوق لكل رحلة من الخليج إلى العالم
        </p>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Right Side - Hero Text + Search */}
          <div className="text-right order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-foreground">سافر بثقة مع</span>
              <br />
              <span className="text-gradient-primary text-5xl md:text-6xl lg:text-7xl">مشروك</span>
            </h1>
            <p className="text-foreground/80 text-base lg:text-lg leading-relaxed mb-8 max-w-xl mr-0">
              باقات سفر متكاملة بأسعار شفافة، مصممة خصيصاً للعائلات والعرسان والمسافرين
              من الخليج. اختر وجهتك ونحن نُتقن التفاصيل.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/flights">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-bold rounded-xl">
                  ابدأ التخطيط الآن
                </Button>
              </Link>
              <Link to="/offers">
                <Button variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10 px-8 py-3 text-base rounded-xl">
                  استكشف باقات الموسم
                </Button>
              </Link>
            </div>

            {/* Search Widget */}
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-card">
              {/* Search Tabs */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted-foreground">نتائج رحلات الطيران خلال ثوان</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSearchTab("hotels")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      searchTab === "hotels" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Hotel className="w-4 h-4" />
                    الفنادق
                  </button>
                  <button
                    onClick={() => setSearchTab("flights")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      searchTab === "flights" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                    رحلات الطيران
                  </button>
                </div>
              </div>

              {/* Trip Type */}
              <div className="flex gap-2 justify-end mb-4">
                <button
                  onClick={() => setTripType("oneway")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    tripType === "oneway" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  ذهاب فقط
                </button>
                <button
                  onClick={() => setTripType("roundtrip")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    tripType === "roundtrip" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  ذهاب وعودة
                </button>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-center gap-2 border border-border/50">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="text" placeholder="من أين؟" className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none text-right" />
                </div>
                <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-center gap-2 border border-border/50">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="text" placeholder="إلى أين؟" className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none text-right" />
                </div>
                <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-center gap-2 border border-border/50">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="text" placeholder="يوم/شهر/سنة" className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none text-right" />
                </div>
                <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-center gap-2 border border-border/50">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input type="text" placeholder="يوم/شهر/سنة" className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none text-right" />
                </div>
              </div>

              {/* Passengers */}
              <div className="flex items-center justify-between">
                <Link to={searchTab === "flights" ? "/flights" : "/hotels"}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-bold">
                    <Search className="w-4 h-4 ml-2" />
                    ابحث الآن
                  </Button>
                </Link>
                <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-center gap-2 border border-border/50">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side - Promo + Info Cards */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Info Label */}
            <div className="text-right">
              <span className="text-sm text-primary font-medium">تعرّف علينا</span>
              <h3 className="text-xl font-bold text-foreground mt-1">مشروك – رحلتك تبدأ من هنا</h3>
            </div>

            {/* Promo Media */}
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur aspect-video">
              {promoUrl ? (
                promoType === "video" ? (
                  <video src={promoUrl} controls autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={promoUrl} alt="عرض دعائي" className="w-full h-full object-cover" loading="lazy" />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center">
                    <Play className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">لا يوجد فيديو مرفوع بعد</p>
                </div>
              )}
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <h4 className="font-bold text-sm text-foreground">باقات متكاملة</h4>
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">طيران + فندق + أنشطة + تنقلات بسعر واحد.</p>
              </div>
              <div className="bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <h4 className="font-bold text-sm text-foreground">دعم على مدار الساعة</h4>
                  <Headphones className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">فريق يتحدث العربية متاح لمساعدتك دائماً.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
