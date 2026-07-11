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
            .map((line, index) => {

              const text = line.trim();

              if (!text) {
                return (
                  <div
                    key={index}
                    className="h-4"
                  />
                );
              }


              const featuredLine = isFeaturedLine(text);


              if (featuredLine) {
                return (
                  <div
                    key={index}
                    className="
                      my-10
                      border-l-2
                      border-[#C8B8A5]
                      pl-5
                      md:pl-7
                    "
                  >
                    <p
                      className="
                        font-heading
                        font-bold
                        text-lg
                        leading-[1.7]
                        text-[#2E2A27]
                        md:text-xl
                      "
                    >
                      {text}
                    </p>
                  </div>
                );
              }


              return (
                <p
                  key={index}
                  className="
                    mb-2
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