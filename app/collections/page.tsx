import Link from "next/link";

const collections = [
  {
    title: "Letters I Never Sent",
    description:
      "Words that lived quietly for a while, waiting for the moment they were ready to be written.",
    slug: "letters-i-never-sent",
  },
  {
    title: "The Days Between",
    description:
      "Reflections from the spaces between who we were and who we are becoming.",
    slug: "the-days-between",
  },
  {
    title: "Things I Learned Slowly",
    description:
      "Lessons that arrived with time, experience, and the moments that changed perspective.",
    slug: "things-i-learned-slowly",
  },
  {
    title: "Love & Loss",
    description:
      "The memories we hold, the goodbyes we carry, and the feelings that remain.",
    slug: "love-and-loss",
  },
];

export default function Collections() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-24">

      <section className="mx-auto max-w-3xl">


        {/* Navigation */}

        <div className="mb-12 flex gap-6 text-sm text-[#8B6F5C]">

          <Link
            href="/"
            className="transition hover:text-[#2E2A27]"
          >
            Home
          </Link>


          <Link
            href="/fragments"
            className="transition hover:text-[#2E2A27]"
          >
            Fragments
          </Link>

        </div>



        {/* Header */}

        <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
          Collections
        </p>


        <h1 className="mb-8 font-heading text-5xl leading-tight text-[#2E2A27]">
          Seasons of thoughts,
          <br />
          gathered quietly.
        </h1>


        <p className="mb-16 max-w-2xl text-lg leading-relaxed text-[#6B645E]">
          A collection of moments, memories, and reflections —
          kept together like chapters in a book.
        </p>



        {/* Collection List */}

        <div className="border-t border-[#E5DDD4]">


          {collections.map((collection) => (

            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="
                group
                block
                border-b
                border-[#E5DDD4]
                py-10
                transition
              "
            >

              <div className="flex items-start justify-between gap-6">


                <div>

                  <h2
                    className="
                      mb-4
                      font-heading
                      text-3xl
                      text-[#2E2A27]
                      transition
                      group-hover:text-[#8B6F5C]
                    "
                  >
                    {collection.title}
                  </h2>


                  <p className="max-w-xl text-base leading-relaxed text-[#6B645E]">
                    {collection.description}
                  </p>

                </div>



                <span className="mt-2 text-[#8B6F5C]">
                  →
                </span>


              </div>

            </Link>

          ))}


        </div>


      </section>


    </main>
  );
}