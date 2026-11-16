
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Letters", href: "/letters" },
  { label: "Fragments", href: "/fragments" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/20 bg-[#EAE4DB]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex flex-col"
          aria-label="Thoughts of Cee home"
        >
         
<span
  aria-label="Thoughts of Cee"
  className="flex items-center gap-2.5"
>
  <span className="h-3 w-3 rounded-full bg-black" />
  <span className="h-3 w-3 rounded-full bg-black" />
  <span className="h-3 w-3 rounded-full bg-black" />
</span>

        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-50 ${
                  active ? "text-black" : "text-black/60"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#765D4B]" />
                )}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black md:hidden"
        >
          {open ? "Close" : "Menu"}
          <span className="text-xl leading-none">
            {open ? "×" : "+"}
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/20 px-6 py-8 md:hidden">
          <div className="flex flex-col gap-7">
            {links.map((link, index) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-5 font-[Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] text-3xl uppercase tracking-tight transition-opacity hover:opacity-50 ${
                    active ? "text-black" : "text-black/50"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-widest text-[#765D4B]">
                    0{index + 1}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
