import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SimplePage from "@/components/SimplePage";
import { Loader2, Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Timings = Record<string, string>;
type Meta = { timezone?: string; method?: { name?: string } };

const PRAYER_LABELS: { key: string; name: string }[] = [
  { key: "Fajr", name: "الفجر" },
  { key: "Sunrise", name: "الشروق" },
  { key: "Dhuhr", name: "الظهر" },
  { key: "Asr", name: "العصر" },
  { key: "Maghrib", name: "المغرب" },
  { key: "Isha", name: "العشاء" },
];

// Prayers eligible for adhan notification (Sunrise excluded)
const NOTIFY_KEYS = new Set(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]);

// Biougra, Chtouka Aït Baha, Morocco
const LAT = 30.215;
const LNG = -9.375;
// Method 21 = Morocco's Ministry of Habous and Islamic Affairs
const METHOD = 21;
const TZ = "Africa/Casablanca";
const STORAGE_KEY = "biougra.prayerNotifications";

const formatHijri = (h: { day: string; month: { ar: string }; year: string }) =>
  `${h.day} ${h.month.ar} ${h.year}`;

const todayLabel = () =>
  new Date().toLocaleDateString("ar-MA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  });

const cleanTime = (raw?: string) => {
  if (!raw) return "--:--";
  const m = raw.match(/^(\d{2}:\d{2})/);
  return m ? m[1] : "--:--";
};

const getTodayInTZ = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { dd: get("day"), mm: get("month"), yyyy: get("year") };
};

// Current Casablanca HH:MM as minutes since midnight
const nowMinutesInTZ = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
};

const toMinutes = (raw?: string) => {
  const t = cleanTime(raw);
  if (t === "--:--") return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const PrayerTimes = () => {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [hijri, setHijri] = useState<string>("");
  const [, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const firedRef = useRef<Set<string>>(new Set());

  // Load saved preference + permission
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("Notification" in window) setPermission(Notification.permission);
    const saved = localStorage.getItem(STORAGE_KEY) === "1";
    setNotifyEnabled(saved && "Notification" in window && Notification.permission === "granted");
  }, []);

  // Fetch prayer times
  useEffect(() => {
    const controller = new AbortController();
    const fetchTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const { dd, mm, yyyy } = getTodayInTZ();
        const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("network");
        const json = await res.json();
        if (json?.code !== 200 || !json?.data) throw new Error("invalid");
        setTimings(json.data.timings);
        setMeta(json.data.meta ?? null);
        if (json.data.date?.hijri) setHijri(formatHijri(json.data.date.hijri));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("تعذّر تحميل المواقيت، يُرجى المحاولة لاحقًا.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimes();
    return () => controller.abort();
  }, []);

  // Notification scheduler — checks every 30s
  useEffect(() => {
    if (!notifyEnabled || !timings) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const { dd, mm, yyyy } = getTodayInTZ();
    const dayKey = `${yyyy}-${mm}-${dd}`;

    const check = () => {
      const now = nowMinutesInTZ();
      PRAYER_LABELS.forEach((p) => {
        if (!NOTIFY_KEYS.has(p.key)) return;
        const t = toMinutes(timings[p.key]);
        if (t === null) return;
        const id = `${dayKey}:${p.key}`;
        // Fire if within current minute and not already fired today
        if (now === t && !firedRef.current.has(id)) {
          firedRef.current.add(id);
          try {
            new Notification("حان الآن وقت صلاة " + p.name, {
              body: `بيوكرى — ${cleanTime(timings[p.key])}`,
              icon: "/favicon.ico",
              tag: id,
            });
          } catch {
            // Some browsers throw if not allowed; ignore
          }
        }
      });
    };

    check();
    const interval = window.setInterval(check, 30_000);
    return () => window.clearInterval(interval);
  }, [notifyEnabled, timings]);

  const toggleNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("متصفحك لا يدعم الإشعارات");
      return;
    }

    if (notifyEnabled) {
      setNotifyEnabled(false);
      localStorage.setItem(STORAGE_KEY, "0");
      toast.success("تم إيقاف إشعارات الصلاة");
      return;
    }

    let perm = Notification.permission;
    if (perm === "default") {
      perm = await Notification.requestPermission();
      setPermission(perm);
    }

    if (perm !== "granted") {
      toast.error("يجب السماح بالإشعارات من إعدادات المتصفح");
      return;
    }

    setNotifyEnabled(true);
    localStorage.setItem(STORAGE_KEY, "1");
    toast.success("تم تفعيل إشعارات الصلاة");
    try {
      new Notification("تم تفعيل إشعارات الصلاة 🕌", {
        body: "ستصلك تنبيهات عند دخول وقت كل صلاة.",
        icon: "/favicon.ico",
      });
    } catch {
      // ignore
    }
  };

  const blocked = permission === "denied";

  return (
    <SimplePage
      eyebrow="مواقيت الصلاة"
      title="أوقات الصلاة في بيوكرى"
      description="مواقيت اليوم بتوقيت بيوكرى، إقليم اشتوكة آيت باها."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{todayLabel()}</span>
        {hijri && <span dir="rtl">{hijri} هـ</span>}
      </div>

      {/* Notifications control */}
      <div className="card-soft mb-6 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              notifyEnabled ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {notifyEnabled ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-semibold">إشعارات أوقات الصلاة</p>
            <p className="text-xs text-muted-foreground">
              {blocked
                ? "الإشعارات محظورة — فعّلها من إعدادات المتصفح."
                : notifyEnabled
                ? "مفعّلة — سيصلك تنبيه عند دخول كل صلاة."
                : "اضغط لتفعيل التنبيهات لكل صلاة (عدا الشروق)."}
            </p>
          </div>
        </div>
        <Button
          onClick={toggleNotifications}
          disabled={blocked}
          variant={notifyEnabled ? "outline" : "default"}
          className={notifyEnabled ? "" : "bg-gradient-warm hover:opacity-95"}
        >
          {notifyEnabled ? (
            <>
              <BellOff className="ml-2 h-4 w-4" />
              إيقاف
            </>
          ) : (
            <>
              <Bell className="ml-2 h-4 w-4" />
              تفعيل
            </>
          )}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="card-soft p-6 text-center text-destructive">{error}</div>
      )}

      {!loading && !error && timings && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRAYER_LABELS.map((p) => (
            <div
              key={p.key}
              className="card-soft p-5 flex items-center justify-between"
            >
              <p className="font-display text-lg font-bold">{p.name}</p>
              <p className="text-2xl font-extrabold text-primary" dir="ltr">
                {cleanTime(timings[p.key])}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          to="/islamic-quiz"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-warm px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
        >
          🕌 اختبر معلوماتك الإسلامية
        </Link>
      </div>
    </SimplePage>
  );
};

export default PrayerTimes;
