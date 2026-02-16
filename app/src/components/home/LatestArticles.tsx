import { CalendarDays, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { latestArticles } from "@/data/content";

export function LatestArticles() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              الأخبار والمقالات
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              أحدث المقالات <span className="text-gradient">والنصائح</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              مقالات متخصصة في السفر والسياحة والترفيه، مع نصائح لاختيار الوجهة حسب الموسم.
            </p>
          </div>
          <Link to="/articles">
            <Button variant="outline" className="hidden md:flex gap-2">
              جميع المقالات
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article, index) => (
            <div
              key={article.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-primary">
                  {article.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-3">{article.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/articles">
            <Button variant="outline" className="gap-2">
              جميع المقالات
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
