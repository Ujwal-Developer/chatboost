import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:focus-ring",
        variant === "primary" && "bg-white text-black hover:bg-white/90",
        variant === "secondary" && "border border-line bg-white/5 text-white hover:bg-white/10",
        variant === "ghost" && "text-white/78 hover:bg-white/8",
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  href,
  children
}: {
  className?: string;
  variant?: ButtonProps["variant"];
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:focus-ring",
        variant === "primary" && "bg-white text-black hover:bg-white/90",
        variant === "secondary" && "border border-line bg-white/5 text-white hover:bg-white/10",
        variant === "ghost" && "text-white/78 hover:bg-white/8",
        className
      )}
    >
      {children}
    </Link>
  );
}
