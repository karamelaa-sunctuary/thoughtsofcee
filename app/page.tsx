import Link from "next/link";

import Navbar from "./components/Navbar";
import FeaturedThought from "./components/FeaturedThought";
import WritingPreview from "./components/WritingPreview";
import AboutCee from "./components/AboutCee";
import Footer from "./components/Footer";
import Typewriter from "./components/Typewriter";
import RecentlyAdded from "./components/RecentlyAdded";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <Navbar />

      {/* Hero */}
      <section className="flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center">

          <h1 className="fade-in mb-6 font-heading text-7xl text-[#2E2A27]">
            Thoughts of Cee
          </h1>

          <p className="mb-8 text-xl text-[#8B6F5C]">
            <Typewriter text="where feelings become words." />
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#6B645E]">
            Every feeling holds a story.
            <br />
            Some take longer to find their words.
          </p>

          <Link
            href="/fragments"
            className="inline-flex rounded-full bg-[#2E2A27] px-10 py-4 text-sm uppercase tracking-[0.2em] text-[#F8F5F0] transition hover:opacity-90"
          >
            Begin Reading
          </Link>

        </div>
      </section>

      <RecentlyAdded />
      
      {/* Featured Thought */}
      <FeaturedThought />
      {/* Letters Preview */}
      
      <section className="px-6 py-20">

        <div className="mx-auto max-w-5xl">

          <div className="mb-12 text-center">

            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
              Letters I Never Sent
            </p>

            <h2 className="mb-6 font-heading text-5xl text-[#2E2A27]">
              Words that stayed with me.
            </h2>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#6B645E]">
              Some letters are never meant to be delivered.
              <br />
              Some are written simply because they needed somewhere to exist.
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2">


            <Link
              href="/letters/a-letter-i-never-sent"
              className="
                rounded-sm
                border
                border-[#E8DED2]
                bg-[#FFFDF8]
                p-8
                transition
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8B6F5C]">
                Letter
              </p>

              <h3 className="mb-3 font-heading text-3xl text-[#2E2A27]">
                A Letter I Never Sent
              </h3>

              <p className="leading-relaxed text-[#6B645E]">
                Some words stay with us because they were never given a place to go.
              </p>

            </Link>


            <Link
              href="/letters/the-love-i-learned-to-search-for"
              className="
                rounded-sm
                border
                border-[#E8DED2]
                bg-[#FFFDF8]
                p-8
                transition
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8B6F5C]">
                Letter
              </p>

              <h3 className="mb-3 font-heading text-3xl text-[#2E2A27]">
                The Love I Learned to Search For
              </h3>

              <p className="leading-relaxed text-[#6B645E]">
                A reflection on growing, surviving, and learning the kind of love we deserve.
              </p>

            </Link>


            <Link
              href="/letters/the-goodbye-i-never-said"
              className="
                rounded-sm
                border
                border-[#E8DED2]
                bg-[#FFFDF8]
                p-8
                transition
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8B6F5C]">
                Letter
              </p>

              <h3 className="mb-3 font-heading text-3xl text-[#2E2A27]">
                The Goodbye I Never Said
              </h3>

              <p className="leading-relaxed text-[#6B645E]">
                Some goodbyes are never spoken. They are simply carried with gratitude.
              </p>

            </Link>


            <Link
              href="/letters/never-ever"
              className="
                rounded-sm
                border
                border-[#E8DED2]
                bg-[#FFFDF8]
                p-8
                transition
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8B6F5C]">
                Letter
              </p>

              <h3 className="mb-3 font-heading text-3xl text-[#2E2A27]">
                Never Ever
              </h3>

              <p className="leading-relaxed text-[#6B645E]">
                The moment we realize some promises were never ours to hold.
              </p>

            </Link>


          </div>

        </div>

      </section>

      {/* Begin Anywhere */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">

          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
            Begin Anywhere
          </p>

          <h2 className="mb-6 font-heading text-5xl text-[#2E2A27]">
            Not sure where to begin?
          </h2>

          <p className="mb-8 text-lg leading-relaxed text-[#6B645E]">
            Every feeling holds a story.
            <br />
            Some take longer to find their words.
          </p>

          <Link
            href="/random"
            className="inline-flex rounded-full border border-[#2E2A27] px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#2E2A27] transition hover:bg-[#2E2A27] hover:text-[#F8F5F0]"
          >
            Open a Random Thought
          </Link>

        </div>
      </section>


      {/* Letters Section */}
      <WritingPreview />


      {/* About */}
      <AboutCee />


      {/* Footer */}
      <Footer />

    </main>
  );
}