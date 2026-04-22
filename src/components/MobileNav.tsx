import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Pill, Clock, Phone } from "lucide-react";

const items = [
  { to: "/", label: "الرئيسية", Icon: Home },
  { to: "/directory", label: "الدليل", Icon: LayoutGrid },
  { to: "/pharmacy", label: "صيدلية", Icon: Pill },
  { to: "/prayer-times", label: "الصلاة", Icon: Clock },
  { to: "/contact", label: "تواصل", Icon: Phone },
];

const MobileNav = () => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur"
      aria-label="التنقل السفلي"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isActive ? "bg-primary/10" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
