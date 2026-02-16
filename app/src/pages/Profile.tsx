import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Plane,
  Hotel,
  Clock,
  Edit,
  Settings,
  LogOut,
  CreditCard,
  Bell
} from "lucide-react";

const bookingHistory = [
  {
    id: 1,
    type: "flight",
    title: "رحلة إلى دبي",
    date: "15 فبراير 2026",
    status: "مكتملة",
    price: "1,250",
    details: "الرياض → دبي | درجة الأعمال",
  },
  {
    id: 2,
    type: "hotel",
    title: "فندق برج العرب",
    date: "15-20 فبراير 2026",
    status: "مكتملة",
    price: "8,500",
    details: "5 ليالٍ | جناح ديلوكس",
  },
  {
    id: 3,
    type: "flight",
    title: "رحلة إلى إسطنبول",
    date: "10 مارس 2026",
    status: "قادمة",
    price: "2,100",
    details: "جدة → إسطنبول | درجة رجال الأعمال",
  },
];

export default function Profile() {
  return (
    <Layout>
      <section className="py-20 bg-muted min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                {/* Profile Photo */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold">أحمد محمد</h2>
                  <p className="text-muted-foreground">عضو ذهبي</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <User className="w-5 h-5" />
                    معلوماتي
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Calendar className="w-5 h-5" />
                    حجوزاتي
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <CreditCard className="w-5 h-5" />
                    طرق الدفع
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Bell className="w-5 h-5" />
                    الإشعارات
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Settings className="w-5 h-5" />
                    الإعدادات
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </Button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Personal Info */}
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">المعلومات الشخصية</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input value="أحمد محمد العتيبي" className="pr-10" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input value="ahmed@example.com" className="pr-10" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">رقم الجوال</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input value="+966 54 245 4094" className="pr-10" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">المدينة</label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input value="الرياض، المملكة العربية السعودية" className="pr-10" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className="w-14 h-14 hero-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Plane className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-muted-foreground">رحلة طيران</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className="w-14 h-14 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Hotel className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-muted-foreground">حجز فندقي</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-muted-foreground">حجز قادم</p>
                </div>
              </div>

              {/* Booking History */}
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="text-xl font-bold mb-6">سجل الحجوزات</h3>

                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 bg-muted rounded-xl"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        booking.type === "flight" ? "hero-gradient" : "gold-gradient"
                      }`}>
                        {booking.type === "flight" ? (
                          <Plane className="w-6 h-6 text-primary-foreground" />
                        ) : (
                          <Hotel className="w-6 h-6 text-secondary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{booking.title}</h4>
                        <p className="text-sm text-muted-foreground">{booking.details}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-primary">{booking.price} ر.س</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === "مكتملة" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-secondary/10 text-secondary"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6">
                  عرض جميع الحجوزات
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
