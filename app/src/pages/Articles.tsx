import { Layout } from "@/components/layout/Layout";
import { latestArticles } from "@/data/content";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Articles() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">الأخبار والمقالات</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            مقالات ونصائح السفر
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            أحدث الأخبار السياحية، إرشادات للمسافرين، ونصائح لاختيار الوجهة حسب الموسم.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <div key={article.id} className="bg-card rounded-2xl overflow-hidden shadow-card">
                <div className="h-52 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-xs text-secondary font-semibold">{article.category}</span>
                  <h3 className="text-lg font-bold mt-2 mb-4">{article.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <Button variant="outline" className="mt-4 gap-2">
                    اقرأ المقال
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
