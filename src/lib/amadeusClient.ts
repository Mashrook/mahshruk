const FUNCTION_NAME = "amadeus";

// ─── Flight Types ───

export interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { iataCode: string; terminal?: string; at: string };
      arrival: { iataCode: string; terminal?: string; at: string };
      carrierCode: string;
      number: string;
      aircraft: { code: string };
      operating?: { carrierCode: string };
      duration: string;
      numberOfStops: number;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    grandTotal: string;
  };
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: { currency: string; total: string; base: string };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
    }>;
  }>;
  validatingAirlineCodes: string[];
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  max?: number;
}

// ─── Hotel Types ───

export interface AmadeusHotelListItem {
  chainCode?: string;
  iataCode: string;
  dupeId: number;
  name: string;
  hotelId: string;
  geoCode: { latitude: number; longitude: number };
  address?: { countryCode: string };
  distance?: { value: number; unit: string };
}

export interface AmadeusHotelOffer {
  type: string;
  hotel: {
    type: string;
    hotelId: string;
    chainCode?: string;
    name: string;
    cityCode?: string;
    latitude?: number;
    longitude?: number;
  };
  available: boolean;
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode?: string;
    room: {
      type?: string;
      typeEstimated?: {
        category?: string;
        beds?: number;
        bedType?: string;
      };
      description?: { text?: string; lang?: string };
    };
    guests?: { adults: number };
    price: {
      currency: string;
      base?: string;
      total: string;
      variations?: {
        average?: { base?: string };
        changes?: Array<{ startDate: string; endDate: string; base?: string; total?: string }>;
      };
    };
    policies?: {
      cancellations?: Array<{ deadline?: string; amount?: string; description?: { text?: string } }>;
      paymentType?: string;
      guarantee?: {
        acceptedPayments?: {
          methods?: string[];
          creditCards?: string[];
        };
      };
    };
    self?: string;
  }>;
  self?: string;
}

export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
  radius?: number;
}

export interface HotelBookingGuest {
  tid: number;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface HotelBookingPayment {
  method: string;
  paymentCard?: {
    vendorCode: string;
    cardNumber: string;
    expiryDate: string;
    holderName: string;
  };
}

export interface HotelBookingResult {
  data: Array<{
    type: string;
    id: string;
    providerConfirmationId?: string;
    associatedRecords?: Array<{
      reference: string;
      originSystemCode: string;
    }>;
  }>;
}

// ─── API Helpers ───

function buildUrl(action: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ action, ...params });
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?${qs}`;
}

const defaultHeaders = {
  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
};

// ─── Flight API ───

export async function searchFlights(params: FlightSearchParams) {
  const qs = new URLSearchParams({
    action: "search",
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    adults: String(params.adults),
    max: String(params.max || 10),
  });
  if (params.returnDate) qs.set("returnDate", params.returnDate);

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?${qs}`;
  const res = await fetch(url, { headers: defaultHeaders });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Search failed" }));
    throw new Error(err.error || "فشل البحث عن الرحلات");
  }

  return await res.json();
}

export async function priceFlightOffer(flightOffer: AmadeusFlightOffer) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?action=price`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...defaultHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ flightOffer }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Pricing failed" }));
    throw new Error(err.error || "فشل التسعير");
  }

  return await res.json();
}

export async function bookFlight(flightOffer: AmadeusFlightOffer, travelers: unknown[]) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?action=book`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...defaultHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ flightOffer, travelers }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Booking failed" }));
    throw new Error(err.error || "فشل الحجز");
  }

  return await res.json();
}

// ─── Hotel API ───

export async function searchHotelsByCity(cityCode: string, radius?: number): Promise<{ data: AmadeusHotelListItem[] }> {
  const url = buildUrl("hotel-list", {
    cityCode,
    ...(radius ? { radius: String(radius) } : {}),
  });
  const res = await fetch(url, { headers: defaultHeaders });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Hotel search failed" }));
    throw new Error(err.error || "فشل البحث عن الفنادق");
  }

  return await res.json();
}

export async function getHotelOffers(params: {
  hotelIds: string[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
}): Promise<{ data: AmadeusHotelOffer[] }> {
  const url = buildUrl("hotel-offers", {
    hotelIds: params.hotelIds.join(","),
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: String(params.adults),
    roomQuantity: String(params.roomQuantity || 1),
  });
  const res = await fetch(url, { headers: defaultHeaders });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Hotel offers failed" }));
    throw new Error(err.error || "فشل جلب عروض الفنادق");
  }

  return await res.json();
}

export async function getHotelOfferDetailsApi(offerId: string): Promise<{ data: AmadeusHotelOffer }> {
  const url = buildUrl("hotel-offer-details", { offerId });
  const res = await fetch(url, { headers: defaultHeaders });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Offer details failed" }));
    throw new Error(err.error || "فشل جلب تفاصيل العرض");
  }

  return await res.json();
}

export async function bookHotelOffer(params: {
  offerId: string;
  guests: HotelBookingGuest[];
  payment: HotelBookingPayment;
}): Promise<HotelBookingResult> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?action=hotel-book`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...defaultHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Hotel booking failed" }));
    throw new Error(err.error || "فشل حجز الفندق");
  }

  return await res.json();
}

// ─── Transfer Types ───

export interface TransferSearchParams {
  startLocationCode: string;
  endLocationCode?: string;
  endAddressLine?: string;
  endCityName?: string;
  endCountryCode?: string;
  endGeoCode?: string;
  startDateTime: string;
  passengers: number;
  transferType?: string;
  currency?: string;
}

export interface TransferOffer {
  type: string;
  id: string;
  transferType: string;
  start: {
    dateTime: string;
    locationCode?: string;
    address?: { line?: string; cityName?: string; countryCode?: string };
    name?: string;
  };
  end?: {
    dateTime?: string;
    locationCode?: string;
    address?: { line?: string; cityName?: string; countryCode?: string };
    name?: string;
  };
  duration?: string;
  vehicle: {
    code?: string;
    category?: string;
    description?: string;
    seats?: Array<{ count: number }>;
    baggages?: Array<{ count: number; size?: string }>;
    imageURL?: string;
  };
  serviceProvider: {
    code: string;
    name: string;
    logoUrl?: string;
  };
  quotation: {
    monetaryAmount: string;
    currencyCode: string;
    isEstimated?: boolean;
    base?: { monetaryAmount: string; currencyCode: string };
    totalTaxes?: { monetaryAmount: string; currencyCode: string };
  };
  converted?: {
    monetaryAmount: string;
    currencyCode: string;
  };
  cancellationRules?: Array<{
    feeType?: string;
    feeValue?: string;
    metricType?: string;
    metricMin?: string;
    metricMax?: string;
  }>;
  methodsOfPaymentAccepted?: string[];
  extraServices?: Array<{
    code: string;
    itemId?: string;
    description?: string;
    quotation?: { monetaryAmount: string; currencyCode: string };
  }>;
  equipment?: Array<{
    code: string;
    description?: string;
    quotation?: { monetaryAmount: string; currencyCode: string };
  }>;
  distance?: { value: number; unit: string };
}

export interface TransferBookingPassenger {
  firstName: string;
  lastName: string;
  title: string;
  contacts: { phoneNumber: string; email: string };
}

export interface TransferBookingPayment {
  methodOfPayment: string;
  creditCard?: {
    number: string;
    holderName: string;
    vendorCode: string;
    expiryDate: string;
    cvv: string;
  };
}

// ─── Transfer API ───

export async function searchTransfers(params: TransferSearchParams): Promise<{ data: TransferOffer[] }> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?action=transfer-search`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...defaultHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Transfer search failed" }));
    throw new Error(err.error || "فشل البحث عن التحويلات");
  }

  return await res.json();
}

export async function bookTransfer(params: {
  offerId: string;
  passengers: TransferBookingPassenger[];
  payment: TransferBookingPayment;
  note?: string;
}) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?action=transfer-book`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...defaultHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Transfer booking failed" }));
    throw new Error(err.error || "فشل حجز التحويل");
  }

  return await res.json();
}

export async function cancelTransfer(orderId: string, confirmNbr: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}?action=transfer-cancel`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...defaultHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, confirmNbr }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Cancel failed" }));
    throw new Error(err.error || "فشل إلغاء الحجز");
  }

  return await res.json();
}

// ─── Helpers ───

const transferTypeNames: Record<string, string> = {
  PRIVATE: "نقل خاص",
  SHARED: "نقل مشترك",
  TAXI: "تاكسي",
  HOURLY: "بالساعة",
  AIRPORT_EXPRESS: "قطار المطار",
  AIRPORT_BUS: "باص المطار",
};

export function getTransferTypeName(code: string): string {
  return transferTypeNames[code] || code;
}

const vehicleCodeNames: Record<string, string> = {
  MBR: "دراجة نارية",
  CAR: "سيارة",
  SED: "سيدان",
  WGN: "ستيشن",
  ELC: "سيارة كهربائية",
  VAN: "فان",
  SUV: "SUV",
  LMS: "ليموزين",
  TRN: "قطار",
  BUS: "حافلة",
};

export function getVehicleName(code: string): string {
  return vehicleCodeNames[code] || code;
}

export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = match[1] ? `${match[1]}س` : "";
  const mins = match[2] ? ` ${match[2]}د` : "";
  return `${hours}${mins}`.trim();
}

const airlineNames: Record<string, string> = {
  SV: "الخطوط السعودية",
  XY: "فلاي ناس",
  F3: "طيران أديل",
  EK: "طيران الإمارات",
  QR: "الخطوط القطرية",
  GF: "طيران الخليج",
  MS: "مصر للطيران",
  TK: "الخطوط التركية",
  EY: "الاتحاد للطيران",
  WY: "الطيران العُماني",
  KU: "الخطوط الكويتية",
  RJ: "الملكية الأردنية",
};

export function getAirlineName(code: string): string {
  return airlineNames[code] || code;
}

const cityNames: Record<string, string> = {
  RUH: "الرياض",
  JED: "جدة",
  DMM: "الدمام",
  MED: "المدينة المنورة",
  AHB: "أبها",
  TUU: "تبوك",
  TIF: "الطائف",
  MKX: "مكة المكرمة",
  DXB: "دبي",
  CAI: "القاهرة",
  IST: "إسطنبول",
  LHR: "لندن",
  CDG: "باريس",
  NYC: "نيويورك",
  LON: "لندن",
};

export function getCityName(code: string): string {
  return cityNames[code] || code;
}

export function getNightsCount(checkIn: string, checkOut: string): number {
  const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.round(diff) : 1;
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
