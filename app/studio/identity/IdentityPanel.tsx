"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function IdentityPanel({ configured, authenticated }: { configured: boolean; authenticated: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const supabase = createClient();
      const { error: requestError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
      if (requestError) throw new Error(requestError.message);
      setCodeSent(true);
      setNotice("Your verification code has been sent. Check your inbox and spam folder, then enter the code below.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The verification code could not be requested.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });
      if (verifyError) throw new Error(verifyError.message);
      setNotice("Your founder identity is verified. Refreshing the Studio…");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The verification code could not be verified.");
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
          <p className="mt-4 text-sm leading-6 text-[#514941]">Your existing Supabase Auth session has been verified on the server. The private department APIs can now use your authenticated founder identity and existing row-level security.</p>
          <button type="button" onClick={() => void signOut()} disabled={busy} className="mt-6 bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB] disabled:opacity-40">
            {busy ? "Please wait…" : "Sign out of Supabase"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-[#514941]">Use the email address on your existing founder account. Supabase will send a one-time verification code; no password or new account is required.</p>
          {!codeSent ? (
            <form onSubmit={requestCode} className="mt-6 space-y-4">
              <label className="block text-xs font-semibold">
                Founder email
                <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-black"/>
              </label>
              <button type="submit" disabled={busy || !email.trim()} className="w-full bg-black px-5 py-4 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB] disabled:opacity-40">
                {busy ? "Sending…" : "Email me a verification code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="mt-6 space-y-4">
              <p className="text-xs leading-5 text-[#765D4B]">Code sent to <strong>{email.trim()}</strong>.</p>
              <label className="block text-xs font-semibold">
                Eight-digit verification code
                <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" maxLength={8} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))} className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-lg tracking-[.35em] font-semibold outline-none focus:border-black" placeholder="00000000"/>
              </label>
              <button type="submit" disabled={busy || code.length !== 8} className="w-full bg-black px-5 py-4 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB] disabled:opacity-40">
                {busy ? "Verifying…" : "Verify founder identity"}
              </button>
              <button type="button" onClick={() => { setCode(""); setCodeSent(false); setNotice(""); setError(""); }} className="w-full border border-[#CFC4B7] px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#765D4B]">Use a different email / resend code</button>
            </form>
          )}
        </>
      )}
      {error && <p role="alert" className="mt-4 border border-[#B98B69] bg-white p-3 text-xs leading-5 text-[#8B3327]">{error}</p>}
      {notice && <p role="status" className="mt-4 text-xs leading-5 text-[#765D4B]">{notice}</p>}
      <p className="mt-6 border-t border-[#CFC4B7] pt-4 text-[10px] leading-5 text-[#765D4B]">Supabase Auth is a separate check after the Studio access password. Account creation is disabled on this page. The one-time code establishes your founder identity through Supabase's secure session cookies.</p>
    </section>
  );
}
