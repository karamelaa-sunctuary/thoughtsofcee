import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-8 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">

        <Link
          href="/"
          className="font-heading text-3xl text-[#2E2A27]"
        >
          Thoughts of Cee
        </Link>


        <div className="flex gap-8 text-sm text-[#8B6F5C]">

          <Link
            href="/"
            className="transition hover:text-[#2E2A27]"
          >
            Home
          </Link>

          <Link
            href="/writings"
            className="transition hover:text-[#2E2A27]"
          >
            Library
          </Link>

          <Link
            href="/collections"
            className="transition hover:text-[#2E2A27]"
          >
            Collections
          </Link>

          <Link
            href="/about"
            className="transition hover:text-[#2E2A27]"
          >
            About
          </Link>

        </div>

      </div>
    </nav>
  );
}