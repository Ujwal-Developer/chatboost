import Link from "next/link";
import { BarChart3, LogIn, RadioTower, ShieldCheck, WalletCards } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-black/85 px-5 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-black">CB</span>
          ChatBoost
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <a className="rounded-lg px-3 py-2 text-sm text-white/68 hover:bg-white/8 hover:text-white" href="#features">
            Features
          </a>
          <a className="rounded-lg px-3 py-2 text-sm text-white/68 hover:bg-white/8 hover:text-white" href="#pricing">
            Pricing
          </a>
          <Link className="rounded-lg px-3 py-2 text-sm text-white/68 hover:bg-white/8 hover:text-white" href="/dashboard/creator">
            Creator
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-white/68 hover:bg-white/8 hover:text-white" href="/admin">
            Admin
          </Link>
          <Link className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/16" href="/login/creator">
            Creator account
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/@nova" variant="secondary" className="hidden h-10 sm:inline-flex">
            <WalletCards size={16} />
            Test boost
          </ButtonLink>
          <ButtonLink href="/login/creator" className="h-10">
            <LogIn size={16} />
            Creator login
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}

export const featureIcons = [RadioTower, WalletCards, ShieldCheck, BarChart3];
