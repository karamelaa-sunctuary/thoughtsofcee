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

  const currentPage = pages[page] ?? "";

  const isFeaturedLine = (text: string) => {
    const normalize = (value: string) =>
      value
        .replace(/[.,!?"]/g, "")
        .trim()
        .toLowerCase();

    const normalizedText = normalize(text);

    return featured.some((item) => {
      const normalizedItem = normalize(item);

      return (
        normalizedText.includes(normalizedItem) ||
        normalizedItem.includes(normalizedText)
      );
    });
  };

  const lines = currentPage
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const goPrevious = () => {
    setPage((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    setPage((current) =>
      Math.min(current + 1, pages.length - 1)
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        className="
          rounded-sm
          border
          border-[#E8DED2]
          bg-[#FDF9F2]
          px-7
          py-8
          shadow-xl
          sm:px-10
          sm:py-10
        "
      >
        <div
          className="
            text-[15px]
            leading-[1.7]
            text-[#2E2A27]
            md:text-[16px]
          "
        >
          {lines.map((line, index) => {
            const featuredLine = isFeaturedLine(line);

            if (featuredLine) {
              return (
                <div
                  key={index}
                  className="
                    my-6
                    border-l-2
                    border-[#C8B8A5]
                    pl-5
                  "
                >
                  <p
                    className="
                      font-heading
                      text-lg
                      font-bold
                      leading-[1.5]
                      text-[#2E2A27]
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
                  mb-3
                  text-[15px]
                  leading-[1.7]
                  text-[#2E2A27]
                  md:text-[16px]
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
          type="button"
          disabled={page === 0}
          onClick={goPrevious}
          className="
            transition
            hover:text-[#2E2A27]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          ← Previous
        </button>

        <span>
          {page + 1} / {pages.length}
        </span>

        <button
          type="button"
          disabled={page >= pages.length - 1}
          onClick={goNext}
          className="
            transition
            hover:text-[#2E2A27]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          Next →
        </button>
      </div>
    </div>
  );
}