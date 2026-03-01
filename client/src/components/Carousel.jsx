import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * slides: Array<{ id, title, subtitle, ctaText?, image, packageId?, bg? }>
 * onViewImage: (slide) => void  (called when slide has no packageId and is clicked)
 */
export default function Carousel({ slides = [], interval = 4500, onViewImage }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = (idx) => {
    const next = (idx + slides.length) % slides.length;
    setIndex(next);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [index]);

  const startAuto = () => {
    stopAuto();
    if (slides.length > 1) {
      timerRef.current = setTimeout(next, interval);
    }
  };

  const stopAuto = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAuto();
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    startAuto();
  };

  const onSlideClick = (slide) => {
    if (onViewImage) onViewImage(slide);
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-lg bg-white"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
      >
        {slides.map((slide) => {
          const content = (
            <div
              key={slide.id}
              className="w-full shrink-0 h-full"
              role="group"
              aria-label={slide.title}
              onClick={() => onSlideClick(slide)}
            >
              <div
                className="h-full min-h-[220px] md:min-h-[280px] flex items-center"
                style={{
                  backgroundImage: slide.image
                    ? `linear-gradient(120deg, rgba(15, 118, 110, 0.35), rgba(14, 165, 233, 0.35)), url(${slide.image})`
                    : slide.bg || "linear-gradient(135deg, #e0f2fe, #ecfdf3)",
                  backgroundSize: slide.image ? "cover" : "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full p-6 md:p-10 backdrop-blur-[2px] bg-black/10 md:bg-black/5 flex items-center">
                  <div className="max-w-xl space-y-2 text-white drop-shadow">
                    <p className="text-xs uppercase tracking-wide font-semibold opacity-90">
                      {slide.tagline || "Health Check"}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold">{slide.title}</h3>
                    <p className="text-sm md:text-base opacity-90">{slide.subtitle}</p>
                    {slide.packageId && (
                      <span className="inline-flex items-center text-sm font-semibold text-white/90">
                        Tap to view package →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );

          return content;
        })}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              className={`h-2.5 rounded-full transition ${idx === index ? "w-6 bg-white shadow" : "w-2.5 bg-white/60 hover:bg-white"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
