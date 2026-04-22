import { useEffect, useState } from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import SimplePage from "@/components/SimplePage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type PharmacyRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
  map_url: string | null;
  duty_start: string | null;
  duty_end: string | null;
  is_on_duty: boolean;
};

const formatRange = (start: string | null, end: string | null) => {
  if (!start && !end) return "مفتوحة 24 ساعة";
  const fmt = (d: string) => new Date(d).toLocaleDateString("ar-MA", { day: "numeric", month: "long" });
  if (start && end) return `من ${fmt(start)} إلى ${fmt(end)}`;
  return start ? `ابتداءً من ${fmt(start)}` : `حتى ${fmt(end!)}`;
};

const Pharmacy = () => {
  const [rows, setRows] = useState<PharmacyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("pharmacies")
      .select("*")
      .order("is_on_duty", { ascending: false })
      .order("name", { ascending: true })
      .then(({ data }) => {
        setRows((data ?? []) as PharmacyRow[]);
        setLoading(false);
      });
  }, []);

  const onDuty = rows.filter((r) => r.is_on_duty);
  const list = onDuty.length > 0 ? onDuty : rows;

  return (
    <SimplePage
      eyebrow="خدمة 24/7"
      title="صيدلية الحراسة في بيوكرى"
      description="تعرّف على صيدليات الحراسة المفتوحة الليلة في مدينة بيوكرى."
    >
      {loading ? (
        <p className="text-center text-muted-foreground">جارٍ التحميل...</p>
      ) : list.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد صيدليات مسجلة بعد.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {list.map((p) => (
            <div key={p.id} className="card-soft p-6 sm:p-7 bg-gradient-soft">
              {p.is_on_duty && <span className="chip">الحراسة الليلة</span>}
              <h2 className="font-display text-2xl font-extrabold mt-3">{p.name}</h2>

              <div className="mt-4 grid gap-2 text-sm text-foreground/80">
                {p.address && (
                  <p className="inline-flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{p.address}</span>
                  </p>
                )}
                {p.phone && (
                  <p className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> <span dir="ltr">{p.phone}</span>
                  </p>
                )}
                <p className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {formatRange(p.duty_start, p.duty_end)}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.phone && (
                  <Button asChild className="bg-gradient-warm">
                    <a href={`tel:${p.phone}`}><Phone className="h-4 w-4 ml-2" /> اتصال بالصيدلية</a>
                  </Button>
                )}
                {p.map_url && (
                  <Button asChild variant="outline">
                    <a href={p.map_url} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4 ml-2" /> عرض على الخريطة
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-center text-foreground/70">
        يتم تحديث لائحة صيدليات الحراسة أسبوعياً لضمان دقة المعلومات.
      </p>
    </SimplePage>
  );
};

export default Pharmacy;
