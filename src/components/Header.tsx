import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/directory", label: "دليل الخدمات" },
  { to: "/restaurants", label: "المطاعم" },
  { to: "/pharmacy", label: "صيدلية الحراسة" },
  { to: "/prayer-times", label: "أوقات الصلاة" },
  { to: "/souq", label: "سوق بيوكرى" },
  { to: "/community", label: "مبادرات" },
  { to: "/contact", label: "تواصل معنا" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center group">
          <span className="font-display text-lg font-black leading-tight">
            بيوكرى أونلاين
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-warm hover:opacity-95">
            <Link to="/advertise">أعلن معنا</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <Button asChild className="mt-4 bg-gradient-warm">
                  <Link to="/advertise" onClick={() => setOpen(false)}>أعلن معنا</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
