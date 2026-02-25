import { useState } from "react";
import { GraduationCap, MapPin, Calendar, Clock, Users, BookOpen, Globe, ChevronLeft, Search, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import londonImg from "@/assets/study/london.jpg";
import sydneyImg from "@/assets/study/sydney.jpg";
import veniceImg from "@/assets/study/venice.jpg";
import singaporeImg from "@/assets/study/singapore.jpg";
import brusselsImg from "@/assets/study/brussels.jpg";
import kualalumpurImg from "@/assets/study/kualalumpur.jpg";

/* ── Language Programs ── */
interface LanguageProgram {
  id: string;
  city: string;
  country: string;
  title: string;
  image: string;
  price: number;
  duration: string;
  tag?: string;
}

const languagePrograms: LanguageProgram[] = [
  { id: "1", city: "لندن", country: "بريطانيا", title: "تعليم مكثّف بمنهجية بريطانية", image: londonImg, price: 7600, duration: "4 أسابيع", tag: "الأكثر طلباً" },
  { id: "2", city: "سيدني", country: "أستراليا", title: "تعليم عملي بتجربة دولية", image: sydneyImg, price: 10000, duration: "6 أسابيع" },
  { id: "3", city: "فلورنسا", country: "إيطاليا", title: "بيئة لغة إنجليزية ثالثة", image: veniceImg, price: 9200, duration: "4 أسابيع" },
  { id: "4", city: "سنغافورة", country: "سنغافورة", title: "تعليم حديث بتكلفة معتدلة", image: singaporeImg, price: 8500, duration: "4 أسابيع" },
  { id: "5", city: "بروكسل", country: "بلجيكا", title: "تجربة أكاديمية متنوعة", image: brusselsImg, price: 11300, duration: "6 أسابيع", tag: "جديد" },
  { id: "6", city: "كوالالمبور", country: "ماليزيا", title: "بيئة متعددة الثقافات مناسبة", image: kualalumpurImg, price: 7200, duration: "4 أسابيع" },
];

/* ── Study Countries ── */
interface StudyCountry {
  name: string;
  flag: string;
  description: string;
}

const studyCountries: StudyCountry[] = [
  { name: "المملكة المتحدة", flag: "🇬🇧", description: "جامعات عريقة مثل أكسفورد وكامبريدج، ثقافة أكاديمية رائدة ومعترف بها عالمياً." },
  { name: "الولايات المتحدة", flag: "🇺🇸", description: "أكبر نظام تعليمي في العالم مع جامعات بحثية متميزة وتنوع ثقافي واسع." },
  { name: "كندا", flag: "🇨🇦", description: "بيئة آمنة ومتعددة الثقافات مع جودة تعليم عالية ورسوم معقولة." },
  { name: "أستراليا", flag: "🇦🇺", description: "جامعات مصنّفة عالمياً، طبيعة خلابة وفرص عمل بعد التخرج." },
  { name: "ألمانيا", flag: "🇩🇪", description: "تعليم شبه مجاني في جامعات حكومية مع برامج باللغة الإنجليزية." },
];

/* ── Universities ── */
const topUniversities = [
  "Imperial College London",
  "Stanford University",
  "Harvard University",
  "University of Oxford",
  "University of Cambridge",
  "National University of Singapore",
  "University of Melbourne",
  "California Institute of Technology",
];

/* ── Program Card ── */
function ProgramCard({ program }: { program: LanguageProgram }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="relative h-44 overflow-hidden">
        <img src={program.image} alt={program.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 right-4">
          <h3 className="text-lg font-bold text-white">{program.city}</h3>
          <p className="text-xs text-white/80">{program.title}</p>
        </div>
        {program.tag && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">{program.tag}</Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{program.country}</span>
          <span className="mx-1">•</span>
          <Clock className="w-3.5 h-3.5" />
          <span>{program.duration}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div>
            <span className="text-xs text-muted-foreground">يبدأ من</span>
            <p className="text-lg font-bold text-primary">{program.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">ر.س</span></p>
          </div>
          <Button variant="gold" size="sm">استكشف</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function StudyAbroad() {
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary-foreground/70 text-sm mb-2">الدراسة بالخارج مع مشروك</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-3">استثمر في مستقبل أبنائك بثقة</h1>
          <p className="text-primary-foreground/80 text-sm max-w-2xl mx-auto">وفّر لهم فرصة دراسية في أفضل المعاهد العالمية — مع السكن والدعم والمتابعة المتكاملة أونلاين وأوفلاين.</p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto p-6 lg:p-8 rounded-2xl bg-card/95 border border-border/30 shadow-card">
            <h2 className="text-xl font-bold text-center mb-6">احجز برنامجك الدراسي</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">الدولة</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-muted/20"><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">المملكة المتحدة</SelectItem>
                    <SelectItem value="us">الولايات المتحدة</SelectItem>
                    <SelectItem value="ca">كندا</SelectItem>
                    <SelectItem value="au">أستراليا</SelectItem>
                    <SelectItem value="de">ألمانيا</SelectItem>
                    <SelectItem value="my">ماليزيا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">التخصص أو البرنامج</label>
                <Input placeholder="مثلاً: لغة إنجليزية" className="bg-muted/20" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">المدينة أو الجامعة</label>
                <Input placeholder="مثلاً: لندن" className="bg-muted/20" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">مدة الدراسة</label>
                <Select>
                  <SelectTrigger className="bg-muted/20"><SelectValue placeholder="اختر المدة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4w">4 أسابيع</SelectItem>
                    <SelectItem value="8w">8 أسابيع</SelectItem>
                    <SelectItem value="3m">3 أشهر</SelectItem>
                    <SelectItem value="6m">6 أشهر</SelectItem>
                    <SelectItem value="1y">سنة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">المستوى الدراسي</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="bg-muted/20"><SelectValue placeholder="اختر المستوى" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lang">لغة إنجليزية</SelectItem>
                    <SelectItem value="bachelor">بكالوريوس</SelectItem>
                    <SelectItem value="master">ماجستير</SelectItem>
                    <SelectItem value="phd">دكتوراه</SelectItem>
                    <SelectItem value="diploma">دبلوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">نوع السكن</label>
                <Select>
                  <SelectTrigger className="bg-muted/20"><SelectValue placeholder="اختر السكن" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homestay">عائلة مضيفة</SelectItem>
                    <SelectItem value="dorm">سكن جامعي</SelectItem>
                    <SelectItem value="apartment">شقة خاصة</SelectItem>
                    <SelectItem value="hotel">فندق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="gold" size="lg" className="w-full">
              <Search className="w-5 h-5 ml-2" />
              عرض الخيارات
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">سيتم عرض البرامج والأسعار المتوفرة حسب اختياراتك — الحجز فوري ومؤكد.</p>
          </div>
        </div>
      </section>

      {/* Language Programs */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">برامج لغة إنجليزية معتمدة</h2>
            <p className="text-muted-foreground text-sm">دورات مكثفة في أفضل المعاهد العالمية مع سكن ومتابعة شاملة</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {languagePrograms.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Countries */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Countries list */}
            <div>
              <h2 className="text-2xl font-bold mb-6">أفضل الدول للدراسة والتطوير</h2>
              <div className="space-y-3">
                {studyCountries.map((c) => (
                  <div key={c.name} className="p-4 rounded-xl bg-card border border-border/30 hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-2xl">{c.flag}</span>
                      <h3 className="font-bold">{c.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground pr-10 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Universities */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">جامعات عالمية بارزة</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                نساعدك بالتقديم والحصول على قبولات جامعية مشروطة وغير مشروطة من أفضل جامعات العالم. نوفّر متابعة من التقديم حتى الوصول.
              </p>
              <div className="space-y-2.5 mb-6">
                {topUniversities.map((uni, i) => (
                  <div key={uni} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
                    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</span>
                    <span className="text-sm font-medium" dir="ltr">{uni}</span>
                  </div>
                ))}
              </div>
              <Button variant="gold" className="w-full">
                <GraduationCap className="w-5 h-5 ml-2" />
                طلب استشارة دراسية
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
