// Amadeus Edge Function - Flights + Hotels (Full Booking Engine)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AMADEUS_BASE = "https://test.api.amadeus.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log("[Amadeus] Using cached token");
    return cachedToken.token;
  }

  const clientId = Deno.env.get("AMADEUS_CLIENT_ID");
  const clientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Amadeus credentials not configured");
  }

  console.log("[Amadeus] Requesting new OAuth token...");
  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Amadeus] OAuth failed:", errText);
    throw new Error(`Amadeus OAuth failed [${res.status}]: ${errText}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  console.log("[Amadeus] Token obtained, expires in", data.expires_in, "seconds");
  return cachedToken.token;
}

// ─── Flight Functions ───

async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  currencyCode?: string;
  max?: number;
}) {
  const token = await getAccessToken();
  const qs = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: String(params.adults),
    currencyCode: params.currencyCode || "SAR",
    max: String(params.max || 10),
  });
  if (params.returnDate) qs.set("returnDate", params.returnDate);

  console.log("[Amadeus] Searching flights:", qs.toString());
  const res = await fetch(`${AMADEUS_BASE}/v2/shopping/flight-offers?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Amadeus] Flight search failed:", errText);
    throw new Error(`Amadeus search failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

async function priceFlightOffer(flightOffer: unknown) {
  const token = await getAccessToken();
  const res = await fetch(`${AMADEUS_BASE}/v1/shopping/flight-offers/pricing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { type: "flight-offers-pricing", flightOffers: [flightOffer] },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Amadeus pricing failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

async function createFlightOrder(flightOffer: unknown, travelers: unknown[]) {
  const token = await getAccessToken();
  const res = await fetch(`${AMADEUS_BASE}/v1/booking/flight-orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "flight-order",
        flightOffers: [flightOffer],
        travelers,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Amadeus booking failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

// ─── Hotel Functions ───

async function searchHotelsByCity(cityCode: string, radius?: number, radiusUnit?: string) {
  const token = await getAccessToken();
  const qs = new URLSearchParams({
    cityCode,
    radius: String(radius || 30),
    radiusUnit: radiusUnit || "KM",
    hotelSource: "ALL",
  });

  console.log("[Amadeus] Hotel List - cityCode:", cityCode);
  const res = await fetch(`${AMADEUS_BASE}/v1/reference-data/locations/hotels/by-city?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Amadeus] Hotel city search failed:", errText);
    throw new Error(`Hotel city search failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

async function getHotelOffers(params: {
  hotelIds: string[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
  currency?: string;
}) {
  const token = await getAccessToken();
  const qs = new URLSearchParams({
    hotelIds: params.hotelIds.slice(0, 20).join(","),
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: String(params.adults),
    roomQuantity: String(params.roomQuantity || 1),
    currency: params.currency || "SAR",
  });

  console.log("[Amadeus] Hotel Offers - hotels:", params.hotelIds.length, "checkIn:", params.checkInDate);
  const res = await fetch(`${AMADEUS_BASE}/v3/shopping/hotel-offers?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Amadeus] Hotel offers failed:", errText);
    throw new Error(`Hotel offers failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

async function getHotelOfferDetails(offerId: string) {
  const token = await getAccessToken();
  console.log("[Amadeus] Hotel Offer Details - offerId:", offerId);
  const res = await fetch(`${AMADEUS_BASE}/v3/shopping/hotel-offers/${offerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Amadeus] Hotel offer details failed:", errText);
    throw new Error(`Hotel offer details failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

// ─── Hotel Booking (Amadeus Hotel Orders API) ───
// POST /v2/booking/hotel-orders
// Docs: https://developers.amadeus.com/self-service/category/hotels/api-doc/hotel-booking/api-reference

async function bookHotelOffer(params: {
  offerId: string;
  guests: Array<{
    tid: number;
    title: string;        // "MR" | "MS" | "MRS"
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }>;
  payment: {
    method: string;       // "CREDIT_CARD" | "CORPORATE" etc.
    paymentCard?: {
      vendorCode: string; // "VI" | "MC" | "AX"
      cardNumber: string;
      expiryDate: string; // "2026-01"
      holderName: string;
    };
  };
}) {
  const token = await getAccessToken();

  // Build request body per Amadeus Hotel Booking API spec
  const requestBody = {
    data: {
      type: "hotel-order",
      guests: params.guests.map((g) => ({
        tid: g.tid,
        name: {
          title: g.title,
          firstName: g.firstName,
          lastName: g.lastName,
        },
        contact: {
          phone: g.phone,
          email: g.email,
        },
      })),
      travelAgent: {
        contact: {
          email: "bookings@mashroky.com",
        },
      },
      roomAssociations: [
        {
          guestReferences: params.guests.map((g) => ({
            guestReference: String(g.tid),
          })),
          hotelOfferId: params.offerId,
        },
      ],
      payment: {
        method: params.payment.method,
        ...(params.payment.paymentCard
          ? {
              paymentCard: {
                paymentCardInfo: {
                  vendorCode: params.payment.paymentCard.vendorCode,
                  cardNumber: params.payment.paymentCard.cardNumber,
                  expiryDate: params.payment.paymentCard.expiryDate,
                  holderName: params.payment.paymentCard.holderName,
                },
              },
            }
          : {}),
      },
    },
  };

  console.log("[Amadeus] Booking hotel - offerId:", params.offerId, "guests:", params.guests.length);
  console.log("[Amadeus] Request body:", JSON.stringify(requestBody, null, 2));

  const res = await fetch(`${AMADEUS_BASE}/v2/booking/hotel-orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.amadeus+json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await res.text();
  console.log("[Amadeus] Booking response status:", res.status);
  console.log("[Amadeus] Booking response:", responseText);

  if (!res.ok) {
    let errorDetail = responseText;
    try {
      const errJson = JSON.parse(responseText);
      errorDetail = errJson.errors?.[0]?.detail || errJson.errors?.[0]?.title || responseText;
    } catch { /* use raw text */ }
    throw new Error(`Hotel booking failed [${res.status}]: ${errorDetail}`);
  }

  return JSON.parse(responseText);
}

// ─── Transfer Functions ───

async function searchTransferOffers(params: {
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
}) {
  const token = await getAccessToken();

  const requestBody: Record<string, unknown> = {
    startLocationCode: params.startLocationCode,
    startDateTime: params.startDateTime,
    passengers: params.passengers,
    currency: params.currency || "SAR",
  };

  if (params.transferType) requestBody.transferType = params.transferType;
  if (params.endLocationCode) requestBody.endLocationCode = params.endLocationCode;
  if (params.endAddressLine) requestBody.endAddressLine = params.endAddressLine;
  if (params.endCityName) requestBody.endCityName = params.endCityName;
  if (params.endCountryCode) requestBody.endCountryCode = params.endCountryCode;
  if (params.endGeoCode) requestBody.endGeoCode = params.endGeoCode;

  console.log("[Amadeus] Transfer Search:", JSON.stringify(requestBody));
  const res = await fetch(`${AMADEUS_BASE}/v1/shopping/transfer-offers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.amadeus+json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Amadeus] Transfer search failed:", errText);
    throw new Error(`Transfer search failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

async function bookTransferOffer(params: {
  offerId: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    title: string;
    contacts: { phoneNumber: string; email: string };
  }>;
  payment: {
    methodOfPayment: string;
    creditCard?: {
      number: string;
      holderName: string;
      vendorCode: string;
      expiryDate: string;
      cvv: string;
    };
  };
  note?: string;
}) {
  const token = await getAccessToken();

  const requestBody = {
    data: {
      note: params.note || "",
      passengers: params.passengers,
      payment: params.payment,
      agency: {
        contacts: [{ email: { address: "bookings@mashroky.com" } }],
      },
    },
  };

  console.log("[Amadeus] Transfer booking - offerId:", params.offerId);
  const res = await fetch(
    `${AMADEUS_BASE}/v1/ordering/transfer-orders?offerId=${params.offerId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.amadeus+json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const responseText = await res.text();
  console.log("[Amadeus] Transfer booking status:", res.status);

  if (!res.ok) {
    let errorDetail = responseText;
    try {
      const errJson = JSON.parse(responseText);
      errorDetail = errJson.errors?.[0]?.detail || errJson.errors?.[0]?.title || responseText;
    } catch { /* use raw text */ }
    throw new Error(`Transfer booking failed [${res.status}]: ${errorDetail}`);
  }

  return JSON.parse(responseText);
}

async function cancelTransferOrder(orderId: string, confirmNbr: string) {
  const token = await getAccessToken();

  console.log("[Amadeus] Cancel transfer - orderId:", orderId, "confirmNbr:", confirmNbr);
  const res = await fetch(
    `${AMADEUS_BASE}/v1/ordering/transfer-orders/${orderId}/transfers/cancellation?confirmNbr=${confirmNbr}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.amadeus+json",
      },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Transfer cancel failed [${res.status}]: ${errText}`);
  }

  return await res.json();
}

// ─── Router ───

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    console.log(`[Amadeus] ${req.method} action=${action}`);

    // --- Flight actions ---
    if (req.method === "GET" && action === "search") {
      const origin = url.searchParams.get("origin");
      const destination = url.searchParams.get("destination");
      const departureDate = url.searchParams.get("departureDate");
      const returnDate = url.searchParams.get("returnDate") || undefined;
      const adults = parseInt(url.searchParams.get("adults") || "1");
      const max = parseInt(url.searchParams.get("max") || "10");

      if (!origin || !destination || !departureDate) {
        return new Response(
          JSON.stringify({ error: "origin, destination, departureDate required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await searchFlights({ origin, destination, departureDate, returnDate, adults, max });
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && action === "price") {
      const body = await req.json();
      const data = await priceFlightOffer(body.flightOffer);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && action === "book") {
      const body = await req.json();
      const data = await createFlightOrder(body.flightOffer, body.travelers);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Hotel actions ---
    if (req.method === "GET" && action === "hotel-list") {
      const cityCode = url.searchParams.get("cityCode");
      if (!cityCode) {
        return new Response(
          JSON.stringify({ error: "cityCode required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const radius = parseInt(url.searchParams.get("radius") || "30");
      const data = await searchHotelsByCity(cityCode, radius);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && action === "hotel-offers") {
      const hotelIds = url.searchParams.get("hotelIds");
      const checkInDate = url.searchParams.get("checkInDate");
      const checkOutDate = url.searchParams.get("checkOutDate");
      const adults = parseInt(url.searchParams.get("adults") || "1");
      const roomQuantity = parseInt(url.searchParams.get("roomQuantity") || "1");

      if (!hotelIds || !checkInDate || !checkOutDate) {
        return new Response(
          JSON.stringify({ error: "hotelIds, checkInDate, checkOutDate required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await getHotelOffers({
        hotelIds: hotelIds.split(","),
        checkInDate,
        checkOutDate,
        adults,
        roomQuantity,
      });
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && action === "hotel-offer-details") {
      const offerId = url.searchParams.get("offerId");
      if (!offerId) {
        return new Response(
          JSON.stringify({ error: "offerId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const data = await getHotelOfferDetails(offerId);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Hotel Booking ---
    if (req.method === "POST" && action === "hotel-book") {
      const body = await req.json();

      // Validate required fields
      if (!body.offerId || !body.guests || !Array.isArray(body.guests) || body.guests.length === 0) {
        return new Response(
          JSON.stringify({ error: "offerId and guests[] required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!body.payment || !body.payment.method) {
        return new Response(
          JSON.stringify({ error: "payment.method required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await bookHotelOffer({
        offerId: body.offerId,
        guests: body.guests,
        payment: body.payment,
      });

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Transfer actions ---
    if (req.method === "POST" && action === "transfer-search") {
      const body = await req.json();
      if (!body.startLocationCode || !body.startDateTime) {
        return new Response(
          JSON.stringify({ error: "startLocationCode and startDateTime required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const data = await searchTransferOffers(body);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && action === "transfer-book") {
      const body = await req.json();
      if (!body.offerId || !body.passengers || !body.payment) {
        return new Response(
          JSON.stringify({ error: "offerId, passengers[], and payment required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const data = await bookTransferOffer(body);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && action === "transfer-cancel") {
      const body = await req.json();
      if (!body.orderId || !body.confirmNbr) {
        return new Response(
          JSON.stringify({ error: "orderId and confirmNbr required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const data = await cancelTransferOrder(body.orderId, body.confirmNbr);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: search, price, book, hotel-list, hotel-offers, hotel-offer-details, hotel-book, transfer-search, transfer-book, transfer-cancel" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[Amadeus] Function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
