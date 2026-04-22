import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

const SimplePage = ({ eyebrow, title, description, children }: Props) => {
  return (
    <Layout>
      <section className="bg-gradient-soft border-b border-border/60">
        <div className="container-page py-10">
          {eyebrow && <span className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</span>}
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold">{title}</h1>
          {description && <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>}
        </div>
      </section>
      <section className="container-page py-10">{children}</section>
    </Layout>
  );
};

export default SimplePage;
export { SectionHeader };
