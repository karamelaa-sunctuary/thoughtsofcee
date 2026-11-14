
export default function FeaturedThought() {
  return (
    <section className="bg-[#EAE4DB] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between border-b border-black pb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            A thought for today
          </p>

          <span className="text-[10px] uppercase tracking-[0.2em] text-black">
            Thoughts of Cee
          </span>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_180px] md:items-end">
          <h2 className="max-w-5xl font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-4xl uppercase leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl">
            Some feelings don't need to be solved.
            <br />
            Sometimes they just need somewhere safe to exist.
          </h2>

          <div className="md:pb-2">
            <p className="mb-5 text-xs leading-6 text-black">
              Not everything needs an answer. Some things simply need room to be felt.
            </p>

            <a
              href="/letters/a-letter-i-never-sent"
              className="inline-block border-b border-[#765D4B] pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-50"
            >
              Read this thought →
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-black/30 pt-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black">
            A little space for everything we feel.
          </p>
        </div>
      </div>
    </section>
  );
}
