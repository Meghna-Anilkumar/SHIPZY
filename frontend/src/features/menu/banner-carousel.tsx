// src/features/menu/banner-carousel.tsx
import { useEffect, useState } from "react";
import { Flame, Leaf, Sparkles } from "lucide-react";
import { HOME_BANNERS } from "@/models/banner.model";

const THEME_ICON = {
  spicy: Flame,
  healthy: Leaf,
  dessert: Sparkles,
} as const;

export const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HOME_BANNERS.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[480px] overflow-hidden rounded-3xl border border-[#e8d2bc] bg-gradient-to-br from-[#2b1d15] via-[#3c2a20] to-[#2b1d15] p-1 shadow-2xl md:h-[560px]">
      {HOME_BANNERS.map((slide, index) => {
        const ThemeIcon = THEME_ICON[slide.theme];
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 rounded-3xl transition-all duration-1000 ease-out ${
              index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative h-full overflow-hidden">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
              />

              {/* Unified Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 flex h-full items-end p-8 md:p-12 text-white">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[3px] text-orange-400">🔥 LIMITED TIME • TODAY ONLY</p>
                  <h1 className="mt-3 text-4xl font-bold leading-none tracking-tighter md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-4 max-w-md text-lg text-white/90">{slide.caption}</p>

                  <div className="mt-6 flex items-center gap-4">
                    <button className="rounded-full bg-[#f28705] px-8 py-3.5 font-semibold text-white transition-all hover:bg-[#e07600] active:scale-95">
                      Order Now →
                    </button>
                    <p className="text-3xl font-bold text-white">{slide.offer}</p>
                  </div>
                </div>

                <div className="ml-auto hidden h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md md:flex">
                  <ThemeIcon size={42} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HOME_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-12 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};