const writings = [
    {
      title: "A Letter I Never Sent",
      category: "Love",
      excerpt:
        "Some words stay with us, not because they were forgotten, but because they were never spoken.",
    },
    {
      title: "The Days Between Dates",
      category: "Reflections",
      excerpt:
        "Some chapters of life are not endings or beginnings. They are the quiet spaces in between.",
    },
    {
      title: "Becoming Someone New",
      category: "Becoming",
      excerpt:
        "Growth is often invisible until one day we realize we are no longer who we used to be.",
    },
  ];
  
  export default function WritingPreview() {
    return (
      <section className="px-8 py-16">
  
        <div className="mx-auto max-w-5xl">
  
          <h2 className="mb-12 text-center text-4xl text-[#2E2A27]">
            Latest Writings
          </h2>
  
          <div className="grid gap-8 md:grid-cols-3">
  
            {writings.map((writing) => (
              <article
                key={writing.title}
                className="
                rounded-2xl
                bg-white
                p-8
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                hover:bg-[#EFE7DD]
                "
              >
  
                <p className="mb-4 text-sm text-[#8B6F5C]">
                  {writing.category}
                </p>
  
                <h3 className="mb-4 text-2xl text-[#2E2A27]">
                  {writing.title}
                </h3>
  
                <p className="leading-relaxed text-[#2E2A27]">
                  {writing.excerpt}
                </p>
  
              </article>
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  }