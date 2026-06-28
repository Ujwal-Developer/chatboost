"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Chrome, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthRole = "creator" | "viewer";

const roleCopy = {
  creator: {
    title: "Creator login",
    body: "Access revenue, overlay settings, payout accounting, moderation, and analytics.",
    destination: "/dashboard/creator",
    email: "creator@chatboost.local"
  },
  viewer: {
    title: "Viewer login",
    body: "Track boosts, receipts, favorite creators, memberships, badges, and refund requests.",
    destination: "/dashboard/viewer",
    email: "viewer@chatboost.local"
  }
};

export function AuthPage({ role }: { role: AuthRole }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const copy = roleCopy[role];

  function completeLogin(email: string) {
    window.localStorage.setItem(
      "chatboost.session",
      JSON.stringify({
        role,
        email,
        signedInAt: new Date().toISOString()
      })
    );
    router.push(copy.destination);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const data = new FormData(event.currentTarget);
    completeLogin(String(data.get("email") ?? copy.email));
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-white text-black">CB</span>
            ChatBoost
          </Link>
          <p className="mt-12 text-sm font-medium uppercase tracking-[0.18em] text-ember">Secure access</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-normal md:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/64">{copy.body}</p>
        </section>

        <form className="surface rounded-lg p-6" onSubmit={handleSubmit} data-testid={`${role}-login-form`}>
          <label className="block text-sm text-white/62" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={copy.email}
            className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
          />

          <label className="mt-4 block text-sm text-white/62" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            defaultValue="chatboost-demo"
            className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
          />

          <Button className="mt-6 w-full" type="submit" disabled={status === "saving"}>
            <Mail size={17} />
            {status === "saving" ? "Signing in" : "Sign in"}
            <ArrowRight size={17} />
          </Button>

          <Button className="mt-3 w-full" type="button" variant="secondary" onClick={() => completeLogin(copy.email)}>
            <Chrome size={17} />
            Continue with Google
          </Button>

          <p className="mt-5 text-sm leading-6 text-white/45">
            Demo auth stores a local session in this browser and routes to the correct dashboard. Production can swap this for Clerk or Auth.js without changing the routes.
          </p>
        </form>
      </div>
    </main>
  );
}
