export interface HotelAmenity {
  icon: string;
  label: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  image: string;
  capacity: number;
  benefits: string[];
  cancellationPolicy: string;
  pricePerNight: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  area: string;
  rating: number;
  reviewsCount: number;
  stars: number;
  tags: string[];
  amenities: HotelAmenity[];
  minPrice: number;
  images: string[];
  checkIn: string;
  checkOut: string;
  description: string;
  landmarks: string[];
  rooms: HotelRoom[];
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "فندق الريتز كارلتون",
    city: "الرياض",
    area: "حي الدبلوماسي",
    rating: 9.2,
    reviewsCount: 3136,
    stars: 5,
    tags: ["فاخر", "الأكثر طلباً"],
    amenities: [
      { icon: "wifi", label: "واي فاي مجاني" },
      { icon: "coffee", label: "إفطار شامل" },
      { icon: "waves", label: "مسبح" },
      { icon: "car", label: "موقف سيارات" },
      { icon: "dumbbell", label: "صالة رياضية" },
      { icon: "sparkles", label: "سبا" },
    ],
    minPrice: 1200,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    ],
    checkIn: "15:00",
    checkOut: "12:00",
    description: "يقع فندق الريتز كارلتون في قلب حي الدبلوماسي بالرياض، ويوفر تجربة إقامة فاخرة لا تُنسى مع إطلالات خلابة على المدينة وخدمات عالمية المستوى.",
    landmarks: ["برج المملكة - 2 كم", "حي الدبلوماسي - 0.5 كم", "مطار الملك خالد - 25 كم"],
    rooms: [
      {
        id: "r1",
        name: "غرفة ديلوكس",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        capacity: 2,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي"],
        cancellationPolicy: "إلغاء مجاني قبل 24 ساعة",
        pricePerNight: 1200,
      },
      {
        id: "r2",
        name: "جناح تنفيذي",
        image: "https://images.unsplash.com/photo-1590490360182-c33d955e4764?w=400&q=80",
        capacity: 3,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "صالة VIP"],
        cancellationPolicy: "إلغاء مجاني قبل 48 ساعة",
        pricePerNight: 2200,
      },
      {
        id: "r3",
        name: "الجناح الملكي",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
        capacity: 4,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "صالة VIP", "نقل خاص"],
        cancellationPolicy: "إلغاء مجاني قبل 72 ساعة",
        pricePerNight: 4500,
      },
    ],
  },
  {
    id: "2",
    name: "فندق هيلتون جدة",
    city: "جدة",
    area: "الكورنيش",
    rating: 8.5,
    reviewsCount: 2480,
    stars: 5,
    tags: ["عائلي", "إطلالة بحرية"],
    amenities: [
      { icon: "wifi", label: "واي فاي مجاني" },
      { icon: "coffee", label: "إفطار شامل" },
      { icon: "waves", label: "مسبح" },
      { icon: "car", label: "موقف سيارات" },
      { icon: "baby", label: "مناسب للعائلات" },
    ],
    minPrice: 850,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80",
    ],
    checkIn: "14:00",
    checkOut: "12:00",
    description: "يطل فندق هيلتون جدة على كورنيش البحر الأحمر مع مرافق ترفيهية عائلية متكاملة وخدمات ضيافة استثنائية.",
    landmarks: ["كورنيش جدة - 0.1 كم", "نافورة الملك فهد - 3 كم", "مطار الملك عبدالعزيز - 20 كم"],
    rooms: [
      {
        id: "r4",
        name: "غرفة قياسية بإطلالة بحرية",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80",
        capacity: 2,
        benefits: ["إفطار مجاني", "واي فاي"],
        cancellationPolicy: "إلغاء مجاني قبل 24 ساعة",
        pricePerNight: 850,
      },
      {
        id: "r5",
        name: "جناح عائلي",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80",
        capacity: 5,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "منطقة لعب أطفال"],
        cancellationPolicy: "إلغاء مجاني قبل 48 ساعة",
        pricePerNight: 1600,
      },
    ],
  },
  {
    id: "3",
    name: "فندق موفنبيك المدينة",
    city: "المدينة المنورة",
    area: "المنطقة المركزية",
    rating: 8.8,
    reviewsCount: 4210,
    stars: 5,
    tags: ["قريب من الحرم", "الأكثر طلباً"],
    amenities: [
      { icon: "wifi", label: "واي فاي مجاني" },
      { icon: "coffee", label: "إفطار شامل" },
      { icon: "car", label: "موقف سيارات" },
      { icon: "concierge-bell", label: "خدمة الغرف 24/7" },
    ],
    minPrice: 950,
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80",
    ],
    checkIn: "15:00",
    checkOut: "12:00",
    description: "يقع فندق موفنبيك المدينة على بُعد خطوات من المسجد النبوي الشريف، مما يجعله الخيار الأمثل لزوار المدينة المنورة.",
    landmarks: ["المسجد النبوي - 0.2 كم", "البقيع - 0.5 كم", "مطار الأمير محمد - 15 كم"],
    rooms: [
      {
        id: "r6",
        name: "غرفة كلاسيكية",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        capacity: 2,
        benefits: ["واي فاي", "خدمة الغرف"],
        cancellationPolicy: "الدفع مسبقاً - غير قابل للإلغاء",
        pricePerNight: 950,
      },
      {
        id: "r7",
        name: "غرفة بإطلالة على الحرم",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
        capacity: 2,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "إطلالة على الحرم"],
        cancellationPolicy: "إلغاء مجاني قبل 48 ساعة",
        pricePerNight: 1800,
      },
    ],
  },
  {
    id: "4",
    name: "فندق نوفوتيل الدمام",
    city: "الدمام",
    area: "حي الشاطئ",
    rating: 7.9,
    reviewsCount: 1856,
    stars: 4,
    tags: ["رجال أعمال", "اقتصادي"],
    amenities: [
      { icon: "wifi", label: "واي فاي مجاني" },
      { icon: "coffee", label: "إفطار" },
      { icon: "car", label: "موقف سيارات" },
      { icon: "briefcase", label: "قاعة اجتماعات" },
    ],
    minPrice: 550,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
      "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80",
    ],
    checkIn: "14:00",
    checkOut: "12:00",
    description: "فندق نوفوتيل الدمام يقدم خدمات مميزة لرجال الأعمال مع قاعات اجتماعات مجهزة وموقع استراتيجي في حي الشاطئ.",
    landmarks: ["كورنيش الدمام - 1 كم", "مجمع الراشد - 3 كم", "مطار الملك فهد - 30 كم"],
    rooms: [
      {
        id: "r8",
        name: "غرفة قياسية",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80",
        capacity: 2,
        benefits: ["واي فاي", "إفطار"],
        cancellationPolicy: "إلغاء مجاني قبل 24 ساعة",
        pricePerNight: 550,
      },
      {
        id: "r9",
        name: "غرفة أعمال",
        image: "https://images.unsplash.com/photo-1590490360182-c33d955e4764?w=400&q=80",
        capacity: 2,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "قاعة اجتماعات"],
        cancellationPolicy: "إلغاء مجاني قبل 48 ساعة",
        pricePerNight: 850,
      },
    ],
  },
  {
    id: "5",
    name: "فندق شيراتون مكة",
    city: "مكة المكرمة",
    area: "أجياد",
    rating: 8.3,
    reviewsCount: 5620,
    stars: 5,
    tags: ["قريب من الحرم", "عائلي", "الأكثر طلباً"],
    amenities: [
      { icon: "wifi", label: "واي فاي مجاني" },
      { icon: "coffee", label: "إفطار شامل" },
      { icon: "car", label: "موقف سيارات" },
      { icon: "concierge-bell", label: "خدمة الغرف 24/7" },
      { icon: "sparkles", label: "تنظيف يومي" },
    ],
    minPrice: 1100,
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    ],
    checkIn: "15:00",
    checkOut: "12:00",
    description: "يتميز فندق شيراتون مكة بقربه من المسجد الحرام وتوفيره لجميع وسائل الراحة والخدمات المتميزة للحجاج والمعتمرين.",
    landmarks: ["المسجد الحرام - 0.3 كم", "أبراج البيت - 0.5 كم", "منى - 5 كم"],
    rooms: [
      {
        id: "r10",
        name: "غرفة قياسية",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        capacity: 3,
        benefits: ["واي فاي", "تنظيف يومي"],
        cancellationPolicy: "الدفع مسبقاً - غير قابل للإلغاء",
        pricePerNight: 1100,
      },
      {
        id: "r11",
        name: "جناح عائلي بإطلالة على الحرم",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
        capacity: 5,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "إطلالة على الحرم"],
        cancellationPolicy: "إلغاء مجاني قبل 72 ساعة",
        pricePerNight: 3200,
      },
    ],
  },
  {
    id: "6",
    name: "فندق راديسون بلو أبها",
    city: "أبها",
    area: "وسط المدينة",
    rating: 8.0,
    reviewsCount: 1240,
    stars: 4,
    tags: ["فاخر", "إطلالة جبلية"],
    amenities: [
      { icon: "wifi", label: "واي فاي مجاني" },
      { icon: "coffee", label: "إفطار" },
      { icon: "waves", label: "مسبح" },
      { icon: "car", label: "موقف سيارات" },
    ],
    minPrice: 650,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ],
    checkIn: "14:00",
    checkOut: "11:00",
    description: "استمتع بأجواء أبها الساحرة من فندق راديسون بلو مع إطلالات جبلية خلابة وخدمات فندقية راقية.",
    landmarks: ["منتزه السودة - 20 كم", "قرية المفتاحة - 2 كم", "مطار أبها - 15 كم"],
    rooms: [
      {
        id: "r12",
        name: "غرفة بإطلالة جبلية",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80",
        capacity: 2,
        benefits: ["إفطار مجاني", "واي فاي", "إطلالة جبلية"],
        cancellationPolicy: "إلغاء مجاني قبل 24 ساعة",
        pricePerNight: 650,
      },
      {
        id: "r13",
        name: "جناح جبلي فاخر",
        image: "https://images.unsplash.com/photo-1590490360182-c33d955e4764?w=400&q=80",
        capacity: 3,
        benefits: ["إلغاء مجاني", "إفطار مجاني", "واي فاي", "مسبح خاص"],
        cancellationPolicy: "إلغاء مجاني قبل 48 ساعة",
        pricePerNight: 1400,
      },
    ],
  },
];
