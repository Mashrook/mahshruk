import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star, MapPin, Clock, ChevronLeft, ChevronRight, Users, ShieldCheck, ShoppingCart,
  Wifi, Coffee, Waves, Car, Dumbbell, Sparkles, Baby, Briefcase, ConciergeBell, Check, X,
  Phone, Navigation, Heart, Share2, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { hotels } from "@/data/hotelsData";
import { useHotelCartStore, type CartItem } from "@/stores/hotelCartStore";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  waves: <Waves className="w-5 h-5" />,
  car: <Car className="w-5 h-5" />,
  dumbbell: <Dumbbell className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  baby: <Baby className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  "concierge-bell": <ConciergeBell className="w-5 h-5" />,
};

function getRatingLabel(rating: number) {
  if (rating >= 9) return "ممتاز";
  if (rating >= 8) return "جيد جداً";
  if (rating >= 7) return "جيد";
  return "مقبول";
}

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useHotelCartStore((s) => s.addItem);
  const cartItems = useHotelCartStore((s) => s.items);

  const hotel = hotels.find((h) => h.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">الفندق غير موجود</p>
          <Button onClick={() => navigate("/hotels")}>العودة للفنادق</Button>
        </div>
      </div>
    );
  }

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const diff = (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  };

  const handleBookRoom = (room: typeof hotel.rooms[0]) => {
    const nights = getNights();
    const cartItem: CartItem = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      checkIn: checkInDate || new Date().toISOString().split("T")[0],
      checkOut: checkOutDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      nights,
      pricePerNight: room.pricePerNight,
      totalPrice: room.pricePerNight * nights,
      guests: room.capacity,
    };
    addItem(cartItem);
    toast({ title: "تمت الإضافة للسلة ✓", description: `${room.name} - ${hotel.name}` });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/30 py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-3 h-3" />
            <Link to="/hotels" className="hover:text-primary transition-colors">الفنادق</Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-foreground font-medium">{hotel.name}</span>
          </nav>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-5">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-96 lg:h-[420px] rounded-2xl overflow-hidden">
          {/* Main large image */}
          <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => setActiveImage(0)}>
            <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{hotel.images.length} صور</span>
            </div>
          </div>
          {/* Smaller images */}
          {hotel.images.slice(1, 5).map((img, i) => (
            <div key={i} className="relative cursor-pointer overflow-hidden" onClick={() => setActiveImage(i + 1)}>
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
          {/* Fill remaining slots if less than 4 extra images */}
          {hotel.images.length < 5 && Array.from({ length: 5 - hotel.images.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-muted/30 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Hotel Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.city}، {hotel.area}</span>
                </div>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-left">
                  <p className="font-bold">{getRatingLabel(hotel.rating)}</p>
                  <p className="text-xs text-muted-foreground">{hotel.reviewsCount.toLocaleString()} تقييم</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">{hotel.rating}</span>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl bg-card border border-border/50 p-3 text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground">تسجيل الدخول</p>
                <p className="font-bold text-sm">PM {hotel.checkIn}</p>
              </div>
              <div className="rounded-xl bg-card border border-border/50 p-3 text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground">تسجيل الخروج</p>
                <p className="font-bold text-sm">PM {hotel.checkOut}</p>
              </div>
              <div className="rounded-xl bg-card border border-border/50 p-3 text-center">
                <Phone className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground">هاتف</p>
                <p className="font-bold text-sm" dir="ltr">+966 12 XXX XXXX</p>
              </div>
              <div className="rounded-xl bg-card border border-border/50 p-3 text-center">
                <MapPin className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground">الموقع</p>
                <p className="font-bold text-sm">{hotel.city}</p>
              </div>
            </div>
          </div>

          {/* Price Card */}
          <div className="lg:w-64 shrink-0">
            <div className="rounded-2xl bg-card border border-primary/30 p-5 text-center sticky top-24">
              <p className="text-xs text-muted-foreground mb-1">أقل سعر متوفر</p>
              <p className="text-4xl font-bold text-primary mb-1">{hotel.minPrice.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mb-4">ر.س / للغرفة / ليلة</p>

              {/* Date Selection */}
              <div className="space-y-2 mb-4">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5 text-right">تاريخ الدخول</label>
                  <div className="bg-muted/30 border border-border rounded-lg h-9 px-2 flex items-center">
                    <DatePickerField value={checkInDate} onChange={setCheckInDate} placeholder="تاريخ الدخول" minDate={new Date()} className="text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5 text-right">تاريخ الخروج</label>
                  <div className="bg-muted/30 border border-border rounded-lg h-9 px-2 flex items-center">
                    <DatePickerField value={checkOutDate} onChange={setCheckOutDate} placeholder="تاريخ الخروج" minDate={checkInDate ? new Date(checkInDate) : new Date()} className="text-sm" />
                  </div>
                </div>
              </div>

              <Button variant="gold" size="lg" className="w-full mb-3">
                احجز الآن
              </Button>

              <div className="flex items-center justify-center gap-3">
                <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                  <Heart className="w-3.5 h-3.5" /> حفظ
                </button>
                <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> مشاركة
                </button>
              </div>

              {/* Cart */}
              <Button variant="outline" size="sm" className="w-full mt-3 gap-2 relative" onClick={() => navigate("/hotel-cart")}>
                <ShoppingCart className="w-4 h-4" /> السلة
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* About Hotel */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            عن الفندق
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            المرافق والخدمات
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {hotel.amenities.map((a) => (
              <div key={a.label} className="rounded-xl bg-card border border-border/50 p-3 text-center hover:border-primary/30 transition-colors">
                <span className="text-primary block mx-auto mb-1.5">{amenityIcons[a.icon] || <Sparkles className="w-5 h-5 mx-auto" />}</span>
                <span className="text-xs text-muted-foreground">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Landmarks */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            المعالم القريبة
          </h2>
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            {hotel.landmarks.map((l, i) => {
              const parts = l.split(" - ");
              return (
                <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < hotel.landmarks.length - 1 ? "border-b border-border/30" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{parts[0]}</span>
                  </div>
                  {parts[1] && <span className="text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg">{parts[1]}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Rooms */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            الغرف المتاحة
          </h2>
          <p className="text-xs text-muted-foreground mb-4">الأسعار المعروضة لليلة الواحدة وقد تشمل الضرائب والرسوم</p>

          {/* Rooms Table */}
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 px-5 py-3 bg-muted/30 border-b border-border/30 text-xs font-bold text-muted-foreground">
              <span>نوع الغرفة</span>
              <span className="text-center">السعة</span>
              <span className="text-center">السعر / ليلة</span>
              <span className="text-center">الإجمالي</span>
              <span className="text-center">الحجز</span>
            </div>

            {hotel.rooms.map((room) => {
              const nights = getNights();
              const total = room.pricePerNight * nights;
              const inCart = cartItems.some((i) => i.roomId === room.id);
              return (
                <div key={room.id} className={`border-b border-border/30 last:border-b-0 ${inCart ? "bg-primary/5" : ""}`}>
                  <div className="flex flex-col md:grid md:grid-cols-5 gap-4 p-5 items-center">
                    {/* Room Info */}
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={room.image} alt={room.name} className="w-16 h-12 rounded-lg object-cover shrink-0" />
                        <div>
                          <h4 className="font-bold text-sm">{room.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.benefits.slice(0, 3).map((b) => (
                              <span key={b} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Check className="w-2.5 h-2.5" /> {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {room.cancellationPolicy}
                      </p>
                    </div>

                    {/* Capacity */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{room.capacity}</span>
                      </div>
                    </div>

                    {/* Price Per Night */}
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{room.pricePerNight.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">ر.س / ليلة</p>
                    </div>

                    {/* Total */}
                    <div className="text-center">
                      <p className="text-lg font-bold">{total.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{nights > 1 ? `${nights} ليالي` : "ليلة"} ر.س</p>
                    </div>

                    {/* Book Button */}
                    <div className="text-center w-full md:w-auto">
                      <Button
                        variant={inCart ? "outline" : "gold"}
                        size="sm"
                        onClick={() => handleBookRoom(room)}
                        disabled={inCart}
                        className="w-full md:w-auto"
                      >
                        {inCart ? "في السلة ✓" : "احجز الآن"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
