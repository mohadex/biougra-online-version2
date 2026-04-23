import { Link } from "react-router-dom";
import { Search, ShoppingBasket, Phone, MessageCircle, Plus } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import StoriesBar from "@/components/StoriesBar";
import BusinessCard from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, quickAccess } from "@/data/biougra";
import { useBusinesses } from "@/hooks/useBusinesses";
import heroImg from "@/assets/hero-biougra.jpg";

const Index = () => {
  const [q, setQ] = useState("");
  const { businesses } = useBusinesses();

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="منظر عام لمدينة بيوكرى"
            width={1536}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative container-page py-16 sm:py-24 lg:py-28 text-primary-foreground">
          <div className="max-w-2xl mx-auto text-center animate-fade-up flex flex-col items-center">
            <span className="chip bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25 backdrop-blur">
              منصة محلية لمدينة بيوكرى
            </span>
            <p className="mt-4 font-brand text-3xl sm:text-5xl tracking-wide text-primary-foreground drop-shadow-md font-black">
              بيوكرى أونلاين
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl font-black leading-tight">
              أول منصة رقمية في بيوكرى
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-foreground/90 max-w-xl">
              ابحث عن خدمة، اكتشف محل قريب، تابع أوقات الصلاة، أسعار السوق،
              صيدلية الحراسة، والمزيد من المعلومات اليومية المفيدة.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl w-full"
            >
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث عن خدمة، مطعم، صيدلية..."
                  className="h-12 pr-10 bg-background text-foreground border-0 shadow-card"
                />
              </div>
              <Button size="lg" className="h-12 bg-foreground text-background hover:bg-foreground/90">
                بحث
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {[
                { label: "مطاعم", to: "/directory?cat=restaurants" },
                { label: "صيدليات", to: "/directory?cat=pharmacies" },
                { label: "مقاهي", to: "/directory?cat=cafes" },
                { label: "أكل بيتي", to: "/directory?cat=home-food" },
                { label: "كراء السيارات", to: "/directory?cat=car-rental" },
                { label: "كراء المنازل", to: "/directory?cat=house-rental" },
              ].map((t) => (
                <Link
                  key={t.label}
                  to={t.to}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur border border-primary-foreground/20 transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="container-page mt-8">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold">قصص بيوكرى أونلاين</h2>
      </section>
      <StoriesBar />

      {/* QUICK ACCESS */}
      <section className="container-page mt-6 relative z-10">
        <div className="rounded-3xl bg-card shadow-elevated p-4 sm:p-6 border border-border/60">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickAccess.map((item) => (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className="group flex flex-col items-center justify-center rounded-2xl bg-secondary/50 hover:bg-accent hover:shadow-card p-3 sm:p-4 text-center transition-all"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </span>
                <span className="mt-2 text-xs sm:text-sm font-bold leading-tight">{item.title}</span>
                <span className="hidden sm:block mt-1 text-[11px] text-muted-foreground line-clamp-1">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page mt-14">
        <SectionHeader
          eyebrow="فئات الخدمات"
          title="استكشف بيوكرى حسب الفئة"
          description="كل ما تحتاجه من خدمات يومية مرتبة في فئات واضحة، سهلة التصفح."
          linkTo="/directory"
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/directory?cat=${c.slug}`}
              className="card-soft flex flex-col items-center justify-center gap-2 p-4 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted" aria-hidden>
                <c.icon className="h-6 w-6 text-primary" />
              </span>
              <span className="text-sm font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED BUSINESSES */}
      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="مختارات بيوكرى"
          title="محلات وخدمات موثوقة"
          description="مجموعة مختارة من المحلات والخدمات التي ينصح بها سكان بيوكرى."
          linkTo="/directory"
        />
        {businesses.filter((b) => b.featured).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground mb-4">لا توجد محلات مميزة بعد</p>
            <Button asChild variant="outline">
              <Link to="/advertise">
                <Plus className="h-4 w-4 ml-2" />
                أضف محلك أولاً
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {businesses.filter((b) => b.featured).map((b) => (
              <BusinessCard key={b.id} b={b} />
            ))}
          </div>
        )}
      </section>

      {/* SOUQ TEASER */}
      <section className="container-page mt-16">
        <div className="rounded-3xl bg-gradient-soft border border-border/60 p-6 sm:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="chip">سوق بيوكرى</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-3">
              تابع أسعار السوق بشكل دوري
            </h2>
            <p className="mt-3 text-muted-foreground">
              نوفر لك تحديثًا منتظمًا لأسعار الخضر والفواكه والمواد الأساسية لتساعدك
              في تنظيم مشترياتك الأسبوعية.
            </p>
            <Button asChild className="mt-5 bg-gradient-warm">
              <Link to="/souq">
                <ShoppingBasket className="h-4 w-4 ml-2" /> عرض الأسعار
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-muted/50 border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">سيتم إضافة الأسعار قريباً</p>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container-page mt-16">
        <div className="rounded-3xl border border-border/60 bg-secondary/40 p-6 sm:p-8 text-center">
          <h3 className="font-display text-xl font-bold">منصة للمعلومات والتعريف</h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            بيوكرى أونلاين منصة مستقلة تهدف إلى تسهيل الوصول إلى الخدمات والتعريف بالمحلات
            والمبادرات المحلية. نحن لسنا مزودين مباشرين للخدمات إلا إذا تم الإشارة إلى ذلك بوضوح،
            ونحرص على تحديث المعلومات بشكل دوري لخدمة سكان بيوكرى.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild variant="secondary">
              <Link to="/contact"><Phone className="h-4 w-4 ml-2" /> تواصل معنا</Link>
            </Button>
            <Button asChild className="bg-gradient-warm">
              <Link to="/advertise"><MessageCircle className="h-4 w-4 ml-2" /> أضف محلك</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
