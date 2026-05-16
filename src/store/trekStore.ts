'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItineraryItem {
  time: string;
  activity: string;
}

export interface ItineraryDay {
  day: string;
  title: string;
  items: ItineraryItem[];
}

export interface Trek {
  id: string;
  name: string;
  tagline: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  price: number;
  seats: number;
  maxSeats: number;
  date: string;
  dateRange: string;
  duration: string;
  altitude: string;
  distance: string;
  image: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  inclusions: { icon: string; label: string; detail: string }[];
  region: string;
  tags: string[];
}

export interface Booking {
  id: string;
  trekId: string;
  trekName: string;
  name: string;
  email: string;
  phone: string;
  emergency: string;
  slots: number;
  amount: number;
  date: string;
  bookedAt: string;
  paymentRef?: string;
}

interface TrekStore {
  treks: Trek[];
  selectedTrekId: string | null;
  bookings: Booking[];
  managerMode: boolean;
  managerAuthenticated: boolean;

  // User actions
  selectTrek: (id: string | null) => void;
  bookSeat: (
    trekId: string,
    details: Omit<Booking, 'id' | 'trekId' | 'trekName' | 'amount' | 'date' | 'bookedAt'>
  ) => { success: boolean; message: string; bookingId?: string; totalAmount?: number; pricePerSlot?: number };

  // Manager Mode actions
  toggleManagerMode: () => void;
  authenticateManager: (pin: string) => boolean;
  lockManager: () => void;
  updateTrekField: (trekId: string, field: keyof Trek, value: Trek[keyof Trek]) => void;
  addSeats: (trekId: string, count: number) => void;
  resetTrekToDefault: (trekId: string) => void;

  // Helpers
  getTrekById: (id: string) => Trek | undefined;
  getSelectedTrek: () => Trek | undefined;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const INITIAL_TREKS: Trek[] = [
  {
    id: 'harishchandragad',
    name: 'Harishchandragad',
    tagline: 'Conquer the legendary Konkan Kada cliff',
    description:
      'Experience the legendary Konkan Kada, ancient temples, and rugged terrain. A quintessential Sahyadri adventure that tests your endurance and rewards you with breathtaking panoramas. The fort dates to the 6th century during the Kalachuri dynasty.',
    difficulty: 'Hard',
    price: 1499,
    seats: 18,
    maxSeats: 25,
    date: 'Nov 18, 2025',
    dateRange: 'Nov 18 – Nov 19, 2025',
    duration: '2 Days / 1 Night',
    altitude: '1,429 m',
    distance: '14 km',
    image: '/images/harishchandragad.png',
    gallery: [
      '/images/harishchandragad.png',
    ],
    region: 'Ahmednagar, Maharashtra',
    tags: ['Fort', 'Overnight', 'Cliff'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Base Camp & Ascent',
        items: [
          { time: '05:00 AM', activity: 'Departure from Pune pickup point in private vehicle.' },
          { time: '09:00 AM', activity: 'Reach base village, breakfast, and brief introduction.' },
          { time: '10:00 AM', activity: 'Commence the trek via Pachnai route.' },
          { time: '01:00 PM', activity: 'Reach Harishchandreshwar temple, set up camp, lunch.' },
          { time: '04:30 PM', activity: 'Walk to Konkan Kada for mesmerizing sunset view.' },
        ],
      },
      {
        day: 'Day 2',
        title: 'Taramati Peak & Return',
        items: [
          { time: '05:30 AM', activity: 'Wake up. Trek to Taramati peak (2nd highest in Maharashtra) for sunrise.' },
          { time: '08:30 AM', activity: 'Descend to camp, breakfast, and explore caves & temple.' },
          { time: '11:00 AM', activity: 'Start descent to base village.' },
          { time: '02:00 PM', activity: 'Reach base, lunch, and depart for city.' },
        ],
      },
    ],
    inclusions: [
      { icon: '🚐', label: 'Transport', detail: 'Pune/Mumbai to base village and back in private vehicle.' },
      { icon: '🍱', label: 'Meals', detail: '2 Breakfasts, 2 Lunches, 1 Dinner (vegetarian local food).' },
      { icon: '🧗', label: 'Expert Guide', detail: 'Certified trek leaders with extensive local knowledge.' },
      { icon: '🩺', label: 'First Aid', detail: 'Comprehensive first aid kit carried by leaders.' },
    ],
  },
  {
    id: 'torna',
    name: 'Torna Fort',
    tagline: "Shivaji Maharaj's first conquered fort",
    description:
      'Torna, also known as Prachandagad, was the first fort captured by Chhatrapati Shivaji Maharaj at age 16, marking the dawn of the Maratha Empire. The highest fort in the Pune district offers panoramic views of the Sahyadri ranges.',
    difficulty: 'Moderate',
    price: 1199,
    seats: 28,
    maxSeats: 30,
    date: 'Dec 06, 2025',
    dateRange: 'Dec 06 – Dec 07, 2025',
    duration: '2 Days / 1 Night',
    altitude: '1,403 m',
    distance: '10 km',
    image: '/images/torna.png',
    gallery: [
      '/images/torna.png',
    ],
    region: 'Pune, Maharashtra',
    tags: ['Fort', 'Historical', 'Overnight'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Velhe Village & Ascent',
        items: [
          { time: '05:30 AM', activity: 'Departure from Pune.' },
          { time: '08:00 AM', activity: 'Reach Velhe base village, breakfast.' },
          { time: '09:30 AM', activity: 'Begin ascent via forest trail.' },
          { time: '01:30 PM', activity: 'Reach Torna top, explore Mengai Devi temple, lunch.' },
          { time: '04:00 PM', activity: 'Set up camp, explore ramparts and canons.' },
        ],
      },
      {
        day: 'Day 2',
        title: 'Sunrise & Descent',
        items: [
          { time: '06:00 AM', activity: 'Sunrise from Budhla Machi viewpoint.' },
          { time: '08:00 AM', activity: 'Breakfast at camp.' },
          { time: '09:30 AM', activity: 'Begin descent to Velhe.' },
          { time: '01:00 PM', activity: 'Reach base, lunch, depart for Pune.' },
        ],
      },
    ],
    inclusions: [
      { icon: '🚐', label: 'Transport', detail: 'Pune to Velhe and back.' },
      { icon: '🍱', label: 'Meals', detail: '2 Breakfasts, 1 Lunch, 1 Dinner.' },
      { icon: '🧗', label: 'Expert Guide', detail: 'Certified trek leaders.' },
      { icon: '🏕️', label: 'Camping', detail: 'Tents and sleeping bags provided.' },
    ],
  },
  {
    id: 'rajgad',
    name: 'Rajgad Fort',
    tagline: "The king of all forts — Shivaji's capital",
    description:
      'Rajgad served as the capital of the Maratha Empire for 26 years. With four massive Machis (plateaus), intricate water conservation systems, and stunning vistas, it remains one of the most complete and majestic forts in Maharashtra.',
    difficulty: 'Moderate',
    price: 1299,
    seats: 15,
    maxSeats: 20,
    date: 'Dec 13, 2025',
    dateRange: 'Dec 13 – Dec 14, 2025',
    duration: '2 Days / 1 Night',
    altitude: '1,376 m',
    distance: '12 km',
    image: '/images/rajgad.png',
    gallery: [
      '/images/rajgad.png',
    ],
    region: 'Pune, Maharashtra',
    tags: ['Fort', 'Historical', 'Capital'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Gunjavane & Ascent',
        items: [
          { time: '05:00 AM', activity: 'Depart from Pune.' },
          { time: '07:30 AM', activity: 'Reach Gunjavane base, breakfast.' },
          { time: '09:00 AM', activity: 'Begin ascent via Pali Darwaja.' },
          { time: '12:30 PM', activity: 'Reach Rajgad plateau, explore Padmavati Machi, lunch.' },
          { time: '04:00 PM', activity: 'Visit Sanjivani Machi and fortification walls.' },
        ],
      },
      {
        day: 'Day 2',
        title: 'Balekilla & Return',
        items: [
          { time: '06:00 AM', activity: 'Sunrise at Balekilla inner citadel.' },
          { time: '08:00 AM', activity: 'Breakfast, explore Suvela Machi.' },
          { time: '10:00 AM', activity: 'Descend via Chor Darwaja.' },
          { time: '01:30 PM', activity: 'Reach base, lunch, return to Pune.' },
        ],
      },
    ],
    inclusions: [
      { icon: '🚐', label: 'Transport', detail: 'Pune to Gunjavane and back.' },
      { icon: '🍱', label: 'Meals', detail: '2 Breakfasts, 2 Lunches, 1 Dinner.' },
      { icon: '🧗', label: 'Expert Guide', detail: 'Fort historian guide included.' },
      { icon: '🏕️', label: 'Camping', detail: 'Camping on the plateau.' },
    ],
  },
  {
    id: 'rajmachi',
    name: 'Rajmachi Fort',
    tagline: 'Twin forts above the misty Sahyadri valleys',
    description:
      'Rajmachi comprises twin forts — Shrivardhan and Manaranjan — perched above the Bor Ghat valley. A favourite for its relatively gentle terrain, lush monsoon greenery, and dramatic views of the Ulhas river valley.',
    difficulty: 'Easy',
    price: 999,
    seats: 33,
    maxSeats: 35,
    date: 'Nov 29, 2025',
    dateRange: 'Nov 29 – Nov 30, 2025',
    duration: '2 Days / 1 Night',
    altitude: '956 m',
    distance: '8 km',
    image: '/images/rajmachi.jpg',
    gallery: [
      '/images/rajmachi.jpg',
    ],
    region: 'Pune, Maharashtra',
    tags: ['Fort', 'Beginner-Friendly', 'Twin Forts'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Lonavala Base & Trek',
        items: [
          { time: '06:00 AM', activity: 'Depart from Pune.' },
          { time: '08:00 AM', activity: 'Reach Udhewadi base village.' },
          { time: '09:30 AM', activity: 'Begin easy ascent through farmland.' },
          { time: '12:00 PM', activity: 'Reach the fort, explore, lunch.' },
          { time: '04:00 PM', activity: 'Sunset view from Manaranjan fort.' },
        ],
      },
      {
        day: 'Day 2',
        title: 'Twin Fort Exploration & Return',
        items: [
          { time: '06:30 AM', activity: 'Sunrise hike to Shrivardhan.' },
          { time: '08:30 AM', activity: 'Breakfast.' },
          { time: '10:00 AM', activity: 'Descend to Lonavala.' },
          { time: '01:00 PM', activity: 'Reach base, lunch, return.' },
        ],
      },
    ],
    inclusions: [
      { icon: '🚐', label: 'Transport', detail: 'Pune to Lonavala and back.' },
      { icon: '🍱', label: 'Meals', detail: '2 Breakfasts, 2 Lunches, 1 Dinner.' },
      { icon: '🧗', label: 'Expert Guide', detail: 'Beginner-friendly guide.' },
      { icon: '🏕️', label: 'Camping', detail: 'Overnight camping arranged.' },
    ],
  },
  {
    id: 'kalsubai',
    name: 'Kalsubai Peak',
    tagline: "Summit Maharashtra's highest peak",
    description:
      "Kalsubai is the highest peak in Maharashtra at 1,646 m, earning it the nickname 'Everest of Maharashtra'. The trail involves iron ladders, chains, and steep rocky sections, offering unmatched views of the Sahyadri ranges at the top.",
    difficulty: 'Hard',
    price: 1399,
    seats: 12,
    maxSeats: 20,
    date: 'Dec 20, 2025',
    dateRange: 'Dec 20 – Dec 21, 2025',
    duration: '2 Days / 1 Night',
    altitude: '1,646 m',
    distance: '10 km',
    image: '/images/kalsubai.jpg',
    gallery: [
      '/images/kalsubai.jpg',
    ],
    region: 'Nashik, Maharashtra',
    tags: ['Peak', 'Highest Point', 'Chains & Ladders'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Bari Village & Night Trek',
        items: [
          { time: '10:00 PM', activity: 'Depart from Nashik/Pune.' },
          { time: '02:00 AM', activity: 'Reach Bari base village, rest.' },
          { time: '04:00 AM', activity: 'Begin night trek with headlamps.' },
          { time: '07:00 AM', activity: 'Reach summit, witness breathtaking sunrise.' },
        ],
      },
      {
        day: 'Day 2',
        title: 'Descent & Depart',
        items: [
          { time: '09:00 AM', activity: 'Breakfast at summit area.' },
          { time: '10:30 AM', activity: 'Careful descent via iron chains.' },
          { time: '01:00 PM', activity: 'Reach base, lunch.' },
          { time: '03:00 PM', activity: 'Return journey.' },
        ],
      },
    ],
    inclusions: [
      { icon: '🚐', label: 'Transport', detail: 'Pickup from Nashik/Pune, return.' },
      { icon: '🍱', label: 'Meals', detail: 'Dinner, 1 Breakfast, 1 Lunch.' },
      { icon: '🔦', label: 'Equipment', detail: 'Headlamps for night trek provided.' },
      { icon: '🧗', label: 'Expert Guide', detail: 'Experienced high-altitude guides.' },
    ],
  },
  {
    id: 'lohagad',
    name: 'Lohagad Fort',
    tagline: 'The iron fort above Pawna Lake',
    description:
      "Lohagad (Iron Fort) stands guard over the Pawna valley with magnificent views of Pawna Lake and Visapur Fort. Its iconic Vinchukata (scorpion-shaped wall) is a must-see. An ideal weekend trek combining history and panoramic Sahyadri beauty.",
    difficulty: 'Easy',
    price: 899,
    seats: 38,
    maxSeats: 40,
    date: 'Nov 22, 2025',
    dateRange: 'Nov 22, 2025',
    duration: '1 Day',
    altitude: '1,033 m',
    distance: '6 km',
    image: '/images/lohagad.jpg',
    gallery: [
      '/images/lohagad.jpg',
    ],
    region: 'Pune, Maharashtra',
    tags: ['Fort', 'Day Trek', 'Family-Friendly'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Full Day Adventure',
        items: [
          { time: '06:00 AM', activity: 'Depart from Pune.' },
          { time: '08:30 AM', activity: 'Reach Lohagad base, breakfast.' },
          { time: '09:30 AM', activity: 'Gentle ascent via well-marked trail.' },
          { time: '11:30 AM', activity: 'Explore Vinchukata and Ganesh Darwaja.' },
          { time: '01:00 PM', activity: 'Lunch at the top with Pawna Lake views.' },
          { time: '03:00 PM', activity: 'Descent and return to Pune.' },
        ],
      },
    ],
    inclusions: [
      { icon: '🚐', label: 'Transport', detail: 'Pune to Lohagad and back.' },
      { icon: '🍱', label: 'Meals', detail: '1 Breakfast, 1 Lunch.' },
      { icon: '🧗', label: 'Expert Guide', detail: 'Family-friendly local guide.' },
      { icon: '📸', label: 'Photography', detail: 'Group photo session at summit.' },
    ],
  },
];

// ─── Store ─────────────────────────────────────────────────────────────────────

const MANAGER_PIN = 'admin123';

export const useTrekStore = create<TrekStore>()(
  persist(
    (set, get) => ({
      treks: INITIAL_TREKS,
      selectedTrekId: null,
      bookings: [],
      managerMode: false,
      managerAuthenticated: false,

      selectTrek: (id) => set({ selectedTrekId: id }),

      bookSeat: (trekId, details) => {
        const trek = get().treks.find((t) => t.id === trekId);
        if (!trek) return { success: false, message: 'Trek not found.' };
        const slots = details.slots ?? 1;
        if (trek.seats <= 0) return { success: false, message: 'No seats available. Trek is sold out.' };
        if (trek.seats < slots) return { success: false, message: `Only ${trek.seats} seat(s) left. Please reduce your slot count.` };

        const bookingId = `WR-${Date.now().toString(36).toUpperCase()}`;
        const totalAmount = trek.price * slots;
        const booking: Booking = {
          id: bookingId,
          trekId,
          trekName: trek.name,
          amount: totalAmount,
          date: trek.dateRange,
          bookedAt: new Date().toISOString(),
          ...details,
          slots,
        };

        set((state) => ({
          treks: state.treks.map((t) =>
            t.id === trekId ? { ...t, seats: t.seats - slots } : t
          ),
          bookings: [...state.bookings, booking],
          selectedTrekId: null, // clear selection after booking
        }));

        return { success: true, message: `Booking confirmed!`, bookingId, totalAmount, pricePerSlot: trek.price };
      },

      toggleManagerMode: () =>
        set((state) => ({
          managerMode: !state.managerMode,
          managerAuthenticated: state.managerMode ? false : state.managerAuthenticated,
        })),

      authenticateManager: (pin) => {
        if (pin === MANAGER_PIN) {
          set({ managerAuthenticated: true });
          return true;
        }
        return false;
      },

      lockManager: () => set({ managerMode: false, managerAuthenticated: false }),

      updateTrekField: (trekId, field, value) =>
        set((state) => ({
          treks: state.treks.map((t) =>
            t.id === trekId ? { ...t, [field]: value } : t
          ),
        })),

      addSeats: (trekId, count) =>
        set((state) => ({
          treks: state.treks.map((t) =>
            t.id === trekId
              ? { ...t, seats: Math.min(t.maxSeats, t.seats + count) }
              : t
          ),
        })),

      resetTrekToDefault: (trekId) => {
        const defaults = INITIAL_TREKS.find((t) => t.id === trekId);
        if (!defaults) return;
        set((state) => ({
          treks: state.treks.map((t) => (t.id === trekId ? { ...defaults } : t)),
        }));
      },

      getTrekById: (id) => get().treks.find((t) => t.id === id),
      getSelectedTrek: () => {
        const id = get().selectedTrekId;
        return id ? get().treks.find((t) => t.id === id) : undefined;
      },
    }),
    {
      name: 'weekend-riders-store',
      storage: createJSONStorage(() => {
        // Safe localStorage access (SSR-safe)
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Only persist bookings — treks always come from INITIAL_TREKS so images stay fresh
      partialize: (state) => ({
        bookings: state.bookings,
      }),
      version: 3,
    }
  )
);
