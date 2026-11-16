
import Link from "next/link";
import { writings } from "../data/writings";

export default function RecentlyAdded() {
  const recent = [...writings]
    .filter((item) => item.date)
    .sort(
      (a, b) =>
        new Date(b.date!).getTime() - new Date(a.date!).getTime()
    )
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-4 border-b border-black pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            The latest from Cee
          </p>

          <h2 className="font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-5xl uppercase leading-[0.9] tracking-tight text-black sm:text-7xl">
            Recently Added.
          </h2>
        </div>

        <p className="max-w-xs text-sm leading-relaxed text-black">
          Little pieces of thought, feeling, and everything in between.
        </p>
      </div>

      <div>
        {recent.map((writing, index) => (
          <article
            key={writing.slug}
            className="grid gap-5 border-b border-black/20 py-8 sm:grid-cols-[90px_1fr_160px] sm:gap-8 sm:py-10"
          >
            <p className="text-xs font-bold tracking-widest text-[#765D4B]">
              0{index + 1}
            </p>

            <div>
              <h3 className="mb-4 font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-3xl uppercase leading-tight tracking-tight text-black sm:text-4xl">
                {writing.title}
              </h3>

              <p className="max-w-2xl text-sm leading-7 text-black sm:text-base">
                {writing.fragment}
              </p>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
              <span className="text-xs text-black">
                {writing.date}
              </span>

              <Link
                href={
                  writing.type === "fragment"
                    ? `/fragments/${writing.slug}`
                    : `/letters/${writing.slug}`
                }
                className="text-[10px] font-bold uppercase tracking-[0.16em] text-black underline decoration-[#765D4B] underline-offset-4 transition-opacity hover:opacity-50"
              >
                Read {writing.type === "fragment" ? "Fragment" : "Letter"} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
