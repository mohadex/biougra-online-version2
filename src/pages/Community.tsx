import { useEffect, useState } from "react";
import SimplePage from "@/components/SimplePage";
import { supabase } from "@/integrations/supabase/client";

type Story = { id: string; title: string; excerpt: string; tag: string | null; image: string | null };

const Community = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("community_stories")
      .select("id,title,excerpt,tag,image")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setStories((data ?? []) as Story[]);
        setLoading(false);
      });
  }, []);

  return (
    <SimplePage
      eyebrow="مجتمع بيوكرى"
      title="قصص ومبادرات من بيوكرى"
      description="نسلّط الضوء على المواهب، المبادرات، والمشاريع الصغيرة التي تصنع فرقًا في حياة سكان بيوكرى."
    >
      {loading ? (
        <p className="text-center text-muted-foreground">جارٍ التحميل...</p>
      ) : stories.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد قصص منشورة بعد.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <article key={s.id} className="card-soft overflow-hidden">
              {s.image && (
                <div className="aspect-[16/9] bg-muted overflow-hidden">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-6">
                {s.tag && <span className="chip">{s.tag}</span>}
                <h3 className="font-display text-lg font-bold mt-3">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </SimplePage>
  );
};

export default Community;
