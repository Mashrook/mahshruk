import { Newspaper } from "lucide-react";

export default function Articles() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">المقالات</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">نصائح ومقالات سفر مفيدة</p>
        </div>
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-card border border-border/50 text-center">
          <p className="text-muted-foreground">المقالات - قريباً</p>
        </div>
      </div>
    </div>
  );
}
