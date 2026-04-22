import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
};

const SectionHeader = ({ eyebrow, title, description, linkTo, linkLabel }: Props) => {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold">{title}</h2>
        {description && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
        >
          {linkLabel ?? "عرض الكل"}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
