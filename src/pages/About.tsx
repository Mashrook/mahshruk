import { Users, Globe, Shield, Star } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">من <span className="text-gradient-gold">نحن</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">مشروكي هي منصة حجز سفر شاملة تهدف لتوفير أفضل تجربة سفر للعملاء</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Globe, title: "تغطية عالمية", desc: "أكثر من 200 وجهة حول العالم" },
            { icon: Shield, title: "حجز آمن", desc: "جميع المعاملات مشفرة ومحمية" },
            { icon: Star, title: "جودة عالية", desc: "شركاء موثوقون ومعتمدون" },
            { icon: Users, title: "دعم متواصل", desc: "فريق دعم على مدار الساعة" },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 rounded-2xl bg-gradient-card border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
