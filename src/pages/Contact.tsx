import { Mail, MessageCircle, Phone } from "lucide-react";
import SimplePage from "@/components/SimplePage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => (
  <SimplePage
    eyebrow="تواصل معنا"
    title="نحن هنا لخدمة بيوكرى"
    description="اقتراح، تصحيح معلومة، أو إضافة محلك إلى الدليل؟ راسلنا."
  >
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 card-soft p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("تم استلام رسالتك، سنتواصل معك قريبًا.");
          }}
          className="grid gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">الاسم</label>
              <Input required className="mt-1" placeholder="اسمك الكامل" />
            </div>
            <div>
              <label className="text-sm font-medium">رقم الهاتف</label>
              <Input required className="mt-1" placeholder="06xxxxxxxx" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">الموضوع</label>
            <Input required className="mt-1" placeholder="موضوع الرسالة" />
          </div>
          <div>
            <label className="text-sm font-medium">رسالتك</label>
            <Textarea required rows={5} className="mt-1" placeholder="اكتب رسالتك هنا..." />
          </div>
          <Button type="submit" className="bg-gradient-warm w-full sm:w-auto">إرسال</Button>
        </form>
      </div>

      <aside className="space-y-3">
        <a href="tel:+212600000000" className="card-soft p-5 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><Phone className="h-5 w-5" /></span>
          <div>
            <p className="text-xs text-muted-foreground">اتصال مباشر</p>
            <p className="font-bold" dir="ltr">+212 600 000 000</p>
          </div>
        </a>
        <a href="https://wa.me/212600000000" className="card-soft p-5 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center"><MessageCircle className="h-5 w-5" /></span>
          <div>
            <p className="text-xs text-muted-foreground">واتساب</p>
            <p className="font-bold">راسلنا الآن</p>
          </div>
        </a>
        <a href="mailto:contact@biougra.online" className="card-soft p-5 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><Mail className="h-5 w-5" /></span>
          <div>
            <p className="text-xs text-muted-foreground">بريد إلكتروني</p>
            <p className="font-bold">contact@biougra.online</p>
          </div>
        </a>
      </aside>
    </div>
  </SimplePage>
);

export default Contact;
