import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Star, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Business } from "@/data/biougra";

const BusinessCard = ({ b }: { b: Business }) => {
  return (
    <article className="card-soft overflow-hidden flex flex-col group">
      <Link to={`/business/${b.id}`} className="block aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={b.image}
          alt={b.name}
          loading="lazy"
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="chip">{b.category}</span>
          {b.rating && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {b.rating}
            </span>
          )}
        </div>
        <Link to={`/business/${b.id}`} className="block">
          <h3 className="font-display text-base font-bold leading-snug hover:text-primary transition-colors">
            {b.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{b.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {b.area}
          </span>
          {b.hours && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {b.hours}
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          {b.mapUrl ? (
            <Button asChild size="sm" variant="secondary" className="flex-1">
              <a href={b.mapUrl} target="_blank" rel="noreferrer">
                <Navigation className="h-4 w-4 ml-1" /> الاتجاهات
              </a>
            </Button>
          ) : (
            <Button asChild size="sm" variant="secondary" className="flex-1">
              <a href={`tel:${b.phone}`}>
                <Phone className="h-4 w-4 ml-1" /> اتصال
              </a>
            </Button>
          )}
          {b.whatsapp && (
            <Button
              asChild
              size="sm"
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            >
              <a
                href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}${b.whatsappText ? `?text=${encodeURIComponent(b.whatsappText)}` : ""}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4 ml-1" /> واتساب
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BusinessCard;
