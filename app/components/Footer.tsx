
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#EAE4DB] px-6 pb-10 pt-16 text-black sm:px-10 sm:pt-24">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-12 border-t border-black/30 py-12 md:grid-cols-2">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-4xl uppercase tracking-tight sm:text-5xl"
            >
              Thoughts of Cee.
            </Link>

            <p className="mt-5 text-sm text-[#765D4B]">
              where feelings become words.
            </p>

            <p className="mt-8 max-w-sm text-sm leading-7 text-[#292522]">
              A collection of thoughts, experiences and feelings.
              Words for the things we sometimes find difficult to say.
            </p>
          </div>

          {/* FOOTER LINKS */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">

            <div>
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
                Explore
              </p>

              <div className="flex flex-col gap-4 text-sm">
                <Link href="/">Home</Link>
                <Link href="/letters">Letters</Link>
                <Link href="/fragments">Fragments</Link>
                <Link href="/about">About Cee</Link>
              </div>
            </div>

            <div>
  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
    Find Cee
  </p>

  <div className="flex flex-col gap-4 text-sm">
    <a
      href="https://www.facebook.com/share/1FH9TDwGsF/?mibextid=wwXIfr"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-opacity hover:opacity-50"
    >
      Facebook ↗
    </a>

    <a
      href="https://www.tiktok.com/@thoughtsofceee"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-opacity hover:opacity-50"
    >
      TikTok ↗
    </a>

    <span className="text-black/40">
      Instagram · On pause
    </span>

    <span className="text-black/40">
      Pinterest · Coming soon
    </span>
  </div>
</div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
                Get in touch
              </p>

              <p className="text-sm leading-7 text-[#292522]">
                For thoughts, collaborations and enquiries.
              </p>

              <p className="mt-4 text-xs text-black/40">
                Contact details coming soon.
              </p>
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col gap-4 border-t border-black/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#765D4B]">
            © 2026 Thoughts of Cee
          </p>

          <p className="text-xs text-[#765D4B]">
            Made with words and feelings.
          </p>
        </div>

      </div>
    </footer>
  );
}
