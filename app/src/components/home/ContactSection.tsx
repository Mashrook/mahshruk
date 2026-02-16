import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const whatsappNumber = "+966542454094";

export function ContactSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="bg-card rounded-3xl p-8 shadow-card">
            <h2 className="text-3xl font-bold mb-2">تواصل معنا</h2>
            <p className="text-muted-foreground mb-6">
              اترك رسالتك وسنعود إليك بأقرب وقت. فريق مشروك متاح لخدمتك على مدار الساعة.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="الاسم الكامل" />
              <Input type="email" placeholder="البريد الإلكتروني" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input placeholder="رقم الجوال" />
              <Input placeholder="الوجهة المهتم بها" />
            </div>
            <div className="mt-4">
              <Textarea rows={5} placeholder="اكتب رسالتك أو تفاصيل طلبك..." />
            </div>
            <Button variant="hero" className="mt-6 w-full">
              إرسال الطلب
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-muted rounded-3xl p-6 shadow-card">
              <h3 className="text-xl font-bold mb-4">قنوات التواصل</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center text-primary-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p>اتصال مباشر</p>
                    <p className="font-semibold text-foreground">+966 54 245 4094</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p>البريد الإلكتروني</p>
                    <p className="font-semibold text-foreground">ibrahemest@outlook.sa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-accent-foreground">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p>المكتب الرئيسي</p>
                    <p className="font-semibold text-foreground">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-gradient rounded-3xl p-6 text-primary-foreground shadow-hover">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6" />
                <h4 className="text-lg font-semibold">مساعد مشروك الذكي</h4>
              </div>
              <p className="text-primary-foreground/80 mb-5 text-sm">
                احصل على إجابات فورية حول العروض، التسجيل، واختيار الوجهة المناسبة حسب الموسم.
              </p>
              <a
                className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold"
                href={`https://wa.me/${whatsappNumber.replace("+", "")}`}
                rel="noreferrer"
              >
                تحويل للمساعدة على واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
