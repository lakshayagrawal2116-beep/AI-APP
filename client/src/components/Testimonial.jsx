import React from "react";

const testimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
    text: "Radiant made undercutting all of our competitors an absolute breeze.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    text: "The AI tools are intuitive, fast, and genuinely improve productivity.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    text: "From resume reviews to image tools — everything just works.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Avery Johnson",
    handle: "@averywrites",
    text: "This platform feels like a real productivity upgrade.",
  },
];

const Testimonial = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white">
          Loved by creators worldwide
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Thousands of people use our AI tools every day to work faster and smarter.
        </p>
      </div>

      {/* Scrolling container */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#020617] to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#020617] to-transparent z-10" />

        {/* Moving track */}
        <div className="flex gap-6 animate-scroll px-6">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="
                min-w-[300px]
                max-w-[300px]
                bg-white/5 backdrop-blur-md
                border border-white/10
                rounded-xl
                p-6
                transition-all duration-300
                hover:-translate-y-1
                hover:border-white/20
                hover:shadow-[0_0_25px_rgba(99,102,241,0.12)]
              "
            >
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1">
                    {t.name}
                    <span className="text-indigo-400">✔</span>
                  </p>
                  <p className="text-xs text-gray-400">{t.handle}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
