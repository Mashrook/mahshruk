import { Layout } from "@/components/layout/Layout";
import { Shield, Sparkles, Users, Globe, Bot, CreditCard } from "lucide-react";

const highlights = [
  {
    icon: Globe,
    title: "منصة شاملة",
    description: "نغطي الطيران، الفنادق، العروض، النشاطات، والمواصلات ضمن تجربة واحدة.",
  },
  {
    icon: Bot,
    title: "مساعد ذكي",
    description: "اقتراح الوجهة الأنسب حسب الموسم واحتياجات الرحلة.",
  },
  {
    icon: CreditCard,
    title: "مدفوعات مرنة",
    description: "Samsung Pay وApple Pay وبطاقات مدى وفيزا وماستركارد عبر ميسر.",
  },
  {
    icon: Users,
    title: "لوحة إدارة متقدمة",
    description: "إدارة الأقسام والأسعار والعروض والمشتركين وصلاحيات الفريق.",
  },
  {
    icon: Shield,
    title: "ثقة وأمان",
    description: "حماية بيانات المستخدمين والامتثال لسياسات الخصوصية.",
  },
  {
    icon: Sparkles,
    title: "عروض موسمية",
    description: "باقات مصممة لشهر العسل والعائلة والطلاب طوال العام.",
  },
];

export default function About() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">عن المنصة</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            مشروك للسفر والسياحة
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            منصة عربية متخصصة في صناعة تجربة السفر من الألف إلى الياء، موجهة للسعودية والشرق الأوسط.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h2 className="text-2xl font-bold mb-3">رؤيتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نؤمن بأن السفر رحلة معرفة ومتعة، لذلك نبني تجربة رقمية متكاملة تجمع بين
                  التخطيط الذكي والحجز السلس والدعم المستمر.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h2 className="text-2xl font-bold mb-3">ما الذي يميزنا؟</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• باقات شاملة للطيران والفنادق والأنشطة والمواصلات.</li>
                  <li>• محتوى عربي أصيل يساعدك على اتخاذ قرار السفر بثقة.</li>
                  <li>• تكاملات API مرنة مع منصات السفر العالمية والخرائط والطقس.</li>
                  <li>• مساعد ذكي يقدم نصائح موسمية ويحول للدعم عند الحاجة.</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted rounded-3xl p-8 shadow-card">
              <h3 className="text-xl font-bold mb-4">لماذا تثق بنا؟</h3>
              <p className="text-muted-foreground mb-6">
                نعمل بمعايير احترافية، ونوفر تقارير واضحة وخيارات دفع آمنة وخدمة عملاء سريعة.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {highlights.slice(0, 3).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center text-primary-foreground">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">قيمنا وخدماتنا</h2>
            <p className="text-muted-foreground mt-3">
              نطور خدماتنا باستمرار لتناسب احتياجات المسافر العصري.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-accent-foreground mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
