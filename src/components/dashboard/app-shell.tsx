import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, BadgeDollarSign, Bell, LayoutDashboard, Settings, Shield } from "lucide-react";

const nav = [
  { href: "/dashboard/creator", label: "Creator", icon: LayoutDashboard },
  { href: "/overlay/demo-creator", label: "Overlay", icon: Activity },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/@nova", label: "Public page", icon: BadgeDollarSign }
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-black/70 p-4 lg:block">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-black">CB</span>
          ChatBoost
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/66 hover:bg-white/8 hover:text-white">
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-ink/95 px-5">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Link href="/notifications" className="grid size-10 place-items-center rounded-lg border border-line bg-white/6 text-white/70 hover:bg-white/10" aria-label="Notifications">
              <Bell size={18} />
            </Link>
            <Link href="/settings" className="grid size-10 place-items-center rounded-lg border border-line bg-white/6 text-white/70 hover:bg-white/10" aria-label="Settings">
              <Settings size={18} />
            </Link>
          </div>
        </header>
        <div className="p-5 md:p-8">{children}</div>
      </section>
    </main>
  );
}
