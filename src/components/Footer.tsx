import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border/60 bg-secondary/40">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold">
              بيوكرى <span className="text-primary">أونلاين</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            منصة محلية رقمية تساعد سكان بيوكرى على الوصول إلى الخدمات، اكتشاف المحلات،
            ومتابعة المعلومات اليومية المفيدة.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold mb-3">روابط مفيدة</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/directory" className="hover:text-primary">دليل الخدمات</Link></li>
            <li><Link to="/pharmacy" className="hover:text-primary">صيدلية الحراسة</Link></li>
            <li><Link to="/prayer-times" className="hover:text-primary">أوقات الصلاة</Link></li>
            <li><Link to="/souq" className="hover:text-primary">سوق بيوكرى</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold mb-3">الفئات</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/restaurants" className="hover:text-primary">مطاعم</Link></li>
            <li><Link to="/directory?cat=cafes" className="hover:text-primary">مقاهي</Link></li>
            <li><Link to="/directory?cat=home-food" className="hover:text-primary">أكل بيتي</Link></li>
            <li><Link to="/directory?cat=car-rental" className="hover:text-primary">كراء السيارات</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold mb-3">تواصل معنا</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@biougra.online</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +212 600 000 000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> بيوكرى، إقليم اشتوكة آيت باها</li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="فيسبوك" className="rounded-full p-2 bg-background border hover:text-primary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="إنستغرام" className="rounded-full p-2 bg-background border hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} بيوكرى أونلاين. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">صُنع بحب لأهل بيوكرى <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
