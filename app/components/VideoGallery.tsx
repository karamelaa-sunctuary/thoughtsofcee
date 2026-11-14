
"use client";

const videos = [
  {
    src: "/videos/never-ever.mp4",
    title: "Never Ever",
  },
  {
    src: "/videos/almost.mp4",
    title: "Almost",
  },
  {
    src: "/videos/accountability.mp4",
    title: "Accountability",
  },
  {
    src: "/videos/betrayal.mp4",
    title: "Betrayal",
  },
];

export default function VideoGallery() {
  return (
    <section className="bg-[#EAE4DB] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto w-full max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">
            Some things stay with you
          </p>

          <h2 className="max-w-4xl font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-4xl uppercase leading-[0.95] tracking-tight text-black sm:text-6xl md:text-7xl">
            The things we don't always say.
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-7 text-black sm:text-base">
            Some experiences leave us with more feelings than words.
            These are a few of those moments.
          </p>
        </div>

        {/* Video Gallery */}
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8">

          {videos.map((video, index) => (
            <article
              key={video.src}
              className="w-[260px] flex-none snap-start sm:w-[300px] md:w-[calc(25%-15px)]"
            >
              {/* Video */}
              <div className="aspect-[9/16] overflow-hidden bg-[#D8CEC2]">
                <video
                  src={video.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Video Title */}
              <div className="mt-5 flex items-center justify-between border-b border-black/30 pb-4">
                <h3 className="font-[Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif] text-xl uppercase tracking-tight text-black sm:text-2xl">
                  {video.title}
                </h3>

                <span className="text-[10px] font-bold tracking-widest text-[#765D4B]">
                  0{index + 1}
                </span>
              </div>
            </article>
          ))}

        </div>

        {/* Bottom Note */}
        <div className="mt-6 flex items-center justify-between border-t border-black/20 pt-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/60">
            Thoughts of Cee
          </p>

          <p className="text-[9px] uppercase tracking-[0.2em] text-black/60">
            Moments in words and motion
          </p>
        </div>

      </div>
    </section>
  );
}
