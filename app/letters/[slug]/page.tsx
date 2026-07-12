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
    (writing) => writing.slug === slug
  );

  if (!letter) {
    notFound();
  }

  if (letter.type !== "letter") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F1ECE4] px-6 py-16">

      <article
        className="
          mx-auto
          max-w-5xl
        "
      >

        <div className="mb-14 flex justify-between text-sm text-[#8B6F5C]">

          <Link
            href="/"
            className="transition hover:text-[#2E2A27]"
          >
            ← Home
          </Link>

          <Link
            href="/letters"
          >
            Back to Letters →
          </Link>

        </div>

        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
          {letter.category}
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
          {letter.title}
        </h1>

        <div className="mb-12 h-px bg-[#DDD2C4]" />

        <BookReader
        pages={letter.pages ?? []}
        featured={letter.featured ?? []}
        />

      </article>

    </main>
  );
}