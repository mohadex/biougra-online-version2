import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { dbRowToBusiness } from "@/hooks/useBusinesses";
import type { Business } from "@/data/biougra";

const BusinessDetail = () => {
  const { id } = useParams();
  const [b, setB] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("businesses").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setB(data ? dbRowToBusiness(data) : null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container-page py-20 text-center text-muted-foreground">جارٍ التحميل...</div>
      </Layout>
    );
  }

  if (!b) {
    return (
      <Layout>
        <div className="container-page py-20 text-center">
          <h1 className="font-display text-2xl font-bold">المحل غير موجود</h1>
          <Link to="/directory" className="mt-4 inline-block text-primary font-semibold">
            العودة إلى الدليل
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-page pt-6">
        <Link to="/directory" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowRight className="h-4 w-4" /> العودة إلى الدليل
        </Link>
      </section>

      <section className="container-page mt-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl overflow-hidden bg-muted aspect-[16/9]">
            <img src={b.image} alt={b.name} width={1200} height={675} className="h-full w-full object-cover" />
          </div>

          <div>
            <span className="chip">{b.category}</span>
            <h1 className="font-display text-3xl font-extrabold mt-3">{b.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {b.area}</span>
              {b.hours && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {b.hours}</span>}
              {b.rating && (
                <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                  <Star className="h-4 w-4 fill-primary" /> {b.rating}
                </span>
              )}
            </div>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">{b.description}</p>
          </div>

          <div className="card-soft p-5">
            <h2 className="font-display font-bold mb-3">عن المحل</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              يقدم {b.name} خدمات موثوقة لسكان بيوكرى مع الحرص على جودة الخدمة وراحة الزبون.
              يمكنك التواصل مباشرة عبر الهاتف أو واتساب، أو زيارة المحل في {b.area}.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card-soft p-5">
            <h3 className="font-display font-bold">تواصل مباشر</h3>
            <div className="mt-4 grid gap-2">
              {b.phone && (
                <Button asChild className="bg-gradient-warm">
                  <a href={`tel:${b.phone}`}><Phone className="h-4 w-4 ml-2" /> اتصل الآن</a>
                </Button>
              )}
              {b.whatsapp && (
                <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
                  <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4 ml-2" /> راسل واتساب
                  </a>
                </Button>
              )}
              {b.mapUrl && (
                <Button asChild variant="secondary">
                  <a href={b.mapUrl} target="_blank" rel="noreferrer">
                    <MapPin className="h-4 w-4 ml-2" /> الموقع على الخريطة
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="card-soft p-5">
            <h3 className="font-display font-bold">معلومات</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-muted-foreground">الفئة</span><span className="font-medium">{b.category}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">المنطقة</span><span className="font-medium">{b.area}</span></li>
              {b.hours && <li className="flex justify-between"><span className="text-muted-foreground">ساعات العمل</span><span className="font-medium">{b.hours}</span></li>}
              {b.phone && <li className="flex justify-between"><span className="text-muted-foreground">الهاتف</span><span className="font-medium" dir="ltr">{b.phone}</span></li>}
            </ul>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default BusinessDetail;
