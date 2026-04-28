import { useEffect, useState } from "react";
import { Flame, Leaf, Sparkles } from "lucide-react";
import { HOME_BANNERS } from "@/models/banner.model";

const THEME_ICON = {
  spicy: Flame,
  healthy: Leaf,
  dessert: Sparkles
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
    <section className="relative overflow-hidden rounded-2xl border border-[#f0d8c2] bg-white p-1 shadow-[0_12px_30px_rgba(53,28,11,0.14)]">
      {HOME_BANNERS.map((slide, index) => {
        const ThemeIcon = THEME_ICON[slide.theme];
        return (
          <div
            key={slide.id}
            className={`overflow-hidden rounded-xl transition-all duration-700 ${
              index === activeIndex ? "relative opacity-100" : "absolute inset-1 opacity-0"
            }`}
          >
            <div className="relative h-[320px] bg-[#2b1d15] md:h-[420px]">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="animate-banner-zoom absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="flex h-full items-end justify-between gap-3 bg-gradient-to-r from-black/65 via-black/40 to-black/10 p-5 text-white md:p-7">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/85">Limited Time Offer</p>
                  <h2 className="mt-1 text-2xl font-bold md:text-4xl">{slide.title}</h2>
                  <p className="mt-2 max-w-xl text-sm text-white/90 md:text-base">{slide.caption}</p>
                  <p className="mt-3 inline-flex rounded-full bg-[#f28705] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {slide.offer}
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                  <ThemeIcon size={22} />
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-3 flex justify-center gap-2 pb-1">
        {HOME_BANNERS.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show banner ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-[#f28705]" : "w-2.5 bg-[#d5b79b]"}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};
