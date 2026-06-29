"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Chrome, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultCreatorHandle, defaultCreatorName } from "@/lib/creator";
import { saveCreatorProfile } from "@/lib/client/creator-profile";
import { creatorPlatforms, platformLabels } from "@/lib/creator-verification";

const creatorCopy = {
  title: "Create your creator account",
  body: "Connect your real channel first. ChatBoost verifies creator ownership before the payment link is ready for viewers.",
  destination: "/creator/verification",
  email: "creator@chatboost.local"
};

export function AuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  function completeLogin(
    profile = {
      email: creatorCopy.email,
      displayName: defaultCreatorName,
      handle: defaultCreatorHandle,
      platform: "youtube",
      channelUrl: "https://youtube.com/@nova"
    }
  ) {
    saveCreatorProfile(profile);
    router.push(creatorCopy.destination);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const data = new FormData(event.currentTarget);
    completeLogin({
      email: String(data.get("email") ?? creatorCopy.email),
      displayName: String(data.get("displayName") ?? defaultCreatorName),
      handle: String(data.get("handle") ?? defaultCreatorHandle),
      platform: String(data.get("platform") ?? "youtube"),
      channelUrl: String(data.get("channelUrl") ?? "")
    });
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
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-normal md:text-6xl">{creatorCopy.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/64">{creatorCopy.body}</p>
        </section>

        <form className="surface rounded-lg p-6" action="/creator/verification" method="get" onSubmit={handleSubmit} data-testid="creator-login-form">
          <label className="block text-sm text-white/62" htmlFor="displayName">
            Creator name
          </label>
          <input
            id="displayName"
            name="displayName"
            required
            minLength={2}
            maxLength={40}
            defaultValue={defaultCreatorName}
            className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
          />

          <label className="mt-4 block text-sm text-white/62" htmlFor="handle">
            Share link handle
          </label>
          <div className="mt-2 flex overflow-hidden rounded-lg border border-line bg-black/35 focus-within:focus-ring">
            <span className="grid h-12 place-items-center border-r border-line px-3 text-white/42">@</span>
            <input
              id="handle"
              name="handle"
              required
              minLength={2}
              maxLength={30}
              pattern="[A-Za-z0-9-]+"
              defaultValue={defaultCreatorHandle}
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none"
            />
          </div>

          <label className="mt-4 block text-sm text-white/62" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={creatorCopy.email}
            className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
          />

          <label className="mt-4 block text-sm text-white/62" htmlFor="platform">
            Main creator platform
          </label>
          <select
            id="platform"
            name="platform"
            defaultValue="youtube"
            className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
          >
            {creatorPlatforms.map((platform) => (
              <option key={platform} value={platform} className="bg-black">
                {platformLabels[platform]}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm text-white/62" htmlFor="channelUrl">
            Channel or profile URL
          </label>
          <input
            id="channelUrl"
            name="channelUrl"
            type="url"
            required
            defaultValue="https://youtube.com/@nova"
            className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
          />

          <Button className="mt-6 w-full" type="submit" disabled={status === "saving"}>
            <Mail size={17} />
            {status === "saving" ? "Creating account" : "Create account"}
            <ArrowRight size={17} />
          </Button>

          <Button className="mt-3 w-full" type="button" variant="secondary" onClick={() => completeLogin()}>
            <Chrome size={17} />
            Continue with Google
          </Button>

          <p className="mt-5 text-sm leading-6 text-white/45">
            The next screen verifies that you control the channel before ChatBoost marks your payment link as ready.
          </p>
        </form>
      </div>
    </main>
  );
}
