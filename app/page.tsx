
import Link from "next/link";

import Navbar from "./components/Navbar";
import FeaturedThought from "./components/FeaturedThought";
import WritingPreview from "./components/WritingPreview";
import AboutCee from "./components/AboutCee";
import Footer from "./components/Footer";
import Typewriter from "./components/Typewriter";
import RecentlyAdded from "./components/RecentlyAdded";
import VideoGallery from "./components/VideoGallery";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#8B6F5C]">
            A little space for everything we feel
          </p>

         
<h1 className="hero-title">
  THOUGHTS
  <br />
  OF CEE
</h1>


          <div className="mt-12 flex flex-col gap-8 border-t border-[#E5DDD4] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 text-lg font-semibold sm:text-2xl">
                <Typewriter text="where feelings become words." />
              </p>
              <p className="max-w-md text-sm leading-7 text-[#6B645E] sm:text-base">
                Every feeling holds a story.
                Some take longer to find their words.
              </p>
            </div>

            <Link
              href="/fragments"
              className="inline-flex w-fit border-b-2 border-[#2E2A27] pb-2 text-sm font-bold uppercase tracking-[0.15em] transition hover:border-[#8B6F5C] hover:text-[#8B6F5C]"
            >
              Start reading →
            </Link>
          </div>
        </div>
      </section>

      
{/* HOMEPAGE EDITORIAL IMAGE */}
<section className="px-6 pb-24">
  <div className="mx-auto max-w-5xl">

    <div className="overflow-hidden">
      <Image
        src="/images/cee-editorial.png"
        alt="A vintage editorial still life of books, handwritten letters and a quiet writing space"
        width={1180}
        height={1472}
        priority
        className="h-auto w-full object-cover"
      />
    </div>

    <div className="mt-4 flex items-center justify-between border-t border-black/20 pt-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
        Thoughts of Cee
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">
        A space for the unsaid
      </p>
    </div>

  </div>
</section>


      {/* RECENT WRITING */}
      <RecentlyAdded />

      {/* FEATURED THOUGHT */}
      <FeaturedThought />

      {/* VIDEO GALLERY */}
      <VideoGallery />

      {/* LETTERS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-16 flex flex-col gap-6 border-b border-[#E5DDD4] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#8B6F5C]">
                Letters I never sent
              </p>

              <h2 className="max-w-3xl font-sans text-5xl font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                Words that
                <br />
                stayed with me.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#6B645E]">
              Some letters are never meant to be delivered.
              Some are written simply because they needed
              somewhere to exist.
            </p>
          </div>

          <div className="grid gap-x-12 md:grid-cols-2">

            <Link
              href="/letters/a-letter-i-never-sent"
              className="group border-b border-[#E5DDD4] py-9 transition-colors hover:border-[#8B6F5C]"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6F5C]">
                01 / Letter
              </p>
              <h3 className="mb-4 font-heading text-3xl transition-colors group-hover:text-[#8B6F5C] sm:text-4xl">
                A Letter I Never Sent
              </h3>
              <p className="max-w-md text-sm leading-7 text-[#6B645E]">
                Some words stay with us because they were never
                given a place to go.
              </p>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em]">
                Read letter →
              </p>
            </Link>

            <Link
              href="/letters/the-love-i-learned-to-search-for"
              className="group border-b border-[#E5DDD4] py-9 transition-colors hover:border-[#8B6F5C]"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6F5C]">
                02 / Letter
              </p>
              <h3 className="mb-4 font-heading text-3xl transition-colors group-hover:text-[#8B6F5C] sm:text-4xl">
                The Love I Learned to Search For
              </h3>
              <p className="max-w-md text-sm leading-7 text-[#6B645E]">
                A reflection on growing, surviving, and learning
                the kind of love we deserve.
              </p>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em]">
                Read letter →
              </p>
            </Link>

            <Link
              href="/letters/accountability"
              className="group border-b border-[#E5DDD4] py-9 transition-colors hover:border-[#8B6F5C]"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6F5C]">
                03 / Letter
              </p>
              <h3 className="mb-4 font-heading text-3xl transition-colors group-hover:text-[#8B6F5C] sm:text-4xl">
                Accountability
              </h3>
              <p className="max-w-md text-sm leading-7 text-[#6B645E]">
                Looking inward, growing honestly, and understanding
                the parts of ourselves that need healing.
              </p>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em]">
                Read letter →
              </p>
            </Link>

            <Link
              href="/letters/never-ever"
              className="group border-b border-[#E5DDD4] py-9 transition-colors hover:border-[#8B6F5C]"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6F5C]">
                04 / Letter
              </p>
              <h3 className="mb-4 font-heading text-3xl transition-colors group-hover:text-[#8B6F5C] sm:text-4xl">
                Never Ever
              </h3>
              <p className="max-w-md text-sm leading-7 text-[#6B645E]">
                The moment we realize some promises were never
                ours to hold.
              </p>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em]">
                Read letter →
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* BEGIN ANYWHERE */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl border-y border-[#E5DDD4] py-14">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#8B6F5C]">
            No particular order
          </p>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="max-w-2xl font-sans text-5xl font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                Begin
                <br />
                anywhere.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#6B645E]">
                You don't have to know what you're looking for.
                Sometimes a single thought is enough.
              </p>
            </div>

            <Link
              href="/random"
              className="inline-flex w-fit border-b-2 border-[#2E2A27] pb-2 text-sm font-bold uppercase tracking-[0.15em] transition hover:border-[#8B6F5C] hover:text-[#8B6F5C]"
            >
              Find a random thought →
            </Link>
          </div>
        </div>
      </section>

      {/* WRITING PREVIEW */}
      <WritingPreview />

      {/* ABOUT CEE */}
      <AboutCee />

      
{/* ABOUT CEE EDITORIAL IMAGE */}
<section className="px-6 pb-24">
  <div className="mx-auto max-w-7xl overflow-hidden">
    <Image
      src="/images/cee-about.png"
      alt="A vintage writing desk with handwritten letters, old books and warm afternoon light"
      width={1536}
      height={1024}
      className="h-auto w-full object-cover"
    />
  </div>
</section>


      <Footer />
    </main>
  );
}
