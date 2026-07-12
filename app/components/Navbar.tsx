"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full px-6 md:px-8 py-6 md:py-8">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between">

          <Link
            href="/"
            className="font-heading text-2xl md:text-3xl text-[#2E2A27]"
          >
            Thoughts of Cee
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm text-[#8B6F5C]">

            <Link href="/" className="transition hover:text-[#2E2A27]">
              Home
            </Link>

            <Link href="/writings" className="transition hover:text-[#2E2A27]">
              Library
            </Link>

            <Link href="/collections" className="transition hover:text-[#2E2A27]">
              Collections
            </Link>

            <Link href="/about" className="transition hover:text-[#2E2A27]">
              About
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#2E2A27]"
            aria-label="Toggle menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-6 flex flex-col gap-5 text-[#8B6F5C] md:hidden">

            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/writings" onClick={() => setOpen(false)}>
              Library
            </Link>

            <Link href="/collections" onClick={() => setOpen(false)}>
              Collections
            </Link>

            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}