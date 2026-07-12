"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-[#E5DDD4] bg-[#F8F5F0]">
      <div
        className="
          mx-auto
          flex
          max-w-6xl
          items-center
          justify-between
          px-6
          py-6
        "
      >

        {/* Logo */}

        <Link
          href="/"
          className="
            font-heading
            text-2xl
            text-[#2E2A27]
          "
        >
          Cee
        </Link>


        {/* Desktop Navigation */}

        <div
          className="
            hidden
            items-center
            gap-8
            text-sm
            text-[#8B6F5C]
            md:flex
          "
        >

          <Link
            href="/"
            className="transition hover:text-[#2E2A27]"
          >
            Home
          </Link>


          <Link
            href="/letters"
            className="transition hover:text-[#2E2A27]"
          >
            Letters
          </Link>


          <Link
            href="/fragments"
            className="transition hover:text-[#2E2A27]"
          >
            Fragments
          </Link>


          <Link
            href="/about"
            className="transition hover:text-[#2E2A27]"
          >
            About
          </Link>

        </div>


        {/* Mobile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="
            text-sm
            text-[#8B6F5C]
            md:hidden
          "
        >
          Menu
        </button>

      </div>


      {/* Mobile Navigation */}

      {open && (

        <div
          className="
            flex
            flex-col
            gap-6
            border-t
            border-[#E5DDD4]
            px-6
            py-8
            text-sm
            text-[#8B6F5C]
            md:hidden
          "
        >

          <Link
            href="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>


          <Link
            href="/letters"
            onClick={() => setOpen(false)}
          >
            Letters
          </Link>


          <Link
            href="/fragments"
            onClick={() => setOpen(false)}
          >
            Fragments
          </Link>


          <Link
            href="/about"
            onClick={() => setOpen(false)}
          >
            About
          </Link>

        </div>

      )}

    </nav>
  );
}