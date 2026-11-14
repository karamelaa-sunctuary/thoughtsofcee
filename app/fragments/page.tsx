
import Link from "next/link";
import { writings } from "../data/writings";
import VideoGallery from "../components/VideoGallery";

export default function Fragments() {
  const fragments = writings.filter(
    (writing) => writing.type === "fragment"
  );

  return (
    <main className="min-h-screen bg-[#EAE4DB] px-6 py-16 text-black sm:px-10 sm:py-24">
      <section className="mx-auto max-w-7xl">

        {/* NAVIGATION */}
        <div className="mb-16 flex items-center justify-between border-b border-black/30 pb-5">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            ← Home
          </Link>

          <Link
            href="/letters"
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            Letters →
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-16">
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            The collection / Fragments
          </p>

          <h1 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-6xl uppercase leading-[0.85] tracking-tight sm:text-8xl md:text-9xl">
            Little Pieces
            <br />
            Worth Keeping.
          </h1>

          <div className="mt-12 flex flex-col gap-6 border-t border-black/30 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-8 text-[#292522] sm:text-lg">
              Thoughts, feelings, and moments collected along the way.
              Some are beginnings of stories.
              Some are simply words that stayed.
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
              {fragments.length} {fragments.length === 1 ? "Fragment" : "Fragments"}
            </p>
          </div>
        </div>

      </section>

      {/* VIDEO GALLERY */}
      <VideoGallery />

      {/* WRITTEN FRAGMENTS */}
      <section className="mx-auto mt-12 max-w-7xl sm:mt-20">

        <div className="mb-12 flex items-end justify-between border-b border-black pb-5">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
              Written pieces
            </p>

            <h2 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-4xl uppercase leading-none sm:text-6xl">
              From the pages.
            </h2>
          </div>

          <p className="hidden text-[10px] uppercase tracking-[0.2em] text-black/60 sm:block">
            Thoughts of Cee
          </p>
        </div>

        <div className="border-t border-black/20">
          {fragments.map((writing, index) => (
            <article
              key={writing.slug}
              className="grid gap-6 border-b border-black/25 py-10 sm:grid-cols-[80px_1fr] sm:gap-10 sm:py-14"
            >
              <p className="pt-1 text-xs font-bold tracking-widest text-[#765D4B]">
                {String(index + 1).padStart(2, "0")}
              </p>

              <div>
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#765D4B]">
                  {writing.category}
                </p>

                <h3 className="mb-6 font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight text-black sm:text-4xl md:text-5xl">
                  {writing.title}
                </h3>

                <blockquote className="mb-8 max-w-4xl border-l-[3px] border-[#765D4B] py-2 pl-5 sm:pl-8">
                  <p className="text-base leading-[1.9] text-[#292522] sm:text-lg">
                    “{writing.fragment}”
                  </p>
                </blockquote>

                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <Link
                    href={`/fragments/${writing.slug}`}
                    className="border-b border-black pb-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
                  >
                    Read the fragment →
                  </Link>

                  {writing.linkedLetter && (
                    <Link
                      href={`/letters/${writing.linkedLetter}`}
                      className="border-b border-[#765D4B] pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#765D4B] transition-opacity hover:opacity-50"
                    >
                      Read the full letter →
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="mt-10 flex items-center justify-between border-t border-black/30 pt-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
            Thoughts of Cee
          </p>

          <Link
            href="/letters"
            className="text-[9px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            Explore Letters →
          </Link>
        </div>

      </section>
    </main>
  );
}
