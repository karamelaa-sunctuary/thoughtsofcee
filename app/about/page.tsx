
import Image from "next/image";
import Link from "next/link";

export default function AboutCee() {
  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">

      {/* OPENING */}
      <section className="px-6 pb-16 pt-20 sm:px-10 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between border-b border-black/30 pb-5">
  <Link
    href="/"
    className="text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-50"
  >
    ← Home
  </Link>

  <Link
    href="/fragments"
    className="text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-50"
  >
    Fragments →
  </Link>
</div>

          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            A little about this space
          </p>

          <h1 className="max-w-6xl font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-6xl uppercase leading-[0.85] tracking-tight text-black sm:text-8xl md:text-9xl">
            Behind
            <br />
            the words.
          </h1>

          <div className="mt-12 flex flex-col gap-6 border-t border-black/30 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-lg font-semibold leading-relaxed sm:text-2xl">
              A collection of thoughts, experiences, and feelings that
              found their way into words.
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
              An introduction to Cee
            </p>
          </div>
        </div>
      </section>

      {/* VINTAGE EDITORIAL IMAGE */}
      <section className="px-6 pb-20 sm:px-10 sm:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden">
            <Image
              src="/images/cee-about-2.png"
              alt="A vintage typewriter surrounded by books and handwritten pages"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-black/30 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
              Behind the words
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/60">
              Thoughts of Cee
            </p>
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-24">

          <div>
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
              The story behind it
            </p>

            <h2 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Not everything needs to be said out loud.
            </h2>

            <div className="mt-8 h-[2px] w-16 bg-[#765D4B]" />
          </div>

          <div className="space-y-8 text-[15px] leading-[2] text-[#292522] sm:text-base">

            <p>
              Thoughts of Cee began with a quiet realization:
              how easily pieces of life become softer around the edges,
              and how memories that once felt vivid can slowly become whispers.
            </p>

            <p>
              A conversation. A feeling. A lesson learned in a season
              we thought would last forever.
            </p>

            <p>
              So this became a place to keep them. Not as a record of
              everything that happened, but as a collection of what mattered.
            </p>

            <div className="my-12 border-l-[3px] border-[#765D4B] py-3 pl-6 sm:pl-8">
              <p className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-3xl uppercase leading-[1.15] sm:text-4xl">
                The thoughts that changed me.
                <br />
                The experiences that shaped me.
                <br />
                The words I needed to remember.
              </p>
            </div>

            <p>
              Thoughts of Cee is a collection of honest reflections —
              a place to return to the pages of my own journey and meet
              the versions of myself I once was.
            </p>

          </div>
        </div>
      </section>

      {/* A PERSONAL NOTE */}
      <section className="border-y border-black/20 bg-[#F1EBE2] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            A note from Cee
          </p>

          <h2 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-4xl uppercase leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Every feeling holds a story.
            <br />
            Some just take longer to find their words.
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-[#292522] sm:text-base">
            Perhaps somewhere in these pages, you'll find a thought
            that feels a little familiar. Something you've felt,
            but never quite knew how to say.
          </p>

          <p className="kunstler mt-12 text-6xl text-[#765D4B] sm:text-7xl">
            
          </p>

        </div>
      </section>

      {/* RETURN TO READING */}
      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
              Stay a little longer
            </p>

            <h2 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-5xl uppercase leading-[0.9] tracking-tight sm:text-7xl">
              Find a thought.
              <br />
              Find a feeling.
            </h2>
          </div>

          <Link
            href="/letters"
            className="inline-block w-fit border-b-2 border-black pb-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-50"
          >
            Explore the letters →
          </Link>

        </div>
      </section>

    </main>
  );
}
