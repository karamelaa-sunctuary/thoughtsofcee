import Link from "next/link";
import { writings } from "../data/writings";

export default function Letters() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-24">

      <section className="mx-auto max-w-3xl">

        {/* Navigation */}
        <div className="mb-12 flex gap-8 text-sm text-[#8B6F5C]">

          <Link
            href="/"
            className="transition hover:text-[#2E2A27]"
          >
            ← Home
          </Link>

          <Link
            href="/fragments"
            className="transition hover:text-[#2E2A27]"
            >
            Fragments →
            </Link>

        </div>


        {/* Header */}
        <div className="mb-16">

          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
            Letters
          </p>


          <h1 className="
            mb-8
            font-heading
            text-5xl
            leading-tight
            text-[#2E2A27]
          ">
            Words I never sent.
          </h1>


          <p className="
            max-w-xl
            text-lg
            leading-relaxed
            text-[#6B645E]
          ">
            Letters written for the moments that stayed with me.
            Some were never meant to reach anyone else.
            Some were simply meant to be understood.
          </p>

        </div>



        {/* Letters */}

        <div className="space-y-12">

          {writings
            .filter((writing) => writing.type === "letter")
            .map((writing) => (

              <article
                key={writing.slug}
                className="
                  border-b
                  border-[#E5DDD4]
                  pb-12
                "
              >

                <p className="
                  mb-5
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-[#8B6F5C]
                ">
                  {writing.category}
                </p>


                <h2 className="
                  mb-5
                  font-heading
                  text-3xl
                  text-[#2E2A27]
                ">
                  {writing.title}
                </h2>


                <p className="
                  mb-6
                  text-base
                  leading-relaxed
                  text-[#6B645E]
                ">
                  {writing.fragment}
                </p>


                <Link
                  href={`/letters/${writing.slug}`}
                  className="
                    text-sm
                    text-[#8B6F5C]
                    transition
                    hover:text-[#2E2A27]
                  "
                >
                  Read the letter →
                </Link>

              </article>

          ))}

        </div>

      </section>

    </main>
  );
}