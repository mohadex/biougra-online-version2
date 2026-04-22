import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/data/biougra";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800&auto=format&fit=crop";

export const dbRowToBusiness = (r: any): Business => ({
  id: r.id,
  name: r.name,
  category: r.category,
  categorySlug: r.category_slug,
  area: r.area,
  description: r.description ?? "",
  phone: r.phone ?? "",
  whatsapp: r.whatsapp ?? undefined,
  whatsappText: r.whatsapp_text ?? undefined,
  mapUrl: r.map_url ?? undefined,
  image: r.image && r.image.length > 0 ? r.image : FALLBACK_IMAGE,
  rating: r.rating ? Number(r.rating) : undefined,
  hours: r.hours ?? undefined,
  featured: !!r.featured,
});

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("businesses")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setBusinesses((data ?? []).map(dbRowToBusiness));
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { businesses, loading };
};
