
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

  const totalPages = pages.length;
  const currentPage = pages[page] ?? "";
  const progress = totalPages > 0 ? ((page + 1) / totalPages) * 100 : 0;

  const normalize = (value: string) =>
    value
      .replace(/[.,!?;"“”‘’]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const isFeaturedParagraph = (text: string) => {
    const normalizedText = normalize(text);

    return featured.some((item) => {
      const normalizedItem = normalize(item);

      return (
        normalizedText === normalizedItem ||
        normalizedText.includes(normalizedItem)
      );
    });
  };

  // Blank lines separate paragraphs.
  // Single line breaks remain inside the same paragraph.
  const paragraphs = currentPage
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const goPrevious = () => {
    setPage((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    setPage((current) => Math.min(current + 1, totalPages - 1));
  };

  if (totalPages === 0) {
    return (
      <div className="border-y border-black/20 py-16 text-center">
        <p className="text-sm text-[#765D4B]">
          This letter is not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">

      {/* READING PROGRESS */}
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
            Reading progress
          </span>

          <span className="text-[10px] tabular-nums text-black/50">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-[2px] w-full bg-black/10">
          <div
            className="h-full bg-[#765D4B] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* READING PAGE */}
      <div className="border-y border-black/25 bg-[#F1EBE2] px-6 py-12 sm:px-14 sm:py-20">

        {/* PAGE HEADER */}
        <div className="mb-14 flex items-center justify-between border-b border-black/15 pb-5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">
            Thoughts of Cee
          </span>

          <span className="text-[9px] uppercase tracking-[0.15em] text-black/45">
            Page {String(page + 1).padStart(2, "0")}
          </span>
        </div>

        {/* WRITING */}
        <div className="mx-auto min-h-[320px] max-w-[570px]">
          <div className="space-y-8 text-[16px] leading-[2] text-[#292522] sm:text-[17px] sm:leading-[2.05]">
            {paragraphs.map((paragraph, index) => {
              const featuredParagraph =
                isFeaturedParagraph(paragraph);

              if (featuredParagraph) {
                return (
                  <div
                    key={index}
                    className="my-12 border-l-2 border-[#765D4B] py-2 pl-5 sm:pl-7"
                  >
                    <p className="whitespace-pre-line text-[19px] font-semibold leading-[1.65] tracking-[-0.02em] text-black sm:text-[22px]">
                      {paragraph}
                    </p>
                  </div>
                );
              }

              return (
                <p
                  key={index}
                  className="whitespace-pre-line"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* PAGE FOOTER */}
        <div className="mt-16 flex items-center justify-between border-t border-black/15 pt-5">
          <span className="text-[9px] uppercase tracking-[0.18em] text-black/45">
            A collection of thoughts
          </span>

          <span className="text-[9px] uppercase tracking-[0.18em] text-[#765D4B]">
            {page + 1} of {totalPages}
          </span>
        </div>
      </div>

      {/* PAGE NAVIGATION */}
      <div className="mt-9 flex items-center justify-between">
        <button
          type="button"
          disabled={page === 0}
          onClick={goPrevious}
          className="border-b border-black/40 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-25"
        >
          ← Previous page
        </button>

        <span className="text-[10px] font-bold tabular-nums tracking-widest text-[#765D4B]">
          {String(page + 1).padStart(2, "0")} /{" "}
          {String(totalPages).padStart(2, "0")}
        </span>

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={goNext}
          className="border-b border-black/40 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-25"
        >
          Next page →
        </button>
      </div>
    </div>
  );
}
