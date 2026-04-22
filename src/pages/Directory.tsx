import { useMemo, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/biougra";
import { useBusinesses } from "@/hooks/useBusinesses";
import { cn } from "@/lib/utils";

const Directory = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const defaultCat = location.pathname === "/support-centers" ? "support" : "all";
  const cat = params.get("cat") ?? defaultCat;
  const [q, setQ] = useState("");
  const { businesses, loading } = useBusinesses();

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchCat = cat === "all" || b.categorySlug === cat;
      const matchQ = !q || b.name.includes(q) || b.description.includes(q);
      return matchCat && matchQ;
    });
  }, [cat, q, businesses]);

  const setCat = (slug: string) => {
    if (slug === "all") setParams({});
    else setParams({ cat: slug });
  };

  return (
    <Layout>
      <section className="bg-gradient-soft border-b border-border/60">
        <div className="container-page py-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">دليل خدمات بيوكرى</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            ابحث عن خدمة أو محل في بيوكرى. صفّ النتائج حسب الفئة لتجد ما تحتاجه بسرعة.
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن اسم محل أو خدمة..."
              className="h-12 pr-10 bg-background"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
          <button
            onClick={() => setCat("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap snap-start transition-colors",
              cat === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            كل الفئات
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap snap-start transition-colors",
                cat === c.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <c.icon className="h-4 w-4" />
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-center text-muted-foreground">جارٍ التحميل...</p>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            لا توجد نتائج. جرّب فئة أخرى أو غيّر كلمة البحث.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BusinessCard key={b.id} b={b} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Directory;
