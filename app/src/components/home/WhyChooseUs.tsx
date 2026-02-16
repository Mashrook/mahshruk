import { Shield, Headphones, CreditCard, Award, Clock, Heart, Bot } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "حجز آمن 100%",
    description: "حماية بياناتك والتزام بسياسات الخصوصية والأمان",
  },
  {
    icon: Headphones,
    title: "دعم على مدار الساعة",
    description: "فريق دعم متخصص متاح 24/7 لمساعدتك",
  },
  {
    icon: CreditCard,
    title: "مدفوعات مرنة",
    description: "Samsung Pay وApple Pay وبطاقات مدى وفيزا وماستركارد",
  },
  {
    icon: Award,
    title: "عروض شاملة",
    description: "باقات تتضمن الطيران والفنادق والأنشطة والمواصلات",
  },
  {
    icon: Clock,
    title: "حجز سريع",
    description: "واجهات حجز سهلة تحاكي منصات شركات الطيران العالمية",
  },
  {
    icon: Bot,
    title: "مساعد ذكي",
    description: "اقتراح الوجهة المثالية حسب الموسم ومساعدتك في التسجيل",
  },
  {
    icon: Heart,
    title: "تجربة مميزة",
    description: "رحلات مصممة لتناسب العائلة، العرسان، والطلاب",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      {/* Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20v20H0V20h20zm0-20v20H0V0h20z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            لماذا تختار <span className="text-secondary">مشروك</span>؟
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl mx-auto">
            نقدم لك تجربة سفر استثنائية مع خدمات متميزة تجعل رحلتك لا تُنسى
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-primary-foreground/20 transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-primary-foreground/70">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
