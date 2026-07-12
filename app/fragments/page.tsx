import Link from "next/link";
import { writings } from "../data/writings";

export default function Fragments() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-24">

      <section className="mx-auto max-w-3xl">


        {/* Header */}

        <div className="mb-16">


          <div className="mb-10 flex gap-8 text-sm text-[#8B6F5C]">

            <Link
              href="/"
              className="transition hover:text-[#2E2A27]"
            >
              ← Home
            </Link>


            <Link
              href="/letters"
              className="transition hover:text-[#2E2A27]"
            >
              Letters →
            </Link>

          </div>



          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
            Fragments
          </p>


          <h1
            className="
              mb-8
              font-heading
              text-5xl
              leading-tight
              text-[#2E2A27]
            "
          >
            Little pieces
            <br />
            I wanted to keep.
          </h1>


          <p
            className="
              max-w-xl
              text-lg
              leading-relaxed
              text-[#6B645E]
            "
          >
            Thoughts, feelings, and moments collected along the way.
            Some are beginnings of stories.
            Some are simply words that stayed.
          </p>


        </div>



        {/* Fragment Cards */}

        <div className="space-y-16">


          {writings
            .filter((writing) => writing.type === "fragment")
            .map((writing) => (

              <article
                key={writing.slug}
                className="
                  border-b
                  border-[#E5DDD4]
                  pb-12
                "
              >


                <p
                  className="
                    mb-6
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-[#8B6F5C]
                  "
                >
                  {writing.category}
                </p>



                <h2
                  className="
                    mb-6
                    font-heading
                    text-3xl
                    leading-relaxed
                    text-[#2E2A27]
                  "
                >
                  {writing.title}
                </h2>



                <p
                  className="
                    mb-8
                    font-heading
                    text-xl
                    leading-[1.8]
                    text-[#2E2A27]
                  "
                >
                  "{writing.fragment}"
                </p>



                <Link
                  href={`/fragments/${writing.slug}`}
                  className="
                    mr-8
                    text-sm
                    text-[#8B6F5C]
                    transition
                    hover:text-[#2E2A27]
                  "
                >
                  Read the fragment →
                </Link>



                {writing.linkedLetter && (

                  <Link
                    href={`/letters/${writing.linkedLetter}`}
                    className="
                      text-sm
                      text-[#8B6F5C]
                      transition
                      hover:text-[#2E2A27]
                    "
                  >
                    Read the full letter →
                  </Link>

                )}


              </article>

            ))}


        </div>


      </section>


    </main>
  );
}