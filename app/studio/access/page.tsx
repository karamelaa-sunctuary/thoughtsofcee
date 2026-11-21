import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function matchesSecret(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function unlockStudio(formData: FormData) {
  "use server";

  const accessCode = process.env.STUDIO_ACCESS_CODE;
  const sessionSecret = process.env.STUDIO_SESSION_SECRET;
  if (!accessCode || !sessionSecret) redirect("/studio/access?setup=1");

  const password = String(formData.get("password") ?? "");
  if (!password || !matchesSecret(password, accessCode)) {
    redirect("/studio/access?error=1");
  }

  const token = createHmac("sha256", sessionSecret)
    .update("thoughts-of-cee-studio")
    .digest("hex");
  const cookieStore = await cookies();
  cookieStore.set("toc_studio_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/studio");
}

export default async function StudioAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-[#EAE4DB] px-6 py-10 text-black sm:px-10">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-between">
        <header className="flex items-center justify-between border-b border-[#CFC4B7] pb-5">
          <a href="/" className="text-xs font-black uppercase tracking-[0.2em]">Thoughts of Cee</a>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#765D4B]">Private Creative Studio</span>
        </header>
        <section className="grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.28em] text-[#765D4B]">Founder access only</p>
            <h1 className="max-w-3xl text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.06em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">MAKE ROOM<br />FOR IDEAS.</h1>
            <p className="mt-9 max-w-lg text-sm leading-7 text-[#514941]">A private place to create, shape and organise the world of Thoughts of Cee. Enter your private founder password to continue.</p>
          </div>
          <div className="border border-[#CFC4B7] bg-[#F5F0E9] p-7 sm:p-9">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#765D4B]">Founder sign-in</p>
            <h2 className="mb-7 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">YOUR PRIVATE ROOM.</h2>
            <form action={unlockStudio} className="space-y-5">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.14em]">Founder password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full border border-[#CFC4B7] bg-[#EAE4DB] px-4 py-3 text-sm outline-none focus:border-black" placeholder="Enter your private password" />
              {params.error === "1" && <p role="alert" className="text-xs text-[#8B3327]">That password was not accepted. Please try again.</p>}
              {params.setup === "1" && <p role="alert" className="text-xs text-[#8B3327]">Studio access is not configured in this Preview. Check the two required environment variables.</p> }
              <button className="w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#EAE4DB] hover:bg-[#765D4B]">Unlock Creative Studio ↗</button>
            </form>
            <p className="mt-7 border-t border-[#CFC4B7] pt-5 text-[10px] uppercase leading-5 tracking-[0.12em] text-[#765D4B]">Where feelings become words.</p>
          </div>
        </section>
        <footer className="flex items-center justify-between border-t border-[#CFC4B7] pt-5 text-[10px] uppercase tracking-[0.16em] text-[#765D4B]">
          <span>Thoughts of Cee</span><span>Founder-only · Private</span>
        </footer>
      </div>
    </main>
  );
}
