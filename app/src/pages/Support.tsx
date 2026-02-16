import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronDown,
  Send,
  Clock,
  CheckCircle
} from "lucide-react";

const faqs = [
  {
    question: "كيف يمكنني إلغاء حجزي؟",
    answer: "يمكنك إلغاء حجزك من خلال صفحة 'حجوزاتي' في حسابك الشخصي. يرجى مراعاة سياسة الإلغاء الخاصة بكل حجز والتي تختلف حسب نوع الخدمة والمدة المتبقية قبل موعد الرحلة أو الإقامة.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نوفر عدة طرق للدفع تشمل: Apple Pay، Samsung Pay، بطاقات الائتمان (Visa، Mastercard)، وبطاقة مدى. جميع المعاملات مؤمنة بأعلى معايير الأمان.",
  },
  {
    question: "هل يمكنني تعديل حجزي بعد التأكيد؟",
    answer: "نعم، يمكنك تعديل معظم الحجوزات قبل 48 ساعة من الموعد المحدد. قد تطبق رسوم تعديل إضافية حسب نوع الحجز وسياسة الشركة المقدمة للخدمة.",
  },
  {
    question: "كيف أحصل على فاتورة ضريبية؟",
    answer: "يتم إرسال الفاتورة الضريبية تلقائياً إلى بريدك الإلكتروني بعد إتمام عملية الدفع. يمكنك أيضاً تحميلها من صفحة تفاصيل الحجز في حسابك.",
  },
  {
    question: "ما هي سياسة الاسترداد؟",
    answer: "تختلف سياسة الاسترداد حسب نوع الحجز. بشكل عام، الحجوزات القابلة للاسترداد تسمح بإلغاء كامل قبل 24-72 ساعة من الموعد. يرجى مراجعة شروط الحجز المحددة.",
  },
  {
    question: "هل تقدمون خدمات للشركات؟",
    answer: "نعم، نوفر باقات خاصة للشركات تشمل إدارة سفر الموظفين، أسعار تفضيلية، وتقارير مفصلة. تواصل معنا عبر البريد الإلكتروني للشركات للمزيد.",
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            كيف يمكننا مساعدتك؟
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            فريق الدعم متاح على مدار الساعة لمساعدتك في أي استفسار
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card rounded-2xl p-8 shadow-card text-center hover:shadow-hover transition-all">
              <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">اتصل بنا</h3>
              <p className="text-muted-foreground mb-4">متاحون على مدار الساعة</p>
              <p className="text-xl font-bold text-primary">+966 54 245 4094</p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card text-center hover:shadow-hover transition-all">
              <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">راسلنا</h3>
              <p className="text-muted-foreground mb-4">نرد خلال 24 ساعة</p>
              <p className="text-xl font-bold text-primary">ibrahemest@outlook.sa</p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card text-center hover:shadow-hover transition-all">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">محادثة مباشرة</h3>
              <p className="text-muted-foreground mb-4">ردود فورية</p>
              <Button variant="hero">ابدأ المحادثة</Button>
              <a
                className="block text-sm text-primary mt-3"
                href="https://wa.me/966542454094"
                rel="noreferrer"
              >
                تحويل واتساب للدعم الفني
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl shadow-card overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-right hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-semibold">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-5 pb-5 text-muted-foreground animate-fade-up">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">أرسل استفسارك</h2>
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">الاسم</label>
                      <Input placeholder="اسمك الكامل" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">البريد الإلكتروني</label>
                      <Input type="email" placeholder="example@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">رقم الجوال</label>
                    <Input placeholder="+966 50 123 4567" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">نوع الاستفسار</label>
                    <select className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm">
                      <option>استفسار عام</option>
                      <option>مشكلة في الحجز</option>
                      <option>طلب استرداد</option>
                      <option>شكوى</option>
                      <option>اقتراح</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">الرسالة</label>
                    <Textarea placeholder="اكتب رسالتك هنا..." rows={5} />
                  </div>
                  <Button variant="hero" className="w-full gap-2">
                    <Send className="w-5 h-5" />
                    إرسال
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>متوسط وقت الرد: 2-4 ساعات</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>نسبة رضا العملاء: 98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
