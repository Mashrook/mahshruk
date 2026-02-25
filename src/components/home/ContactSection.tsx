import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Contact Form */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="text-right">
              <h2 className="text-3xl font-bold text-foreground mb-2">تواصل معنا</h2>
              <p className="text-muted-foreground mb-6 text-sm">اترك رسالتك وسنعود إليك بأقرب وقت. فريق مشروك متاح لمساعدتك على مدار الساعة بالعربية.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="الاسم الكامل" className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-right" />
                  <input type="email" placeholder="البريد الإلكتروني" className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-right" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="الوجهة المهتم بها" className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-right" />
                  <input type="tel" placeholder="رقم الجوال" className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-right" />
                </div>
                <textarea placeholder="اكتب رسالتك أو تفاصيل طلبك..." rows={4} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-right resize-none" />
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3 font-bold">
                  إرسال الطلب
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 text-right">
                <h3 className="font-bold text-foreground mb-4">قنوات التواصل</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <p className="text-xs text-muted-foreground">اتصال مباشر</p>
                      <p className="text-sm text-foreground font-medium" dir="ltr">+966 54 245 4094</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                      <p className="text-sm text-foreground font-medium">info@mashrok.shop</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <p className="text-xs text-muted-foreground">المكتب الرئيسي</p>
                      <p className="text-sm text-foreground font-medium">الرياض، المملكة العربية السعودية</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-l from-background to-muted rounded-2xl p-6 text-right border border-border">
                <div className="flex items-center gap-3 justify-end mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">مساعد مشروك الذكي</h3>
                    <p className="text-xs text-muted-foreground">إجابات فورية حول العروض، الحجوزات، واختيار الوجهة المثالية لعائلتك.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full font-bold">
                  تحويل للمساعدة على واتساب
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-l from-background via-muted/50 to-background py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-64 text-right"
              />
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6">
                اشترك الآن
              </Button>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-foreground">اشترك في نشرتنا البريدية</h3>
              <p className="text-xs text-muted-foreground">احصل على أفضل العروض والخصومات الحصرية</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
