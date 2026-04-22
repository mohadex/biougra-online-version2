import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudFog, CloudLightning, Wind, LucideIcon, Loader2 } from "lucide-react";
import SimplePage from "@/components/SimplePage";

// Biougra coordinates
const LAT = 30.2167;
const LON = -9.3667;

type DayForecast = {
  day: string;
  icon: LucideIcon;
  tMax: string;
  tMin: string;
  c: string;
};

type CurrentWeather = {
  temp: string;
  desc: string;
  humidity: string;
  icon: LucideIcon;
};

// WMO weather codes mapping → Arabic + icon
const wmoMap = (code: number): { desc: string; icon: LucideIcon } => {
  if (code === 0) return { desc: "مشمس", icon: Sun };
  if ([1, 2].includes(code)) return { desc: "غائم جزئيًا", icon: Cloud };
  if (code === 3) return { desc: "غائم", icon: Cloud };
  if ([45, 48].includes(code)) return { desc: "ضباب", icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { desc: "رذاذ", icon: CloudRain };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { desc: "أمطار", icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { desc: "ثلوج", icon: CloudSnow };
  if ([95, 96, 99].includes(code)) return { desc: "عواصف رعدية", icon: CloudLightning };
  return { desc: "غير محدد", icon: Cloud };
};

const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const Weather = () => {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [week, setWeek] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FCasablanca&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("فشل تحميل بيانات الطقس");
        const data = await res.json();

        const cur = wmoMap(data.current.weather_code);
        setCurrent({
          temp: `${Math.round(data.current.temperature_2m)}°`,
          desc: cur.desc,
          humidity: `${data.current.relative_humidity_2m}%`,
          icon: cur.icon,
        });

        const days: DayForecast[] = data.daily.time.map((iso: string, i: number) => {
          const d = new Date(iso);
          const dayName = i === 0 ? "اليوم" : i === 1 ? "غدًا" : arabicDays[d.getDay()];
          const w = wmoMap(data.daily.weather_code[i]);
          return {
            day: dayName,
            icon: w.icon,
            tMax: `${Math.round(data.daily.temperature_2m_max[i])}°`,
            tMin: `${Math.round(data.daily.temperature_2m_min[i])}°`,
            c: w.desc,
          };
        });
        setWeek(days);
      } catch (e) {
        setError(e instanceof Error ? e.message : "خطأ غير معروف");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <SimplePage eyebrow="الطقس" title="الطقس في بيوكرى" description="تابع حالة الطقس اليوم وتوقعات الأسبوع.">
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin ml-2" /> جاري تحميل بيانات الطقس...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl bg-destructive/10 text-destructive p-4 text-center">{error}</div>
      )}

      {current && !loading && (
        <>
          <div className="rounded-3xl bg-gradient-warm text-primary-foreground p-8 shadow-elevated">
            <p className="text-sm opacity-90">بيوكرى الآن</p>
            <div className="mt-2 flex items-center gap-4">
              <current.icon className="h-16 w-16" />
              <div>
                <p className="text-5xl font-extrabold">{current.temp}</p>
                <p className="opacity-90">{current.desc} · رطوبة {current.humidity}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-8">
            {week.map(({ day, icon: Icon, tMax, tMin, c }) => (
              <div key={day} className="card-soft p-4 text-center">
                <p className="text-sm font-bold">{day}</p>
                <Icon className="h-8 w-8 mx-auto my-2 text-primary" />
                <p className="font-display font-extrabold">{tMax}</p>
                <p className="text-xs text-muted-foreground">{tMin}</p>
                <p className="text-xs text-muted-foreground mt-1">{c}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            بيانات حية من Open-Meteo · تحديث تلقائي
          </p>
        </>
      )}
    </SimplePage>
  );
};

export default Weather;
