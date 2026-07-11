import Link from "next/link";
import { writings } from "../../data/writings";
import BookReader from "../../components/BookReader";

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;


  const writing = writings.find(
    (item) => item.slug === slug
  );


  if (!writing) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] px-6 py-24">

        <h1 className="font-heading text-3xl text-[#2E2A27]">
          Thought not found
        </h1>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#F1ECE4] px-6 py-16">


      <article
        className="
        mx-auto
        max-w-3xl
        rounded-sm
        bg-[#FFFDF8]
        px-6
        py-12
        shadow-[0_20px_50px_rgba(46,42,39,0.08)]

        md:px-16
        md:py-16
        "
      >


        {/* Navigation */}

        <div className="mb-14 flex justify-between text-sm text-[#8B6F5C]">

          <Link
            href="/"
            className="transition hover:text-[#2E2A27]"
          >
            ← Home
          </Link>


          <Link
            href="/writings"
            className="transition hover:text-[#2E2A27]"
          >
            Library →
          </Link>

        </div>



        {/* Header */}

        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
          {writing.category}
        </p>



        <h1
          className="
          mb-10
          font-heading
          text-4xl
          leading-tight
          text-[#2E2A27]

          md:text-5xl
          "
        >
          {writing.title}
        </h1>



        <div className="mb-12 h-px bg-[#E5DDD4]" />



        {/* LETTER FORMAT */}

        {
          writing.type === "letter" && writing.pages ? (

            <BookReader
              pages={writing.pages}
              featured={writing.featured ?? []}
            />

          ) : (

            <div
              className="
              whitespace-pre-line
              font-serif
              text-base
              leading-[1.8]
              text-[#2E2A27]

              md:text-lg
              "
            >
              {writing.content}
            </div>

          )
        }



        {/* Closing */}

        <div className="mt-20 border-t border-[#E5DDD4] pt-10 text-center">

          <p
            className="
            font-heading
            text-2xl
            leading-relaxed
            text-[#2E2A27]
            "
          >
            Some thoughts are written
            <br />
            simply to be held.
          </p>


          <p className="mt-6 text-sm text-[#6B645E]">
            A thought kept somewhere safe.
          </p>

        </div>



        <div className="mt-14 text-center">

          <Link
            href="/writings"
            className="
            text-xs
            uppercase
            tracking-[0.25em]
            text-[#8B6F5C]
            transition
            hover:text-[#2E2A27]
            "
          >
            Return to library →
          </Link>

        </div>


      </article>


    </main>
  );
}