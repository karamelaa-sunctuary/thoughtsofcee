
import Link from "next/link";

const writings = [
  {
    title: "A Letter I Never Sent",
    category: "Love",
    excerpt:
      "Some words stay with us, not because they were forgotten, but because they were never spoken.",
    href: "/letters/a-letter-i-never-sent",
  },
  {
    title: "The Days Between Dates",
    category: "Reflections",
    excerpt:
      "Some chapters of life are not endings or beginnings. They are the quiet spaces in between.",
    href: "/letters/the-days-between-dates",
  },
  {
    title: "Becoming Someone New",
    category: "Becoming",
    excerpt:
      "Growth is often invisible until one day we realize we are no longer who we used to be.",
    href: "/letters/becoming-someone-new",
  },
];

export default function WritingPreview() {
  return (
    <section className="bg-[#EAE4DB] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-5 border-b border-black pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
              Words worth sitting with
            </p>

            <h2 className="font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-5xl uppercase leading-[0.9] tracking-tight text-black sm:text-7xl">
              Latest Letters.
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-black">
            Stories, feelings, and words that perhaps you needed to find.
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          {writings.map((writing, index) => (
            <article
              key={writing.title}
              className={`group flex flex-col border-b border-black/30 py-9 md:border-b-0 md:py-5 ${
                index !== 0 ? "md:border-l md:pl-8" : "md:pr-8"
              } ${index !== 2 ? "md:pr-8" : ""}`}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
                  {writing.category}
                </span>

                <span className="text-xs text-black/50">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mb-5 font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight text-black transition-opacity group-hover:opacity-60 sm:text-4xl">
                {writing.title}
              </h3>

              <p className="mb-10 flex-1 text-sm leading-7 text-black">
                {writing.excerpt}
              </p>

              <Link
                href={writing.href}
                className="inline-flex w-fit items-center gap-3 border-b border-[#765D4B] pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-50"
              >
                Read Letter <span>→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 border-t border-black/30 pt-5">
          <Link
            href="/letters"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-50"
          >
            Explore all letters →
          </Link>
        </div>
      </div>
    </section>
  );
}
