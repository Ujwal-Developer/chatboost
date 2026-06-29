import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/12 bg-black shadow-panel", className)}>
      <Image src="/images/chatboost-logo.png" alt="" width={80} height={80} className="h-full w-full scale-125 object-cover" />
    </span>
  );
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-sm font-semibold text-white", className)}>
      <BrandMark />
      <span>ChatBoost</span>
    </Link>
  );
}
