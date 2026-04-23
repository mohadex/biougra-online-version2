import { useEffect, useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/hero-biougra.jpg";

type Story = {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
  created_at: string;
};

const STORY_DURATION = 5000; // 5s per image

// Persistent anonymous browser fingerprint (for view-counting)
const getFingerprint = () => {
  let fp = localStorage.getItem("bg_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("bg_fp", fp);
  }
  return fp;
};

const StoriesBar = () => {
  const { isAdmin, user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  const load = async () => {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    setStories((data ?? []) as Story[]);
  };

  // Admin: fetch view counts per story
  const loadViewCounts = async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from("story_views").select("story_id");
    if (!data) return;
    const counts: Record<string, number> = {};
    for (const r of data as { story_id: string }[]) {
      counts[r.story_id] = (counts[r.story_id] ?? 0) + 1;
    }
    setViewCounts(counts);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("stories-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "stories" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "story_views" }, loadViewCounts)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    loadViewCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, stories.length]);

  // Record a view when a story is opened
  const recordView = async (storyId: string) => {
    const payload: { story_id: string; viewer_id?: string; viewer_fingerprint?: string } = {
      story_id: storyId,
    };
    if (user) payload.viewer_id = user.id;
    else payload.viewer_fingerprint = getFingerprint();
    // Ignore duplicate-key errors from unique index
    await supabase.from("story_views").insert(payload as any);
  };

  // Auto-advance for images
  useEffect(() => {
    if (openIdx === null) return;
    const cur = stories[openIdx];
    if (!cur) return;
    recordView(cur.id);
    if (cur.media_type === "video") return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const p = (Date.now() - start) / STORY_DURATION;
      setProgress(Math.min(p, 1));
      if (p >= 1) {
        clearInterval(tick);
        next();
      }
    }, 50);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIdx, stories]);

  const next = () => {
    setOpenIdx((i) => {
      if (i === null) return null;
      if (i + 1 >= stories.length) return null;
      return i + 1;
    });
  };
  const prev = () => {
    setOpenIdx((i) => (i === null || i === 0 ? i : i - 1));
  };

  if (stories.length === 0 && !isAdmin) return null;

  return (
    <>
      <section className="container-page mt-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          {isAdmin && (
            <Link
              to="/admin"
              className="shrink-0 flex flex-col items-center gap-1.5 group"
              aria-label="إضافة قصة"
            >
              <span className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary transition">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">قصتك</span>
            </Link>
          )}

          {stories.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setOpenIdx(idx)}
              className="shrink-0 flex flex-col items-center gap-1.5 group relative"
            >
              <span className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full p-[2.5px] bg-gradient-warm">
                <span className="block h-full w-full rounded-full bg-background p-[2px]">
                  {s.media_type === "image" ? (
                    <img
                      src={s.media_url}
                      alt={s.caption ?? "قصة"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <video
                      src={s.media_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full rounded-full object-cover"
                    />
                  )}
                </span>
                {isAdmin && (
                  <span className="absolute -bottom-1 -left-1 inline-flex items-center gap-0.5 rounded-full bg-foreground/85 text-background text-[10px] font-bold px-1.5 py-0.5 shadow">
                    <Eye className="h-2.5 w-2.5" />
                    {viewCounts[s.id] ?? 0}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium max-w-[80px] truncate">{s.caption || "قصة"}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Viewer */}
      {openIdx !== null && stories[openIdx] && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in">
          {/* Progress bars */}
          <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-[width] duration-75"
                  style={{
                    width: i < openIdx ? "100%" : i === openIdx ? `${progress * 100}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpenIdx(null)}
            className="absolute top-6 right-3 z-20 p-2 text-white/90 hover:text-white"
            aria-label="إغلاق"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="absolute top-8 left-3 right-12 z-10 flex items-center gap-2 text-white">
            <img src={logo} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-bold text-sm">بيوكرى أونلاين</span>
            <span className="text-xs text-white/60">{timeAgo(stories[openIdx].created_at)}</span>
          </div>

          {/* Tap zones */}
          <button onClick={prev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" aria-label="السابق" />
          <button onClick={next} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" aria-label="التالي" />

          {/* Media */}
          <div className="relative max-h-[90vh] max-w-md w-full px-4">
            {stories[openIdx].media_type === "image" ? (
              <img
                src={stories[openIdx].media_url}
                alt={stories[openIdx].caption ?? ""}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : (
              <video
                key={stories[openIdx].id}
                src={stories[openIdx].media_url}
                autoPlay
                playsInline
                controls={false}
                onEnded={next}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setProgress(v.currentTime / v.duration);
                }}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
            {stories[openIdx].caption && (
              <p className="mt-3 text-center text-white text-sm font-medium">{stories[openIdx].caption}</p>
            )}

            {/* Admin-only view count */}
            {isAdmin && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-white/90 text-sm">
                <Eye className="h-4 w-4" />
                <span className="font-bold">{viewCounts[stories[openIdx].id] ?? 0}</span>
                <span className="text-white/60">مشاهدة</span>
              </div>
            )}
          </div>

          {/* Desktop arrows */}
          <button
            onClick={prev}
            disabled={openIdx === 0}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
};

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  return `منذ ${Math.floor(diff / 3600)} س`;
};

export default StoriesBar;
