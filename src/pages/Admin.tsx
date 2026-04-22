import { useEffect, useState } from "react";
import { LogOut, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import Layout from "@/components/Layout";
import AdminGuard from "@/components/AdminGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/data/biougra";
import { toast } from "@/hooks/use-toast";

type AnyRow = Record<string, any>;

const useTable = (table: string, orderBy = "created_at") => {
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table as any).select("*").order(orderBy, { ascending: false });
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const remove = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    toast({ title: "تم الحذف" });
    reload();
  };

  return { rows, loading, reload, remove };
};

/* -------- Businesses -------- */
const BusinessesAdmin = () => {
  const { rows, loading, reload, remove } = useTable("businesses");
  const [editing, setEditing] = useState<AnyRow | null>(null);

  const blank = {
    name: "", category: categories[0].name, category_slug: categories[0].slug,
    area: "", description: "", phone: "", whatsapp: "", map_url: "",
    image: "", rating: null, hours: "", featured: false,
  };

  const save = async (row: AnyRow) => {
    const payload = { ...row };
    if (payload.rating === "" || payload.rating === null) payload.rating = null;
    else payload.rating = Number(payload.rating);
    const { error } = row.id
      ? await supabase.from("businesses").update(payload as any).eq("id", row.id)
      : await supabase.from("businesses").insert(payload as any);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    toast({ title: "تم الحفظ" });
    setEditing(null);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-lg">المحلات والخدمات ({rows.length})</h2>
        <Button onClick={() => setEditing(blank)} className="bg-gradient-warm">
          <Plus className="h-4 w-4 ml-1" /> إضافة
        </Button>
      </div>

      {editing && (
        <div className="card-soft p-5 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>الاسم</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>المنطقة</Label><Input value={editing.area} onChange={(e) => setEditing({ ...editing, area: e.target.value })} /></div>
            <div>
              <Label>الفئة</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={editing.category_slug}
                onChange={(e) => {
                  const c = categories.find((x) => x.slug === e.target.value)!;
                  setEditing({ ...editing, category_slug: c.slug, category: c.name });
                }}
              >
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>الهاتف</Label><Input dir="ltr" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
            <div><Label>واتساب</Label><Input dir="ltr" value={editing.whatsapp ?? ""} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} /></div>
            <div><Label>ساعات العمل</Label><Input value={editing.hours ?? ""} onChange={(e) => setEditing({ ...editing, hours: e.target.value })} /></div>
            <div><Label>رابط الصورة</Label><Input dir="ltr" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
            <div><Label>رابط الخريطة</Label><Input dir="ltr" value={editing.map_url ?? ""} onChange={(e) => setEditing({ ...editing, map_url: e.target.value })} /></div>
            <div><Label>التقييم (0-5)</Label><Input type="number" step="0.1" min="0" max="5" value={editing.rating ?? ""} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} /></div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="featured" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <Label htmlFor="featured">مميز (يظهر في الصفحة الرئيسية)</Label>
            </div>
          </div>
          <div><Label>الوصف</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          <div className="flex gap-2">
            <Button onClick={() => save(editing)} className="bg-gradient-warm"><Save className="h-4 w-4 ml-1" /> حفظ</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4 ml-1" /> إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">جارٍ التحميل...</p> : (
        <div className="grid gap-2">
          {rows.map((r) => (
            <div key={r.id} className="card-soft p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold truncate">{r.name} {r.featured && <span className="chip mr-2">مميز</span>}</p>
                <p className="text-xs text-muted-foreground truncate">{r.category} • {r.area}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------- Market prices -------- */
const PricesAdmin = () => {
  const { rows, loading, reload, remove } = useTable("market_prices", "recorded_at");
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const blank = { product_name: "", category: "خضر", price: 0, unit: "كلغ" };

  const save = async (row: AnyRow) => {
    const payload = { ...row, price: Number(row.price), recorded_at: new Date().toISOString() };
    const { error } = row.id
      ? await supabase.from("market_prices").update(payload as any).eq("id", row.id)
      : await supabase.from("market_prices").insert(payload as any);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    toast({ title: "تم الحفظ" });
    setEditing(null);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-lg">أسعار السوق ({rows.length})</h2>
        <Button onClick={() => setEditing(blank)} className="bg-gradient-warm"><Plus className="h-4 w-4 ml-1" /> إضافة</Button>
      </div>

      {editing && (
        <div className="card-soft p-5 grid sm:grid-cols-4 gap-3 items-end">
          <div><Label>المنتوج</Label><Input value={editing.product_name} onChange={(e) => setEditing({ ...editing, product_name: e.target.value })} /></div>
          <div>
            <Label>الفئة</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={editing.category ?? ""}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              <option>خضر</option><option>فواكه</option><option>مواد أساسية</option><option>أخرى</option>
            </select>
          </div>
          <div><Label>السعر</Label><Input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
          <div><Label>الوحدة</Label><Input value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} /></div>
          <div className="sm:col-span-4 flex gap-2">
            <Button onClick={() => save(editing)} className="bg-gradient-warm"><Save className="h-4 w-4 ml-1" /> حفظ</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4 ml-1" /> إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">جارٍ التحميل...</p> : (
        <div className="grid gap-2">
          {rows.map((r) => (
            <div key={r.id} className="card-soft p-3 flex items-center justify-between">
              <div><p className="font-bold">{r.product_name} <span className="text-xs text-muted-foreground">• {r.category}</span></p>
                <p className="text-sm">{r.price} درهم / {r.unit}</p></div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------- Pharmacies -------- */
const PharmaciesAdmin = () => {
  const { rows, loading, reload, remove } = useTable("pharmacies");
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const blank = { name: "", address: "", phone: "", map_url: "", duty_start: "", duty_end: "", is_on_duty: false };

  const save = async (row: AnyRow) => {
    const payload = { ...row };
    if (!payload.duty_start) payload.duty_start = null;
    if (!payload.duty_end) payload.duty_end = null;
    const { error } = row.id
      ? await supabase.from("pharmacies").update(payload as any).eq("id", row.id)
      : await supabase.from("pharmacies").insert(payload as any);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    toast({ title: "تم الحفظ" });
    setEditing(null);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-lg">الصيدليات ({rows.length})</h2>
        <Button onClick={() => setEditing(blank)} className="bg-gradient-warm"><Plus className="h-4 w-4 ml-1" /> إضافة</Button>
      </div>

      {editing && (
        <div className="card-soft p-5 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>اسم الصيدلية</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>الهاتف</Label><Input dir="ltr" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>العنوان</Label><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>رابط الخريطة</Label><Input dir="ltr" value={editing.map_url ?? ""} onChange={(e) => setEditing({ ...editing, map_url: e.target.value })} /></div>
            <div><Label>بداية الحراسة</Label><Input type="date" value={editing.duty_start ?? ""} onChange={(e) => setEditing({ ...editing, duty_start: e.target.value })} /></div>
            <div><Label>نهاية الحراسة</Label><Input type="date" value={editing.duty_end ?? ""} onChange={(e) => setEditing({ ...editing, duty_end: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <input id="onduty" type="checkbox" checked={!!editing.is_on_duty} onChange={(e) => setEditing({ ...editing, is_on_duty: e.target.checked })} />
              <Label htmlFor="onduty">في الحراسة الآن</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save(editing)} className="bg-gradient-warm"><Save className="h-4 w-4 ml-1" /> حفظ</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4 ml-1" /> إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">جارٍ التحميل...</p> : (
        <div className="grid gap-2">
          {rows.map((r) => (
            <div key={r.id} className="card-soft p-3 flex items-center justify-between">
              <div><p className="font-bold">{r.name} {r.is_on_duty && <span className="chip mr-2">حراسة</span>}</p>
                <p className="text-xs text-muted-foreground">{r.address}</p></div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------- Stories -------- */
const StoriesAdmin = () => {
  const { rows, loading, reload, remove } = useTable("community_stories", "published_at");
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const blank = { title: "", excerpt: "", content: "", tag: "", image: "" };

  const save = async (row: AnyRow) => {
    const { error } = row.id
      ? await supabase.from("community_stories").update(row as any).eq("id", row.id)
      : await supabase.from("community_stories").insert(row as any);
    if (error) return toast({ title: "خطأ", description: error.message, variant: "destructive" });
    toast({ title: "تم الحفظ" });
    setEditing(null);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-lg">قصص المجتمع ({rows.length})</h2>
        <Button onClick={() => setEditing(blank)} className="bg-gradient-warm"><Plus className="h-4 w-4 ml-1" /> إضافة</Button>
      </div>

      {editing && (
        <div className="card-soft p-5 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>العنوان</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>الوسم</Label><Input value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>رابط الصورة</Label><Input dir="ltr" value={editing.image ?? ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
          </div>
          <div><Label>المقتطف</Label><Textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
          <div><Label>المحتوى الكامل</Label><Textarea rows={5} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
          <div className="flex gap-2">
            <Button onClick={() => save(editing)} className="bg-gradient-warm"><Save className="h-4 w-4 ml-1" /> حفظ</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4 ml-1" /> إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted-foreground">جارٍ التحميل...</p> : (
        <div className="grid gap-2">
          {rows.map((r) => (
            <div key={r.id} className="card-soft p-3 flex items-center justify-between">
              <div><p className="font-bold">{r.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{r.excerpt}</p></div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const { user, signOut } = useAuth();

  return (
    <AdminGuard>
      <Layout>
        <section className="container-page py-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <span className="chip">لوحة الإدارة</span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">إدارة محتوى الموقع</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 ml-2" /> خروج
            </Button>
          </div>

          <Tabs defaultValue="businesses">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full sm:w-auto">
              <TabsTrigger value="businesses">المحلات</TabsTrigger>
              <TabsTrigger value="prices">الأسعار</TabsTrigger>
              <TabsTrigger value="pharmacies">الصيدليات</TabsTrigger>
              <TabsTrigger value="stories">القصص</TabsTrigger>
            </TabsList>
            <TabsContent value="businesses" className="mt-6"><BusinessesAdmin /></TabsContent>
            <TabsContent value="prices" className="mt-6"><PricesAdmin /></TabsContent>
            <TabsContent value="pharmacies" className="mt-6"><PharmaciesAdmin /></TabsContent>
            <TabsContent value="stories" className="mt-6"><StoriesAdmin /></TabsContent>
          </Tabs>
        </section>
      </Layout>
    </AdminGuard>
  );
};

export default Admin;
