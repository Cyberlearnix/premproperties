"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const defaultBanner = {
  type: "video",
  url: "https://videos.pexels.com/video-files/5752729/5752729-hd_1920_1080_25fps.mp4",
  title: "Find Your Dream Home",
  subtitle: "Luxury properties in prime locations"
};

// Accepts either a single banner object (legacy) or an array of banners (slideshow)
function normalizeBanners(input: any): any[] {
  if (Array.isArray(input) && input.length > 0) return input;
  if (input && typeof input === "object") return [input];
  return [defaultBanner];
}

export default function Hero({ banner: initialBanner }: { banner?: any }) {
  const [slides, setSlides] = useState(normalizeBanners(initialBanner));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchLive = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'company')
        .single();

      if (data && !error) {
        setSlides(normalizeBanners(data.data.banners?.home));
      }
    };
    fetchLive();
  }, []);

  // Auto-advance slides when there's more than one; resets whenever the slide changes
  // (manually or automatically) so users get a full interval before the next auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, index]);

  // Keep index in range if slides shrink
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides, index]);

  const currentBanner = slides[index] || defaultBanner;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* BACKGROUND */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`hero-slide-${index}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Lighter overlay for clarity */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          {currentBanner.type === "video" ? (
            <video
              key={currentBanner.url}
              src={currentBanner.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ objectPosition: currentBanner.position || "center" }}
            />
          ) : (
            <img
              src={currentBanner.url}
              alt={currentBanner.title || "Luxury Home"}
              className="w-full h-full object-cover"
              style={{ objectPosition: currentBanner.position || "center" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        <motion.div
          key={currentBanner.title + "-text"}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {currentBanner.tags && (
            <div className="flex gap-2 justify-center mb-6">
              {currentBanner.tags.split(",").map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <h1
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight"
            style={{ color: currentBanner.titleColor || "#FFFFFF" }}
          >
            {currentBanner.title}
          </h1>
          {currentBanner.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
              {currentBanner.subtitle}
            </p>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
        >
          <a
            href="#projects"
            className="inline-block px-12 py-4 bg-[var(--primary)] text-black font-bold text-lg rounded-sm hover:bg-white hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 uppercase tracking-widest"
          >
            Explore Projects
          </a>
        </motion.div>
      </div>

      {/* PREV / NEXT ARROWS */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--primary)] hover:text-black transition-colors"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--primary)] hover:text-black transition-colors text-xl"
          >
            ›
          </button>
        </>
      )}

      {/* SLIDE INDICATORS */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-[var(--primary)]" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      )}

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="text-[10px] uppercase tracking-widest text-white/80">Scroll</div>
        <div className="w-[1px] h-12 bg-white/50" />
      </div>
    </section>
  );
}
