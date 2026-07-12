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

  console.log("FEATURED RECEIVED:", featured);

  const isFeaturedLine = (text: string) => {
    return featured.some(
      (item) =>
        text
          .replace(/[.,!?"]/g, "")
          .trim()
          .toLowerCase()
          .includes(
            item
              .replace(/[.,!?"]/g, "")
              .trim()
              .toLowerCase()
          )
    );
  };

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
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line, index) => {

              const featuredLine = isFeaturedLine(line);

              if (featuredLine) {
                return (
                  <div
                    key={index}
                    className="
                      my-8
                      border-l-2
                      border-[#C8B8A5]
                      pl-5
                      md:pl-7
                    "
                  >
                    <p
                      className="
                        font-heading
                        italic
                        text-lg
                        leading-[1.7]
                        text-[#2E2A27]
                        md:text-xl
                      "
                    >
                      {line}
                    </p>
                  </div>
                );
              }

              return (
                <p
                  key={index}
                  className="
                    mb-5
                    leading-[1.9]
                    text-[#2E2A27]
                  "
                >
                  {line}
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