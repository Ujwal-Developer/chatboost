import { LockKeyhole } from "lucide-react";
import { BrandLink } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <BrandLink className="inline-flex text-white/75 hover:text-white" />
        <section className="surface mt-10 rounded-lg p-6">
          <div className="grid size-11 place-items-center rounded-lg border border-line bg-white/6 text-ember">
            <LockKeyhole size={21} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Admin access</h1>
          <p className="mt-3 text-sm leading-6 text-white/58">This area is restricted. Enter the admin access key to continue.</p>

          <form className="mt-6 grid gap-4" action="/api/admin/login" method="post">
            <label className="text-sm text-white/68" htmlFor="accessKey">
              Access key
            </label>
            <input
              id="accessKey"
              name="accessKey"
              type="password"
              required
              minLength={12}
              className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
            />
            {error ? (
              <p className="rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">
                {error === "missing-admin-key" ? "Set ADMIN_ACCESS_KEY in Vercel before using admin." : "Invalid admin access key."}
              </p>
            ) : null}
            <Button type="submit">Unlock admin</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
