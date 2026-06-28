import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("border-t border-line px-5 py-20", className)}>
      <div className="mx-auto max-w-7xl">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ember">{eyebrow}</p> : null}
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-normal text-white md:text-5xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
