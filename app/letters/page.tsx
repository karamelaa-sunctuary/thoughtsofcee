
import Link from "next/link";
import { writings } from "../data/writings";

export default function Letters() {
  const letters = writings.filter((writing) => writing.type === "letter");

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
            href="/fragments"
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            Fragments →
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-20">
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            The collection / Letters
          </p>

          <h1 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-6xl uppercase leading-[0.85] tracking-tight sm:text-8xl md:text-9xl">
            Words
            <br />
            I Never Sent.
          </h1>

          <div className="mt-12 flex flex-col gap-6 border-t border-black/30 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-8 text-[#292522] sm:text-lg">
              Letters written for the moments that stayed with me.
              Some were never meant to reach anyone else.
              Some were simply meant to be understood.
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
              {letters.length} {letters.length === 1 ? "Letter" : "Letters"}
            </p>
          </div>
        </div>

        {/* LETTERS */}
        <div className="border-t border-black">
          {letters.map((writing, index) => (
            <article
              key={writing.slug}
              className="grid gap-5 border-b border-black/25 py-10 sm:grid-cols-[80px_1fr_160px] sm:gap-8 sm:py-14"
            >
              <p className="text-xs font-bold tracking-widest text-[#765D4B]">
                {String(index + 1).padStart(2, "0")}
              </p>

              <div>
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#765D4B]">
                  {writing.category}
                </p>

                <h2 className="mb-5 font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight text-black sm:text-4xl md:text-5xl">
                  {writing.title}
                </h2>

                <p className="max-w-2xl text-sm leading-7 text-[#292522] sm:text-base">
                  {writing.fragment}
                </p>
              </div>

              <div className="flex items-end sm:justify-end">
                <Link
                  href={`/letters/${writing.slug}`}
                  className="inline-block border-b border-black pb-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
                >
                  Read the letter →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-black/30 pt-6 mt-10">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
            Thoughts of Cee
          </p>

          <Link
            href="/fragments"
            className="text-[9px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            Explore Fragments →
          </Link>
        </div>

      </section>
    </main>
  );
}
