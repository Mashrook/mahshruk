export default function Privacy() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8">سياسة <span className="text-gradient-gold">الخصوصية</span></h1>
          <div className="prose prose-invert max-w-none space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-card border border-border/50 space-y-4">
              <h2 className="text-xl font-bold">جمع المعلومات</h2>
              <p className="text-muted-foreground leading-relaxed">نقوم بجمع المعلومات الضرورية فقط لتقديم خدماتنا بأفضل شكل ممكن. تشمل هذه المعلومات البيانات الشخصية مثل الاسم والبريد الإلكتروني ورقم الهاتف.</p>
              <h2 className="text-xl font-bold mt-6">استخدام المعلومات</h2>
              <p className="text-muted-foreground leading-relaxed">نستخدم معلوماتك لإتمام عمليات الحجز وتحسين خدماتنا. لا نشارك بياناتك مع أطراف ثالثة إلا بموافقتك.</p>
              <h2 className="text-xl font-bold mt-6">حماية البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">نستخدم أحدث تقنيات التشفير والأمان لحماية بياناتك الشخصية ومعلومات الدفع.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
