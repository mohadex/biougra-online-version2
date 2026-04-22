import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  Coffee,
  Pill,
  Stethoscope,
  Handshake,
  GraduationCap,
  Car,
  Scissors,
  Soup,
  ShoppingBag,
  Wrench,
  Trophy,
  Sun,
  Moon,
  ShoppingBasket,
  MapPin,
  Home,
  KeyRound,
} from "lucide-react";

export type Business = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  area: string;
  description: string;
  phone: string;
  whatsapp?: string;
  whatsappText?: string;
  mapUrl?: string;
  image: string;
  rating?: number;
  hours?: string;
  featured?: boolean;
};

export const categories = [
  { slug: "restaurants", name: "مطاعم", icon: UtensilsCrossed },
  { slug: "cafes", name: "مقاهي", icon: Coffee },
  { slug: "pharmacies", name: "صيدليات", icon: Pill },
  { slug: "clinics", name: "عيادات", icon: Stethoscope },
  { slug: "support", name: "مراكز الدعم", icon: Handshake },
  { slug: "schools", name: "مدارس", icon: GraduationCap },
  { slug: "car-rental", name: "كراء السيارات", icon: Car },
  { slug: "house-rental", name: "كراء المنازل", icon: KeyRound },
  { slug: "beauty", name: "خدمات التجميل", icon: Scissors },
  { slug: "home-food", name: "أكل بيتي", icon: Soup },
  { slug: "shopping", name: "تسوق", icon: ShoppingBag },
  { slug: "repairs", name: "إصلاحات", icon: Wrench },
];

export const quickAccess = [
  { slug: "duty-pharmacy", title: "صيدلية الحراسة", desc: "أقرب صيدلية مفتوحة الآن", icon: Pill, color: "bg-rose-50 text-rose-600" },
  { slug: "weather", title: "الطقس في بيوكرى", desc: "حالة الطقس اليوم", icon: Sun, color: "bg-amber-50 text-amber-600" },
  { slug: "prayer-times", title: "أوقات الصلاة", desc: "مواقيت اليوم", icon: Moon, color: "bg-emerald-50 text-emerald-600" },
  { slug: "souq", title: "أسعار سوق بيوكرى", desc: "آخر تحديث للأسعار", icon: ShoppingBasket, color: "bg-orange-50 text-orange-600" },
  { slug: "directory", title: "الخدمات المحلية", desc: "دليل شامل ومحدّث", icon: MapPin, color: "bg-blue-50 text-blue-600" },
  { slug: "support-centers", title: "مراكز الدعم", desc: "دعم مدرسي ولغات", icon: Handshake, color: "bg-violet-50 text-violet-600" },
  { slug: "restaurants", title: "مطاعم وأكل", desc: "أفضل أماكن الأكل", icon: UtensilsCrossed, color: "bg-red-50 text-red-600" },
  { slug: "car-rental", title: "كراء السيارات", desc: "وكالات موثوقة", icon: Car, color: "bg-slate-100 text-slate-700" },
  { slug: "home-food", title: "مشاريع منزلية", desc: "طبخ ومنتوجات محلية", icon: Home, color: "bg-yellow-50 text-yellow-700" },
  { slug: "directory?cat=house-rental", title: "كراء المنازل", desc: "شقق ومنازل للكراء", icon: KeyRound, color: "bg-teal-50 text-teal-700" },
];

export const businesses: Business[] = [];

export const communityStories: { id: string; title: string; excerpt: string; tag: string }[] = [];
