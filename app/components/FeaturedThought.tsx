export default function FeaturedThought() {
    return (
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
  
          <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
            A thought for today
          </p>
  
          <div className="border-y border-[#E5DDD4] py-12">
  
            <h2 className="mb-8 font-heading text-4xl leading-relaxed text-[#2E2A27]">
              "Some feelings don't need to be solved.
              <br />
              Sometimes they just need somewhere safe to exist."
            </h2>
  
            <a
              href="/letters/a-letter-i-never-sent"
              className="text-sm uppercase tracking-[0.2em] text-[#8B6F5C] transition hover:text-[#2E2A27]"
            >
              Read this thought →
            </a>
  
          </div>
  
        </div>
      </section>
    );
  }