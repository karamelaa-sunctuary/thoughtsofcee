import Link from "next/link";
import { writings } from "../../data/writings";
import BookReader from "../../components/BookReader";

export default async function LetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const writing = writings.find(
    (item) => item.slug === slug
  );
  
  console.log("LETTER DATA:", writing);

  if (!writing) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] px-6 py-24">
        <h1 className="font-heading text-3xl text-[#2E2A27]">
          Letter not found
        </h1>
      </main>
    );
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
            href="/collections/letters-i-never-sent"
            className="transition hover:text-[#2E2A27]"
          >
            Back to Letters →
          </Link>

        </div>

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

        <div className="mb-12 h-px bg-[#DDD2C4]" />

        <BookReader
        pages={writing.pages ?? []}
        featured={writing.featured ?? []}
        />

      </article>

    </main>
  );
}