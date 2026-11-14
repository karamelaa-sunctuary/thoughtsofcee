
import Link from "next/link";
import { writings } from "../../data/writings";
import BookReader from "../../components/BookReader";
import { notFound } from "next/navigation";

export default async function LetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const letter = writings.find(
    (writing) =>
      writing.slug === slug &&
      writing.type === "letter"
  );

  if (!letter) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#EAE4DB] px-6 py-12 text-black sm:px-10 sm:py-16">

      <article className="mx-auto max-w-7xl">

        {/* NAVIGATION */}
        <div className="mb-20 flex items-center justify-between border-b border-black/30 pb-5">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            ← Home
          </Link>

          <Link
            href="/letters"
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
          >
            Back to Letters →
          </Link>
        </div>

        {/* LETTER HEADING */}
        <header className="mx-auto mb-16 max-w-5xl">

          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            A letter / {letter.category}
          </p>

          <h1 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-5xl uppercase leading-[0.95] tracking-tight text-black sm:text-7xl md:text-8xl">
            {letter.title}
          </h1>

          <div className="mt-12 flex items-center justify-between border-t border-black/30 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
              Thoughts of Cee
            </p>

            <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">
              Take your time reading.
            </p>
          </div>

        </header>

        {/* LETTER READER */}
        <section className="mx-auto max-w-4xl">
          <BookReader
            pages={letter.pages ?? []}
            featured={letter.featured ?? []}
          />
        </section>

        {/* CLOSING NAVIGATION */}
        <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-6 border-t border-black/30 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
              End of this letter
            </p>

            <p className="mt-2 text-sm text-[#292522]">
              Thank you for spending a moment here.
            </p>
          </div>

          <Link
            href="/letters"
            className="w-fit border-b border-black pb-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-50"
          >
            Return to all letters →
          </Link>

        </div>

      </article>
    </main>
  );
}
