"use client";

import { useState } from "react";

export default function BookReader({
  pages,
  featured = [],
}: {
  pages: string[];
  featured?: string[];
}) {
  const [page, setPage] = useState(0);

  return (
    <div className="mx-auto w-full max-w-3xl">

      <div
        className="
          min-h-[520px]
          rounded-sm
          border
          border-[#E8DED2]
          bg-[#FDF9F2]
          shadow-xl
          px-7
          py-8
          sm:px-10
          sm:py-10
        "
      >

        <div
          className="
            text-[15px]
            leading-[1.85]
            text-[#2E2A27]
            md:text-[16px]
          "
        >

          {pages[page]
            .split(/\n\s*\n/)
            .map((paragraph, index) => {

                const text = paragraph.trim();

              if (!text) return null;

              const isFeatured = featured.some(
                (item) =>
                  text
                    .replace(/[.,!?]/g, "")
                    .trim()
                    .toLowerCase()
                    .includes(
                      item
                        .replace(/[.,!?]/g, "")
                        .trim()
                        .toLowerCase()
                    )
              );

              if (isFeatured) {
                return (
                  <div
                    key={index}
                    className="my-12"
                  >

                    <div className="mb-8 flex justify-center">
                      <div className="h-px w-24 bg-[#D9CEC0]" />
                    </div>

                    <p
                      className="
                        text-center
                        font-heading
                        text-xl
                        leading-[1.8]
                        text-[#2E2A27]
                        md:text-2xl
                      "
                    >
                      {text}
                    </p>

                    <div className="mt-8 flex justify-center">
                      <div className="h-px w-24 bg-[#D9CEC0]" />
                    </div>

                  </div>
                );
              }

              return (
                <p
                  key={index}
                  className="
                    mb-5
                    whitespace-pre-line
                    text-[15px]
                    leading-[1.85]
                    text-[#2E2A27]
                    md:text-[16px]
                  "
                >
                  {text}
                </p>
              );
            })}

        </div>

      </div>


      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          text-xs
          uppercase
          tracking-[0.2em]
          text-[#8B6F5C]
        "
      >

        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="
            transition
            hover:text-[#2E2A27]
            disabled:opacity-30
          "
        >
          ← Previous
        </button>


        <span>
          {page + 1} / {pages.length}
        </span>


        <button
          disabled={page === pages.length - 1}
          onClick={() => setPage(page + 1)}
          className="
            transition
            hover:text-[#2E2A27]
            disabled:opacity-30
          "
        >
          Next →
        </button>

      </div>

    </div>
  );
}