import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SectionProps {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}

export function Section({ id, icon: Icon, eyebrow, title, description, children, className, aside }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-100">
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
