import { create } from "zustand";
import type { AmadeusHotelOffer, HotelBookingGuest } from "@/lib/amadeusClient";

export interface CartItem {
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  guests: number;
  // Live booking fields
  offerId?: string;
  currency?: string;
  hotelOffer?: AmadeusHotelOffer;
  isLive?: boolean;
}

export interface HotelBookingState {
  // Selected offer for booking flow
  selectedOffer: AmadeusHotelOffer | null;
  selectedOfferId: string | null;
  searchParams: {
    cityCode: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    rooms: number;
  } | null;
  guestInfo: HotelBookingGuest[];
  bookingConfirmation: {
    confirmationId: string;
    providerConfirmationId?: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: string;
    currency: string;
  } | null;

  setSelectedOffer: (offer: AmadeusHotelOffer, offerId: string) => void;
  setSearchParams: (params: HotelBookingState["searchParams"]) => void;
  setGuestInfo: (guests: HotelBookingGuest[]) => void;
  setBookingConfirmation: (confirmation: HotelBookingState["bookingConfirmation"]) => void;
  clearBookingFlow: () => void;
}

interface HotelCartState extends HotelBookingState {
  items: CartItem[];
  coupon: string;
  discount: number;
  addItem: (item: CartItem) => void;
  removeItem: (roomId: string) => void;
  clearCart: () => void;
  setCoupon: (code: string) => void;
  applyCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useHotelCartStore = create<HotelCartState>((set, get) => ({
  items: [],
  coupon: "",
  discount: 0,

  // Booking flow state
  selectedOffer: null,
  selectedOfferId: null,
  searchParams: null,
  guestInfo: [],
  bookingConfirmation: null,

  addItem: (item) =>
    set((state) => ({
      items: [...state.items.filter((i) => i.roomId !== item.roomId), item],
    })),

  removeItem: (roomId) =>
    set((state) => ({
      items: state.items.filter((i) => i.roomId !== roomId),
    })),

  clearCart: () => set({ items: [], coupon: "", discount: 0 }),

  setCoupon: (code) => set({ coupon: code }),

  applyCoupon: () => {
    const { coupon } = get();
    if (coupon.toUpperCase() === "MASHROK10") {
      set({ discount: 10 });
    } else if (coupon.toUpperCase() === "WELCOME20") {
      set({ discount: 20 });
    } else {
      set({ discount: 0 });
    }
  },

  getSubtotal: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const { discount } = get();
    return subtotal - (subtotal * discount) / 100;
  },

  // Booking flow actions
  setSelectedOffer: (offer, offerId) =>
    set({ selectedOffer: offer, selectedOfferId: offerId }),

  setSearchParams: (params) => set({ searchParams: params }),

  setGuestInfo: (guests) => set({ guestInfo: guests }),

  setBookingConfirmation: (confirmation) =>
    set({ bookingConfirmation: confirmation }),

  clearBookingFlow: () =>
    set({
      selectedOffer: null,
      selectedOfferId: null,
      guestInfo: [],
      bookingConfirmation: null,
    }),
}));
