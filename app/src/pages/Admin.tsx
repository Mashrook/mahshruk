import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Plane, 
  Hotel, 
  Tag,
  Users,
  Settings,
  Link2,
  Key,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  LogOut,
  Bell,
  Menu
} from "lucide-react";

const sidebarItems = [
  { name: "لوحة التحكم", icon: LayoutDashboard, id: "dashboard" },
  { name: "الرحلات", icon: Plane, id: "trips" },
  { name: "الفنادق", icon: Hotel, id: "hotels" },
  { name: "العروض", icon: Tag, id: "offers" },
  { name: "المشتركين", icon: Users, id: "users" },
  { name: "المدفوعات", icon: CreditCard, id: "payments" },
  { name: "الإحصائيات", icon: BarChart3, id: "stats" },
  { name: "الشركاء (Affiliate)", icon: Link2, id: "affiliate" },
  { name: "API Keys", icon: Key, id: "api" },
  { name: "الصلاحيات", icon: ShieldCheck, id: "roles" },
  { name: "الإعدادات", icon: Settings, id: "settings" },
];

const stats = [
  { name: "إجمالي الحجوزات", value: "1,234", change: "+12%", color: "hero-gradient" },
  { name: "المستخدمين الجدد", value: "456", change: "+8%", color: "gold-gradient" },
  { name: "الإيرادات", value: "125,000 ر.س", change: "+23%", color: "hero-gradient" },
  { name: "نسبة الرضا", value: "98%", change: "+2%", color: "gold-gradient" },
];

const recentBookings = [
  { id: 1, user: "أحمد العتيبي", type: "رحلة طيران", destination: "دبي", amount: "1,250 ر.س", status: "مؤكد" },
  { id: 2, user: "سارة المطيري", type: "فندق", destination: "إسطنبول", amount: "3,500 ر.س", status: "قيد المراجعة" },
  { id: 3, user: "محمد الشهري", type: "باقة", destination: "المالديف", amount: "8,000 ر.س", status: "مؤكد" },
  { id: 4, user: "نورة القحطاني", type: "رحلة طيران", destination: "باريس", amount: "4,200 ر.س", status: "ملغي" },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted flex overflow-x-hidden" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
        <aside className={`absolute top-0 right-0 h-full w-64 max-w-[80vw] bg-card shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="مشروك" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-gradient">مشروك</span>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-2 hover:bg-muted rounded-lg">
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "hero-gradient text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <a href="/">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>العودة للموقع</span>
              </button>
            </a>
          </div>
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${sidebarOpen ? "w-64" : "w-20"} bg-card border-l border-border transition-all duration-300 flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="مشروك" className="w-10 h-10 object-contain" />
            {sidebarOpen && <span className="text-xl font-bold text-gradient">مشروك</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-muted rounded">
            <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "hero-gradient text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <a href="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>العودة للموقع</span>}
            </button>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">
              {sidebarItems.find(i => i.id === activeSection)?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="بحث..." className="pr-10 w-64" />
            </div>
            <button className="relative p-2 hover:bg-muted rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-10 h-10 hero-gradient rounded-full flex items-center justify-center text-primary-foreground font-bold">
              أ
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-card rounded-2xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">{stat.name}</span>
                      <span className="text-primary text-sm font-semibold">{stat.change}</span>
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">آخر الحجوزات</h2>
                  <Button variant="outline" size="sm">عرض الكل</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">المستخدم</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">النوع</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">الوجهة</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">المبلغ</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-4 px-4 font-medium">{booking.user}</td>
                          <td className="py-4 px-4 text-muted-foreground">{booking.type}</td>
                          <td className="py-4 px-4 text-muted-foreground">{booking.destination}</td>
                          <td className="py-4 px-4 font-semibold text-primary">{booking.amount}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "مؤكد" ? "bg-primary/10 text-primary" :
                              booking.status === "قيد المراجعة" ? "bg-secondary/10 text-secondary" :
                              "bg-destructive/10 text-destructive"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button className="p-1.5 hover:bg-muted rounded"><Eye className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-muted rounded"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-muted rounded text-destructive"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold mb-6">إدارة API Keys</h2>
                <p className="text-muted-foreground mb-6">
                  أضف مفاتيح API للربط مع خدمات السفر والخرائط والطقس والذكاء الاصطناعي والتخزين السحابي.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold">Amadeus API</h3>
                      <p className="text-sm text-muted-foreground">الرحلات والفنادق والوجهات</p>
                    </div>
                    <span className="text-sm text-primary">مُفعّل</span>
                    <Button variant="outline" size="sm">تعديل</Button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold">Google Maps Places</h3>
                      <p className="text-sm text-muted-foreground">الأماكن السياحية والخرائط</p>
                    </div>
                    <span className="text-sm text-muted-foreground">غير مُفعّل</span>
                    <Button variant="outline" size="sm">إضافة</Button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold">OpenWeather</h3>
                      <p className="text-sm text-muted-foreground">حالة الطقس وتوقعات السفر</p>
                    </div>
                    <span className="text-sm text-muted-foreground">غير مُفعّل</span>
                    <Button variant="outline" size="sm">إضافة</Button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold">GeoDB Cities</h3>
                      <p className="text-sm text-muted-foreground">معلومات المدن والوجهات</p>
                    </div>
                    <span className="text-sm text-muted-foreground">غير مُفعّل</span>
                    <Button variant="outline" size="sm">إضافة</Button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold">نموذج الذكاء الاصطناعي</h3>
                      <p className="text-sm text-muted-foreground">مساعد ذكي وتحليل بيانات</p>
                    </div>
                    <span className="text-sm text-muted-foreground">غير مُفعّل</span>
                    <Button variant="outline" size="sm">إضافة</Button>
                  </div>
                </div>

                <Button variant="hero" className="mt-6 gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة API جديد
                </Button>
              </div>
            </div>
          )}

          {activeSection === "affiliate" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold mb-6">الشركاء والتسويق بالعمولة</h2>
                <p className="text-muted-foreground mb-6">
                  أضف روابط الشركاء لربط الخدمات التي يتم تسويقها في الموقع.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl">
                    <h3 className="font-semibold mb-2">Booking.com Affiliate</h3>
                    <p className="text-sm text-muted-foreground mb-4">حجوزات الفنادق</p>
                    <Input placeholder="Affiliate ID" className="mb-2" />
                    <Button variant="outline" size="sm" className="w-full">حفظ</Button>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-xl">
                    <h3 className="font-semibold mb-2">Skyscanner Affiliate</h3>
                    <p className="text-sm text-muted-foreground mb-4">تذاكر الطيران</p>
                    <Input placeholder="Affiliate ID" className="mb-2" />
                    <Button variant="outline" size="sm" className="w-full">حفظ</Button>
                  </div>
                </div>

                <Button variant="hero" className="mt-6 gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة شريك جديد
                </Button>
              </div>
            </div>
          )}

          {activeSection === "payments" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold mb-4">لوحة تحكم المدفوعات</h2>
                <p className="text-muted-foreground mb-6">
                  إدارة بوابات الدفع ومفاتيح الربط مع منصة ميسر وبطاقات الدفع.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl">
                    <h3 className="font-semibold mb-2">منصة ميسر</h3>
                    <Input placeholder="API Key" className="mb-2" />
                    <Input placeholder="Secret Key" className="mb-2" />
                    <Button variant="outline" size="sm" className="w-full">حفظ</Button>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <h3 className="font-semibold mb-2">طرق الدفع</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Samsung Pay</span>
                        <span className="text-primary">مفعّل</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Apple Pay</span>
                        <span className="text-primary">مفعّل</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>مدى / Visa / Mastercard</span>
                        <span className="text-primary">مفعّل</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">تعديل الإعدادات</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "roles" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold mb-4">صلاحيات الإدارة</h2>
                <p className="text-muted-foreground mb-6">
                  تخصيص صلاحيات الفريق لإدارة البيانات والأقسام والأسعار والمشتركين.
                </p>
                <div className="space-y-4">
                  {[
                    "إدارة الرحلات والفنادق والعروض",
                    "إدارة الأسعار والخصومات",
                    "إدارة المشتركين والمستخدمين",
                    "إدارة مفاتيح API والتكاملات",
                    "إدارة المدفوعات والاسترجاع",
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                      <span>{item}</span>
                      <button className="text-primary text-sm font-semibold">تفعيل</button>
                    </div>
                  ))}
                </div>
                <Button variant="hero" className="mt-6 gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة دور جديد
                </Button>
              </div>
            </div>
          )}

          {(activeSection === "trips" || activeSection === "hotels" || activeSection === "offers" || activeSection === "users") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="بحث..." className="pr-10 w-80" />
                </div>
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة جديد
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeSection === "trips" && <Plane className="w-8 h-8" />}
                    {activeSection === "hotels" && <Hotel className="w-8 h-8" />}
                    {activeSection === "offers" && <Tag className="w-8 h-8" />}
                    {activeSection === "users" && <Users className="w-8 h-8" />}
                  </div>
                  <p>اضغط على "إضافة جديد" لإضافة محتوى</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
