"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  text,
}: {
  text: string;
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayText}
      <span className="ml-1 animate-pulse text-[#8B6F5C]">
        |
      </span>
    </span>
  );
}