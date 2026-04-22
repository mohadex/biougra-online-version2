import { useEffect, useState } from "react";
import SimplePage from "@/components/SimplePage";
import { supabase } from "@/integrations/supabase/client";

type PriceRow = {
  id: string;
  product_name: string;
  category: string | null;
  price: number;
  unit: string;
  recorded_at: string;
};

const Souq = () => {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("market_prices")
      .select("*")
      .order("category", { ascending: true })
      .order("product_name", { ascending: true })
      .then(({ data }) => {
        setRows((data ?? []) as PriceRow[]);
        setLoading(false);
      });
  }, []);

  const grouped = rows.reduce<Record<string, PriceRow[]>>((acc, r) => {
    const key = r.category ?? "أخرى";
    (acc[key] ??= []).push(r);
    return acc;
  }, {});

  return (
    <SimplePage
      eyebrow="سوق بيوكرى"
      title="أسعار سوق بيوكرى"
      description="آخر تحديث لأسعار المواد الأساسية في السوق الأسبوعي ببيوكرى."
    >
      {loading ? (
        <p className="text-center text-muted-foreground">جارٍ التحميل...</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد أسعار مسجلة بعد.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="card-soft p-5">
              <h3 className="font-display font-bold text-lg mb-4">{cat}</h3>
              <ul className="divide-y divide-border/60">
                {items.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-foreground/80">{r.product_name}</span>
                    <span className="font-bold">{Number(r.price)} درهم/{r.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground text-center">
        الأسعار تقديرية وقد تختلف من بائع لآخر، تُحدّث بشكل دوري.
      </p>
    </SimplePage>
  );
};

export default Souq;
