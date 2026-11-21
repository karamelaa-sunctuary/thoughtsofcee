"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function unlockStudio(formData: FormData) {
  const configuredCode = process.env.STUDIO_ACCESS_CODE;
  const sessionSecret = process.env.STUDIO_SESSION_SECRET;
  const submittedCode = String(formData.get("accessCode") ?? "");

  if (!configuredCode || !sessionSecret) {
    redirect("/studio/access?setup=1");
  }

  if (!safeMatch(submittedCode, configuredCode)) {
    redirect("/studio/access?error=1");
  }

  const sessionToken = createHmac("sha256", sessionSecret)
    .update("thoughts-of-cee-studio")
    .digest("hex");

  const cookieStore = await cookies();
  cookieStore.set("toc_studio_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/studio",
    maxAge: 60 * 60 * 12,
  });

  redirect("/studio");
}

export default async function StudioAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; setup?: string }>;
}) {
  const params = await searchParams;
  const needsSetup = params.setup === "1" ||
    !process.env.STUDIO_ACCESS_CODE ||
    !process.env.STUDIO_SESSION_SECRET;

  return (
    <main className="min-h-screen bg-[#EAE4DB] px-6 py-10 text-black sm:px-10">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-between">
        <header className="flex items-center justify-between border-b border-[#CFC4B7] pb-5">
          <a href="/" className="text-xs font-black uppercase tracking-[0.2em]">Thoughts of Cee</a>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#765D4B]">Creative Studio</span>
        </header>

        <section className="grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.28em] text-[#765D4B]">A private creative workspace</p>
            <h1 className="max-w-3xl text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.06em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">
              MAKE ROOM
              <br />
              FOR IDEAS.
            </h1>
            <p className="mt-9 max-w-lg text-sm leading-7 text-[#514941]">
              A quiet place to create, shape and organise the visual world of Thoughts of Cee.
              Your words stay yours. Your creative work stays in its own workspace.
            </p>
          </div>

          <div className="border border-[#CFC4B7] bg-[#F5F0E9] p-7 sm:p-9">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#765D4B]">Studio access</p>
            <h2 className="mb-7 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">COME ON IN.</h2>
            {needsSetup ? (
              <div className="border-l-2 border-[#765D4B] pl-4 text-sm leading-7 text-[#514941]">
                <p className="font-bold">One small setup step remains.</p>
                <p className="mt-2">Add <code className="rounded bg-[#EAE4DB] px-1 py-0.5">STUDIO_ACCESS_CODE</code> and <code className="rounded bg-[#EAE4DB] px-1 py-0.5">STUDIO_SESSION_SECRET</code> to the Vercel Preview environment for this project. Then redeploy this preview.</p>
              </div>
            ) : (
              <form action={unlockStudio} className="space-y-5">
                <label htmlFor="accessCode" className="block text-xs font-bold uppercase tracking-[0.14em]">Access code</label>
                <input
                  id="accessCode"
                  name="accessCode"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full border border-[#CFC4B7] bg-[#EAE4DB] px-4 py-3 text-sm outline-none transition focus:border-black"
                  placeholder="Enter your studio code"
                />
                {params.error === "1" && <p role="alert" className="text-xs text-[#8B3327]">That code didn’t match. Please try again.</p>}
                <button type="submit" className="w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#EAE4DB] transition hover:bg-[#765D4B]">
                  Enter the studio <span aria-hidden="true">↗</span>
                </button>
              </form>
            )}
            <p className="mt-7 border-t border-[#CFC4B7] pt-5 text-[10px] uppercase leading-5 tracking-[0.12em] text-[#765D4B]">
              Where feelings become words.
            </p>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-[#CFC4B7] pt-5 text-[10px] uppercase tracking-[0.16em] text-[#765D4B]">
          <span>Thoughts of Cee</span>
          <span>Private workspace · Preview build</span>
        </footer>
      </div>
    </main>
  );
}
