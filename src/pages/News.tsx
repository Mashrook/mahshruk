import { useState } from "react";
import { Newspaper, Calendar, Clock, User, ChevronLeft, Search, Tag, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import riyadhImg from "@/assets/destinations/riyadh.jpg";
import jeddahImg from "@/assets/destinations/jeddah.jpg";
import alulaImg from "@/assets/destinations/alula.jpg";
import abhaImg from "@/assets/destinations/abha.jpg";
import medinaImg from "@/assets/destinations/medina.jpg";
import dubaiImg from "@/assets/destinations/dubai.jpg";
import redSeaImg from "@/assets/tours/red-sea.jpg";
import desertImg from "@/assets/tours/desert-safari.jpg";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: "1",
    title: "موسم الرياض 2026: أكبر موسم ترفيهي في تاريخ المملكة",
    excerpt: "يستعد موسم الرياض لتقديم تجربة ترفيهية غير مسبوقة مع أكثر من 100 فعالية متنوعة تشمل حفلات عالمية ومطاعم جديدة ومناطق ألعاب مبتكرة.",
    image: riyadhImg,
    category: "فعاليات",
    author: "فريق مشروك",
    date: "15 فبراير 2026",
    readTime: "5 دقائق",
    featured: true,
  },
  {
    id: "2",
    title: "مشروع البحر الأحمر: وجهة سياحية عالمية على أرض سعودية",
    excerpt: "يواصل مشروع البحر الأحمر تقدمه ليصبح أحد أفخم الوجهات السياحية في العالم مع فنادق فاخرة وشواطئ بكر وتجارب فريدة.",
    image: redSeaImg,
    category: "مشاريع",
    author: "فريق مشروك",
    date: "12 فبراير 2026",
    readTime: "7 دقائق",
    featured: true,
  },
  {
    id: "3",
    title: "العلا تستقبل مليون زائر في 2025",
    excerpt: "حققت العلا رقماً قياسياً في عدد الزوار خلال العام الماضي مع تنوع الفعاليات الثقافية والفنية التي أقيمت على مدار العام.",
    image: alulaImg,
    category: "أخبار",
    author: "فريق مشروك",
    date: "10 فبراير 2026",
    readTime: "4 دقائق",
  },
  {
    id: "4",
    title: "أفضل 10 وجهات سياحية في المملكة لعام 2026",
    excerpt: "دليل شامل لأفضل الوجهات السياحية في المملكة العربية السعودية لهذا العام، من الشواطئ إلى الجبال ومن المدن الحديثة إلى المواقع التاريخية.",
    image: jeddahImg,
    category: "أدلة سفر",
    author: "فريق مشروك",
    date: "8 فبراير 2026",
    readTime: "10 دقائق",
  },
  {
    id: "5",
    title: "نصائح السفر: كيف تخطط لرحلة عائلية مثالية في أبها",
    excerpt: "أبها والسودة من أجمل الوجهات الصيفية في المملكة. إليك دليلك الكامل للتخطيط لرحلة عائلية لا تُنسى في جنوب السعودية.",
    image: abhaImg,
    category: "نصائح سفر",
    author: "فريق مشروك",
    date: "5 فبراير 2026",
    readTime: "6 دقائق",
  },
  {
    id: "6",
    title: "المدينة المنورة: دليل الزائر الشامل 2026",
    excerpt: "كل ما تحتاج معرفته عن زيارة المدينة المنورة من أفضل الفنادق والمطاعم وأماكن الزيارة والنصائح المهمة للزوار.",
    image: medinaImg,
    category: "أدلة سفر",
    author: "فريق مشروك",
    date: "3 فبراير 2026",
    readTime: "8 دقائق",
  },
  {
    id: "7",
    title: "السفاري الصحراوي: تجربة لا مثيل لها في رمال المملكة",
    excerpt: "اكتشف سحر الصحراء السعودية مع أفضل رحلات السفاري التي تجمع بين المغامرة والتخييم الفاخر تحت النجوم.",
    image: desertImg,
    category: "مغامرات",
    author: "فريق مشروك",
    date: "1 فبراير 2026",
    readTime: "5 دقائق",
  },
  {
    id: "8",
    title: "خطوط الطيران السعودية تعلن عن وجهات جديدة لصيف 2026",
    excerpt: "أعلنت الخطوط السعودية عن إضافة 15 وجهة جديدة إلى شبكة رحلاتها لموسم الصيف مع أسعار تنافسية.",
    image: dubaiImg,
    category: "أخبار",
    author: "فريق مشروك",
    date: "28 يناير 2026",
    readTime: "3 دقائق",
  },
];

const articleCategories = ["الكل", "أخبار", "فعاليات", "أدلة سفر", "نصائح سفر", "مشاريع", "مغامرات"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = articles.filter((a) => {
    if (selectedCategory !== "الكل" && a.category !== selectedCategory) return false;
    if (searchQuery && !a.title.includes(searchQuery)) return false;
    return true;
  });

  const featuredArticles = articles.filter(a => a.featured);
  const latestArticles = filtered.filter(a => !a.featured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Newspaper className="w-6 h-6 text-primary-foreground" />
            <p className="text-primary-foreground/70 text-sm">الأخبار والمقالات</p>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
            آخر أخبار السياحة والسفر
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-2xl mx-auto">
            تابع أحدث الأخبار والمقالات عن السياحة في المملكة والعالم — أدلة سفر ونصائح وتغطيات حصرية
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <div className="container mx-auto px-4 lg:px-8 -mt-6">
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card">
          <div className="flex items-center gap-2 bg-muted/30 border border-input rounded-xl px-3 h-10 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المقالات..."
              className="bg-transparent border-0 p-0 h-auto shadow-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {articleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {selectedCategory === "الكل" && featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            مقالات مميزة
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredArticles.map((article) => (
              <div key={article.id} className="group rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all flex flex-col lg:flex-row">
                <div className="relative lg:w-2/5 h-56 lg:h-auto overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 text-xs">مميز</Badge>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <Badge variant="outline" className="mb-3 text-xs">{article.category}</Badge>
                    <h3 className="text-lg font-bold mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{article.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      اقرأ المزيد <ChevronLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="container mx-auto px-4 lg:px-8 pb-12">
        <h2 className="text-xl lg:text-2xl font-bold mb-8 flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          {selectedCategory === "الكل" ? "آخر المقالات" : selectedCategory}
          <span className="text-sm font-normal text-muted-foreground">({(selectedCategory === "الكل" ? latestArticles : filtered).length})</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedCategory === "الكل" ? latestArticles : filtered).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">لا توجد مقالات مطابقة للبحث</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-primary/20 border-t border-primary/10">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-1">تابع آخر الأخبار</h3>
              <p className="text-muted-foreground text-sm">اشترك في نشرتنا للحصول على أحدث أخبار السياحة</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
              <Button variant="gold">اشترك</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="group rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all">
      <div className="relative h-48 overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <Badge className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-foreground border-0 text-xs">
          {article.category}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-base mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary text-xs p-1 h-auto">
            اقرأ <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
