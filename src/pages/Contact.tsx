import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">اتصل <span className="text-gradient-gold">بنا</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto">نحن هنا لمساعدتك. تواصل معنا في أي وقت</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "البريد الإلكتروني", value: "info@mashroky.com" },
              { icon: Phone, title: "الهاتف", value: "+966 50 000 0000" },
              { icon: MapPin, title: "العنوان", value: "المملكة العربية السعودية" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
            <h3 className="font-bold text-lg mb-6">أرسل لنا رسالة</h3>
            <div className="space-y-4">
              <Input placeholder="الاسم الكامل" className="bg-muted/30" />
              <Input type="email" placeholder="البريد الإلكتروني" className="bg-muted/30" />
              <Input placeholder="الموضوع" className="bg-muted/30" />
              <textarea
                placeholder="رسالتك..."
                rows={4}
                className="w-full rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <Button variant="gold" className="w-full">
                إرسال الرسالة
                <Send className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
