import SimplePage from "@/components/SimplePage";
import BusinessCard from "@/components/BusinessCard";
import { useBusinesses } from "@/hooks/useBusinesses";

const Restaurants = () => {
  const { businesses, loading } = useBusinesses();
  const list = businesses.filter((b) => b.categorySlug === "restaurants" || b.categorySlug === "home-food");

  return (
    <SimplePage
      eyebrow="مطاعم"
      title="مطاعم بيوكرى"
      description="اكتشف أفضل أماكن الأكل في بيوكرى من المأكولات التقليدية إلى الوجبات السريعة."
    >
      {loading ? (
        <p className="text-center text-muted-foreground">جارٍ التحميل...</p>
      ) : list.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد مطاعم مسجلة بعد.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => <BusinessCard key={b.id} b={b} />)}
        </div>
      )}
    </SimplePage>
  );
};

export default Restaurants;
