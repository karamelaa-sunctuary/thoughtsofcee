"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function IdentityPanel({
  configured,
  authenticated,
}: {
  configured: boolean;
  authenticated: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || busy) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw new Error("Sign-in was not accepted. Check the email and password for your existing founder account.");
      }

      setPassword("");
      setNotice("Founder identity verified.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Supabase sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!configured || busy) return;
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw new Error("Sign-out could not be completed. Please try again.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Supabase sign-out failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-[#CFC4B7] bg-[#F5F0E9] p-6 sm:p-8">
      <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Supabase founder identity</p>
      <h2 className="mt-3 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">
        {authenticated ? "IDENTITY CONNECTED." : "CONNECT YOUR IDENTITY."}
      </h2>

      {!configured ? (
        <div className="mt-5 border border-[#B98B69] bg-white p-4 text-xs leading-6 text-[#765D4B]">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to this Preview environment, then restart the development server. Never add a service-role or secret key here.
        </div>
      ) : authenticated ? (
        <>
          <p className="mt-4 text-sm leading-6 text-[#514941]">
            Your existing Supabase Auth session has been verified on the server. The private department APIs can now use your authenticated founder identity and existing row-level security.
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            disabled={busy}
            className="mt-6 bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB] disabled:opacity-40"
          >
            {busy ? "Please wait…" : "Sign out of Supabase"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-[#514941]">
            This is a second, separate check after unlocking the private Studio. Sign in with the existing founder account in this Supabase project. Account creation is disabled here.
          </p>
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <label className="block text-xs font-semibold">
              Founder email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-black"
              />
            </label>
            <label className="block text-xs font-semibold">
              Supabase account password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-black"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !email.trim() || !password}
              className="w-full bg-black px-5 py-4 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB] disabled:opacity-40"
            >
              {busy ? "Verifying…" : "Verify founder identity"}
            </button>
          </form>
        </>
      )}

      {error && <p role="alert" className="mt-4 border border-[#B98B69] bg-white p-3 text-xs leading-5 text-[#8B3327]">{error}</p>}
      {notice && <p role="status" className="mt-4 text-xs text-[#765D4B]">{notice}</p>}
      <p className="mt-6 border-t border-[#CFC4B7] pt-4 text-[10px] leading-5 text-[#765D4B]">
        Supabase Auth is separate from your Studio access password. The password is sent directly to Supabase Auth and is never stored by this page.
      </p>
    </section>
  );
}
