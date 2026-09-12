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
    <section className="mt-16 px-6">
      <div className="mx-auto w-full max-w-5xl">

        {/* Section Heading */}
        <div className="mb-10 flex w-full flex-col items-center justify-center text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
            Some things stay with you
          </p>

          <h2 className="w-full text-center font-heading text-4xl text-[#2E2A27]">
            
          </h2>
        </div>

        {/* Videos */}
        <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory">
          {videos.map((video) => (
            <article
              key={video.src}
              className="w-[280px] flex-none snap-start sm:w-[320px]"
            >
              {/* Video */}
              <div className="aspect-[9/16] overflow-hidden rounded-sm bg-[#E5DDD4]">
                <video
                  src={video.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Title below video */}
              <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[#8B6F5C]">
                {video.title}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}