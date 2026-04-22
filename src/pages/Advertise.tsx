import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SimplePage from "@/components/SimplePage";
import { Button } from "@/components/ui/button";

const features = [
  "ظهور محلك في دليل بيوكرى",
  "صفحة خاصة مع صور ومعلومات تواصل",
  "روابط اتصال مباشرة وواتساب",
  "تحسين الظهور في نتائج البحث المحلية",
  "دعم وتحديث المعلومات",
];

const Advertise = () => (
  <SimplePage
    eyebrow="أعلن معنا"
    title="عرّف بمحلك لسكان بيوكرى"
    description="انضم إلى دليل بيوكرى أونلاين وزِد من ظهورك المحلي بطريقة بسيطة وفعالة."
  >
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <div className="card-soft p-6">
        <Sparkles className="h-8 w-8 text-primary" />
        <h2 className="font-display text-2xl font-extrabold mt-3">باقة بداية</h2>
        <p className="text-muted-foreground mt-1">إدراج محلك مع صورة ومعلومات تواصل كاملة.</p>
        <ul className="mt-5 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-success mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-6 bg-gradient-warm w-full">
          <Link to="/contact">طلب الإدراج</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="card-soft p-6 bg-gradient-soft">
          <h3 className="font-display text-lg font-bold">لماذا بيوكرى أونلاين؟</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            منصة محلية موجهة لسكان بيوكرى، نوفر لمحلك ظهورًا مميزًا لدى جمهور مهتم فعلًا
            بالخدمات في المدينة.
          </p>
        </div>
        <div className="card-soft p-6">
          <h3 className="font-display text-lg font-bold">طريقة العمل</h3>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal pr-5">
            <li>راسلنا عبر نموذج الاتصال أو واتساب.</li>
            <li>نناقش معك معلومات المحل ونلتقط الصور إن لزم.</li>
            <li>ننشر صفحتك ضمن الدليل في أقل من 48 ساعة.</li>
          </ol>
        </div>
      </div>
    </div>
  </SimplePage>
);

export default Advertise;
