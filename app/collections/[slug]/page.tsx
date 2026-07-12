import Link from "next/link";
import { writings } from "../../data/writings";

const Fragments = {
  "letters-i-never-sent": {
    title: "Letters I Never Sent",
    intro:
      "Some words arrive too late.\n\nNot because they were forgotten, but because they needed time.\n\nThere are feelings we carry quietly — things we wanted to say, things we rehearsed in our minds, things that stayed with us long after the moment had passed.\n\nSome letters are never meant to be delivered.\n\nSome are written simply to understand what was left unsaid.",
  },

  "the-days-between": {
    title: "The Days Between",
    intro:
      "The quiet spaces between who we were and who we are becoming.\n\nThe moments where change happens slowly, often before we notice it.",
  },

  "things-i-learned-slowly": {
    title: "Things I Learned Slowly",
    intro:
      "Some lessons arrive gently.\n\nNot as answers, but as understanding found through time.",
  },

  "love-and-loss": {
    title: "Love & Loss",
    intro:
      "The things we hold onto.\n\nThe things we release.\n\nAnd the memories that remain somewhere between.",
  },
};


export default async function FragmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;


  const Fragment =
    Fragments[slug as keyof typeof Fragments];


    const FragmentWritings = writings.filter(
      (writing) =>
        writing.collection === slug
    );


  if (!Fragment) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] px-6 py-24">

        <section className="mx-auto max-w-3xl">

          <h1 className="font-heading text-4xl text-[#2E2A27]">
            Fragment not found
          </h1>

        </section>

      </main>
    );
  }


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
            href="/Fragments"
            className="transition hover:text-[#2E2A27]"
          >
            Fragments
          </Link>

        </div>



        <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
          Fragment
        </p>



        <h1 className="mb-12 font-heading text-4xl leading-tight text-[#2E2A27]">
          {Fragment.title}
        </h1>



        <div className="h-px bg-[#E5DDD4]" />



        <div className="whitespace-pre-line pt-12 text-lg leading-[1.9] text-[#2E2A27]">

          {Fragment.intro}

        </div>



        <div className="my-16 h-px bg-[#E5DDD4]" />



        <section>

          <p className="mb-10 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
            Within this Fragment
          </p>



          {FragmentWritings.length > 0 ? (

            <div className="space-y-10">

              {FragmentWritings.map((writing) => (

                <Link
                  key={writing.slug}
                  href={
                    writing.type === "letter"
                      ? `/letters/${writing.slug}`
                      : `/writings/${writing.slug}`
                  }
                  className="
                    group
                    block
                    border-b
                    border-[#E5DDD4]
                    pb-10
                  "
                >

                  <h2 className="
                    mb-4
                    font-heading
                    text-3xl
                    text-[#2E2A27]
                    transition
                    group-hover:text-[#8B6F5C]
                  ">
                    {writing.title}
                  </h2>


                  <p className="
                    mb-5
                    text-base
                    leading-relaxed
                    text-[#6B645E]
                  ">
                    {writing.excerpt}
                  </p>


                  <span className="text-sm text-[#8B6F5C]">
                    Read letter →
                  </span>


                </Link>

              ))}

            </div>

          ) : (

            <p className="text-lg text-[#6B645E]">
              More thoughts are waiting to be written.
            </p>

          )}

        </section>



        <div className="mt-16 border-t border-[#E5DDD4] pt-12">

          <p className="font-heading text-2xl leading-relaxed text-[#2E2A27]">
            Every thought carries a story.
            <br />
            Every story leaves something behind.
          </p>

        </div>



      </section>

    </main>
  );
}