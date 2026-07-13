import Link from "next/link";
import { writings } from "../data/writings";

export default function RecentlyAdded() {

  const recent = [...writings]
    .filter((item) => item.date)
    .sort(
      (a, b) =>
        new Date(b.date!).getTime() -
        new Date(a.date!).getTime()
    )
    .slice(0, 3);


  return (
    <section className="mx-auto max-w-3xl px-6 py-20">

      <p className="
        mb-10
        text-xs
        uppercase
        tracking-[0.35em]
        text-[#8B6F5C]
      ">
        Recently Added
      </p>


      <div className="space-y-12">

        {recent.map((writing) => (

          <article
            key={writing.slug}
            className="
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
            ">
              {writing.title}
            </h2>


            <p className="
              mb-5
              text-base
              leading-relaxed
              text-[#6B645E]
            ">
              {writing.fragment}
            </p>


            <div className="
              flex
              justify-between
              text-sm
              text-[#8B6F5C]
            ">

              <span>
                {writing.date}
              </span>


              <Link
                href={
                  writing.type === "letter"
                    ? `/letters/${writing.slug}`
                    : `/fragments/${writing.slug}`
                }
              >
                Read →
              </Link>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}