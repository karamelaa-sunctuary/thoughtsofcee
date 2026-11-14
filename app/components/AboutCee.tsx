
export default function AboutCee() {
  return (
    <section className="bg-[#EAE4DB] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl border-t border-black pt-8">
        <p className="mb-14 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
          A little about this space
        </p>

        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
          <div>
            <h2 className="font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-5xl uppercase leading-[0.95] tracking-tight text-black sm:text-7xl lg:text-8xl">
              A place for the thoughts we carry quietly.
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-10 md:pt-2">
            <div>
              <p className="mb-6 text-base leading-8 text-black sm:text-lg">
                Thoughts of Cee was created for the moments when feelings are difficult to explain, when words remain unsaid, and when a quiet reflection is all we need.
              </p>

              <p className="text-base leading-8 text-black sm:text-lg">
                A collection of thoughts, stories, and emotions — written with honesty, warmth, and a little bit of hope.
              </p>
            </div>

            <p className="font-[KunstlerScript,cursive] text-4xl text-[#765D4B] sm:text-5xl">
              With a little honesty, Cee.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-black/30 pt-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black">
            Where feelings become words.
          </p>
        </div>
      </div>
    </section>
  );
}
