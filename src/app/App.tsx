import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

import img0 from "@/imports/image.png";
import img1 from "@/imports/image-1.png";
import img2 from "@/imports/image-2.png";
import img3 from "@/imports/image-3.png";
import img4 from "@/imports/image-4.png";
import img5 from "@/imports/image-5.png";
import img6 from "@/imports/image-6.png";
import img7 from "@/imports/image-7.png";
import img8 from "@/imports/image-8.png";
import img9 from "@/imports/image-9.png";

gsap.registerPlugin(ScrollTrigger);

export interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  label: string;
  year: string;
  cat: "Portrait" | "Candid" | "Heritage" | "Edit";
  desc: string;
}

const PHOTOS: PhotoItem[] = [
  { id: 0, src: img0, alt: "Together", label: "Us", year: "2024", cat: "Portrait", desc: "A serene, quiet moment shared together in warm natural evening light." },
  { id: 1, src: img1, alt: "Candid wide", label: "Candid Glance", year: "2024", cat: "Candid", desc: "Spontaneous joy captured in an unscripted, genuine glance." },
  { id: 2, src: img2, alt: "Traditional attire", label: "Tradition & Grace", year: "2023", cat: "Heritage", desc: "Honoring timeless roots, culture, and traditional heritage attire." },
  { id: 3, src: img3, alt: "Smiling together", label: "Pure Joy", year: "2023", cat: "Portrait", desc: "Laughter and shared smiles that illuminate every room." },
  { id: 4, src: img4, alt: "Long Distance", label: "Miles Apart", year: "2023", cat: "Edit", desc: "Distance is just a test of how far love and memories can travel." },
  { id: 5, src: img5, alt: "Quiet moment", label: "Stillness", year: "2024", cat: "Candid", desc: "Peaceful silence amidst the noise of the bustling outside world." },
  { id: 6, src: img6, alt: "Her laughter", label: "Her Laughter", year: "2024", cat: "Candid", desc: "The purest, most unfiltered expression of genuine happiness." },
  { id: 7, src: img7, alt: "Shy moment", label: "Gentle Glance", year: "2024", cat: "Portrait", desc: "Soft, gentle emotions captured in a single quiet second." },
  { id: 8, src: img8, alt: "Together indoors", label: "Home & Heart", year: "2024", cat: "Portrait", desc: "Building a home and sanctuary wherever we are together." },
  { id: 9, src: img9, alt: "Selfie moment", label: "Us Again", year: "2024", cat: "Portrait", desc: "Preserving everyday memories side-by-side forever." },
];

const CATEGORIES = ["All", "Portrait", "Candid", "Heritage", "Edit"] as const;
const MARQUEE_ITEMS = ["MEMORIES", "·", "FULL-SIZE", "·", "FOREVER", "·", "CANDID", "·", "HERITAGE", "·", "PORTRAITS", "·"];

/* ─── Mobile Hook ───────────────────────────────────────────── */

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ─── Dynamic Dual-Ring / Touch Cursor ────────────────────── */

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const dot = dotRef.current;
    const circle = circleRef.current;
    if (!dot || !circle) return;

    let mx = -100, my = -100, cx = -100, cy = -100;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const tickFn = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      gsap.set(dot, { x: mx - 3, y: my - 3 });
      gsap.set(circle, { x: cx - 20, y: cy - 20 });
    };
    gsap.ticker.add(tickFn);

    const onEnter = () => gsap.to(circle, { scale: 1.8, opacity: 0.4, duration: 0.35, ease: "expo.out" });
    const onLeave = () => gsap.to(circle, { scale: 1, opacity: 0.8, duration: 0.35, ease: "expo.out" });
    const onMouseDown = () => gsap.to([dot, circle], { scale: 0.6, duration: 0.15 });
    const onMouseUp = () => gsap.to([dot, circle], { scale: 1, duration: 0.15 });

    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      gsap.ticker.remove(tickFn);
    };
  }, [isMobile]);

  if (isMobile) return null;
  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 z-[9999] pointer-events-none w-[6px] h-[6px] rounded-full" style={{ background: "#c9a0a6" }} />
      <div ref={circleRef} className="fixed top-0 left-0 z-[9998] pointer-events-none w-10 h-10 rounded-full" style={{ border: "1px solid rgba(201,160,166,0.6)", background: "rgba(201,160,166,0.03)", backdropFilter: "blur(2px)" }} />
    </>
  );
}

/* ─── Preloader ────────────────────────────────────────────── */

function Preloader({ onComplete }: { onComplete: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(wrapRef.current, {
            yPercent: -100, duration: 1.1, ease: "expo.inOut",
            onComplete,
          });
        },
      });
      tl.from([line1Ref.current, line2Ref.current], {
        yPercent: 110, opacity: 0, stagger: 0.12, duration: 0.9, ease: "expo.out",
      })
        .to(barRef.current, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, "-=0.4")
        .to(numRef.current, { textContent: 100, snap: { textContent: 1 }, duration: 1.5, ease: "power2.out" }, "<")
        .to([line1Ref.current, line2Ref.current, barRef.current], {
          opacity: 0, yPercent: -20, stagger: 0.06, duration: 0.5, ease: "expo.in",
        }, "+=0.2");
    }, wrapRef);
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[9000] flex flex-col items-start justify-end pb-16 px-8 md:px-16" style={{ background: "#080808" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span ref={numRef} className="select-none tabular-nums" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(5rem,18vw,16rem)", color: "rgba(240,236,230,0.06)", fontWeight: 900, lineHeight: 1 }}>0</span>
      </div>
      <div className="relative z-10 mb-8">
        <div style={{ overflow: "hidden" }}><div ref={line1Ref} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "#f0ece6", fontWeight: 400, fontStyle: "italic", lineHeight: 1.1 }}>Loading full size</div></div>
        <div style={{ overflow: "hidden" }}><div ref={line2Ref} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "#c9a0a6", fontWeight: 400, lineHeight: 1.1 }}>story…</div></div>
      </div>
      <div className="w-full max-w-xs h-px overflow-hidden" style={{ background: "rgba(240,236,230,0.08)" }}>
        <div ref={barRef} className="h-full origin-left scale-x-0" style={{ background: "#c9a0a6" }} />
      </div>
    </div>
  );
}

/* ─── Nav ──────────────────────────────────────────────────── */

function Nav({ onSelectCategory, activeCategory }: { onSelectCategory: (cat: string) => void; activeCategory: string }) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 md:px-12 transition-all duration-700"
      style={{
        height: scrolled ? "64px" : "80px",
        background: scrolled ? "rgba(8,8,8,0.92)" : "linear-gradient(to bottom, rgba(8,8,8,0.7) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(240,236,230,0.08)" : "1px solid transparent",
      }}
    >
      <div className="flex items-center gap-3" data-hover>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#f0ece6", fontStyle: "italic", letterSpacing: "0.1em" }}>
          Frames
        </span>
        <span className="text-[9px] px-2 py-0.5 rounded tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(201,160,166,0.15)", color: "#c9a0a6", border: "1px solid rgba(201,160,166,0.3)" }}>
          Full-Size
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-8">
        <span className="text-[10px] tracking-[0.2em] uppercase hidden sm:inline-block" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.35)" }}>Filter:</span>
        <div className="flex items-center gap-1.5 md:gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              data-hover
              onClick={() => onSelectCategory(cat)}
              className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] px-2.5 py-1 rounded transition-all duration-300"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: activeCategory === cat ? "#080808" : "rgba(240,236,230,0.65)",
                background: activeCategory === cat ? "#c9a0a6" : "rgba(240,236,230,0.05)",
                border: activeCategory === cat ? "1px solid #c9a0a6" : "1px solid rgba(240,236,230,0.08)",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero({ onOpenLightbox }: { onOpenLightbox: (photo: PhotoItem) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const h1aRef = useRef<HTMLDivElement>(null);
  const h1bRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const words = ["story.", "journey.", "moments.", "forever."];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(bgRef.current, { scale: 1.15, opacity: 0, duration: 2.4, ease: "expo.out" })
        .from(tagRef.current, { opacity: 0, y: 18, duration: 0.8 }, "-=1.6")
        .from([h1aRef.current, h1bRef.current], { yPercent: 110, stagger: 0.12, duration: 1.1, ease: "expo.out" }, "-=1.1")
        .from(subRef.current, { opacity: 0, y: 14, duration: 0.8 }, "-=0.6")
        .from(btnRef.current, { opacity: 0, y: 12, duration: 0.6 }, "-=0.4");

      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const el = wordRef.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: -120, opacity: 0, duration: 0.4, ease: "expo.in", onComplete: () => {
          setWordIdx(i => (i + 1) % words.length);
          gsap.fromTo(el, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "expo.out" });
        }
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={sectionRef} className="relative flex flex-col justify-end min-h-[100svh] pt-28 pb-16 px-6 md:px-12 overflow-hidden bg-background">
      {/* Background with Ambient Container so hero image is full-size complete */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden flex items-center justify-center bg-black/60 pointer-events-none" style={{ willChange: "transform" }}>
        <ImageWithFallback
          src={img0}
          alt="Hero"
          className="w-full h-full object-cover md:object-contain object-center scale-[1.03] filter brightness-[0.78]"
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 30%, rgba(8,8,8,0.85) 85%), linear-gradient(to bottom, rgba(8,8,8,0.4) 0%, transparent 40%, rgba(8,8,8,0.95) 90%)" }} />
      </div>

      <div className="relative z-10 max-w-6xl">
        <p ref={tagRef} className="text-[11px] uppercase tracking-[0.32em] mb-4 md:mb-6" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>
          Personal Collection · 10 Full-Size Photographs
        </p>
        <div className="mb-4">
          <div style={{ overflow: "hidden" }}>
            <div ref={h1aRef} className="leading-[0.92]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.8rem,11vw,9.5rem)", color: "#f0ece6", fontWeight: 400, letterSpacing: "-0.025em" }}>
              Our
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={h1bRef} className="leading-[0.92] flex items-baseline gap-3 md:gap-5 flex-wrap">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.8rem,11vw,9.5rem)", color: "#f0ece6", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.025em" }}>
                beautiful
              </span>
              <span style={{ overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }}>
                <span ref={wordRef} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5.5vw,4.8rem)", color: "#c9a0a6", fontWeight: 400, display: "inline-block", letterSpacing: "-0.02em" }}>
                  {words[wordIdx]}
                </span>
              </span>
            </div>
          </div>
        </div>
        <p ref={subRef} className="text-sm md:text-base max-w-xs md:max-w-md mt-6" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.55)", fontWeight: 300, lineHeight: 1.8 }}>
          Genuine moments, candid glances, and the quiet beauty of life presented in complete full-size clarity.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <button
            ref={btnRef}
            data-hover
            onClick={() => onOpenLightbox(PHOTOS[0])}
            className="px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center gap-3"
            style={{
              fontFamily: "'DM Mono', monospace",
              background: "#c9a0a6",
              color: "#080808",
              cursor: "pointer",
            }}
          >
            <span>Inspect Hero Photo</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Marquee ──────────────────────────────────────────────── */

function MarqueeStrip({ reverse = false, accent = false, speed = 45 }: { reverse?: boolean; accent?: boolean; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / 3;
    const tween = gsap.fromTo(el, { x: reverse ? -w : 0 }, { x: reverse ? 0 : -w, duration: w / speed, ease: "none", repeat: -1 });
    return () => { tween.kill(); };
  }, [reverse, speed]);

  return (
    <div className="overflow-hidden py-4 md:py-5" style={{ borderTop: "1px solid rgba(240,236,230,0.06)", borderBottom: "1px solid rgba(240,236,230,0.06)", background: "rgba(8,8,8,0.6)" }}>
      <div ref={trackRef} className="flex gap-7 whitespace-nowrap" style={{ willChange: "transform" }}>
        {items.map((w, i) => (
          <span key={i} className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase select-none" style={{ fontFamily: "'DM Mono', monospace", color: w === "·" ? "rgba(240,236,230,0.15)" : accent ? "rgba(201,160,166,0.7)" : "rgba(240,236,230,0.35)" }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Editorial Intro (Full-Size Image View) ───────────────── */

function EditorialIntro({ onOpenLightbox }: { onOpenLightbox: (photo: PhotoItem) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imgWrapRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          yPercent: 105, opacity: 0, duration: 1, delay: i * 0.1, ease: "expo.out",
          scrollTrigger: { trigger: textRef.current, start: "top 80%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const lines = ["Every photograph", "is a complete, unclipped", "moment of truth."];

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center max-w-[1600px] mx-auto">
      <div ref={textRef} className="order-2 md:order-1">
        <p className="text-[11px] uppercase tracking-[0.28em] mb-6" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>About this Collection</p>
        <div className="mb-8">
          {lines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <div ref={el => { lineRefs.current[i] = el; }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.2vw,3.8rem)", color: "#f0ece6", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.018em", fontStyle: i === 1 ? "italic" : "normal" }}>
                {line}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed max-w-sm mb-8" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.48)", fontWeight: 300 }}>
          Every single photograph in this collection is preserved in its complete full-size resolution and natural aspect ratio — without harsh cropping or cutoffs.
        </p>
        <button
          data-hover
          onClick={() => onOpenLightbox(PHOTOS[2])}
          className="inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase transition-all duration-300 hover:text-[#c9a0a6]"
          style={{ fontFamily: "'DM Mono', monospace", color: "#f0ece6", background: "none", border: "none", cursor: "pointer" }}
        >
          <span>View Heritage Photo (Full Size)</span>
          <span className="w-6 h-6 rounded-full flex items-center justify-center border border-[#c9a0a6]/40">→</span>
        </button>
      </div>

      <div
        ref={imgWrapRef}
        data-hover
        onClick={() => onOpenLightbox(PHOTOS[2])}
        className="order-1 md:order-2 relative overflow-hidden rounded-lg cursor-pointer group p-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(240,236,230,0.08)" }}
      >
        <div className="w-full flex items-center justify-center overflow-hidden rounded bg-black/40" style={{ minHeight: "360px", maxHeight: "600px" }}>
          <ImageWithFallback
            src={img2}
            alt="Heritage moment"
            className="max-w-full max-h-[580px] w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>Heritage · 2023</span>
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.4)" }}>Click for Lightbox ↗</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Responsive Horizontal Gallery (Works on ALL Devices) ─── */

function HorizontalGallery({ activeCategory, onOpenLightbox }: { activeCategory: string; onOpenLightbox: (photo: PhotoItem) => void }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const filteredPhotos = activeCategory === "All" ? PHOTOS : PHOTOS.filter(p => p.cat === activeCategory);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };
      const totalWidth = track.scrollWidth;
      const viewWidth = window.innerWidth;
      const scrollDistance = Math.max(0, totalWidth - viewWidth + (isMobile ? 40 : 120));

      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8,
        scrollTrigger: { trigger: outer, start: "top 85%" },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          pin: true,
          start: "top top",
          end: () => "+=" + scrollDistance,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      tl.to(track, { x: -scrollDistance, ease: "none" });
    });

    return () => mm.revert();
  }, [filteredPhotos.length]);

  return (
    <div ref={outerRef} className="relative overflow-hidden bg-background py-16">
      {/* Title Bar */}
      <div ref={titleRef} className="px-6 md:px-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>
            Complete Full-Size Archive ({filteredPhotos.length})
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.4rem)", color: "#f0ece6", fontWeight: 400 }}>
            The <em>Complete</em> Gallery
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.3)" }}>
            ← Scroll or Drag →
          </span>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex items-center gap-6 md:gap-8 px-6 md:px-12 py-4 whitespace-nowrap"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {filteredPhotos.map((p, i) => (
          <FullSizeCard key={p.id} photo={p} index={i} onOpenLightbox={onOpenLightbox} />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mx-6 md:mx-12 mt-10 h-[2px] bg-white/10 rounded overflow-hidden">
        <div ref={progressRef} className="h-full bg-[#c9a0a6] origin-left scale-x-0 transition-transform duration-100" />
      </div>
    </div>
  );
}

/* ─── Full-Size Gallery Card Component ────────────────────────── */

function FullSizeCard({ photo, index, onOpenLightbox }: { photo: PhotoItem; index: number; onOpenLightbox: (photo: PhotoItem) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(card, {
      rotateY: (x / rect.width) * 12,
      rotateX: (-y / rect.height) * 12,
      scale: 1.03,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    setHovered(false);
    gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      data-hover
      onClick={() => onOpenLightbox(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer group p-3 transition-shadow duration-500"
      style={{
        width: "clamp(270px, 75vw, 360px)",
        minHeight: "440px",
        background: "rgba(18,18,18,0.75)",
        border: hovered ? "1px solid rgba(201,160,166,0.6)" : "1px solid rgba(240,236,230,0.08)",
        backdropFilter: "blur(12px)",
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] px-2.5 py-1 rounded tracking-[0.18em] uppercase font-mono" style={{ background: "rgba(201,160,166,0.12)", color: "#c9a0a6", border: "1px solid rgba(201,160,166,0.25)" }}>
          {photo.cat}
        </span>
        <span className="text-[10px] tracking-[0.2em] font-mono text-white/40">
          0{index + 1} / 10
        </span>
      </div>

      {/* Image Container with Ambient Background to ensure FULL SIZE display without harsh cropping */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/60 py-2">
        <ImageWithFallback
          src={photo.src}
          alt={photo.alt}
          className="max-w-full max-h-[340px] w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-[1.04]"
          draggable={false}
        />
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at center, rgba(201,160,166,0.15) 0%, transparent 70%)" }} />
      </div>

      {/* Card Footer */}
      <div className="mt-3 px-1 flex items-end justify-between">
        <div>
          <span className="block text-[10px] tracking-[0.15em] font-mono text-white/40 mb-0.5">{photo.year}</span>
          <span className="block text-lg font-serif italic text-[#f0ece6]">{photo.label}</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#c9a0a6] group-hover:text-black transition-all duration-300">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Bento Grid (Full-Size Compositions) ───────────────────── */

function BentoGrid({ onOpenLightbox }: { onOpenLightbox: (photo: PhotoItem) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from(".bento-cell", {
        opacity: 0, y: 40, stagger: 0.1, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const bentoItems = [
    PHOTOS[1], PHOTOS[3], PHOTOS[5], PHOTOS[7], PHOTOS[4],
  ];

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32 max-w-[1600px] mx-auto">
      <div ref={titleRef} className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>Curated Layout</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.4rem)", color: "#f0ece6", fontWeight: 400 }}>
            Featured <em>Bento</em> Grid
          </h2>
        </div>
        <p className="text-sm max-w-xs text-white/40 font-light">
          Click any photograph to view in 100% full uncropped resolution modal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {bentoItems.map((photo) => (
          <div
            key={photo.id}
            data-hover
            onClick={() => onOpenLightbox(photo)}
            className="bento-cell relative flex flex-col justify-between overflow-hidden rounded-xl p-4 cursor-pointer group bg-stone-950/80 border border-white/10 hover:border-[#c9a0a6]/60 transition-all duration-500"
            style={{ minHeight: "360px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] px-2.5 py-1 rounded tracking-[0.18em] uppercase font-mono text-[#c9a0a6] bg-[#c9a0a6]/10 border border-[#c9a0a6]/20">
                {photo.cat}
              </span>
              <span className="text-[10px] tracking-[0.2em] font-mono text-white/40">
                {photo.year}
              </span>
            </div>

            {/* Complete Full-Size Container */}
            <div className="flex-1 w-full flex items-center justify-center bg-black/50 rounded-lg p-2 overflow-hidden">
              <ImageWithFallback
                src={photo.src}
                alt={photo.alt}
                className="max-w-full max-h-[280px] w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif italic text-[#f0ece6]">{photo.label}</h3>
                <p className="text-[11px] text-white/40 line-clamp-1 font-sans">{photo.desc}</p>
              </div>
              <span className="text-xs text-[#c9a0a6] font-mono group-hover:translate-x-1 transition-transform duration-300">↗</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Manifesto Section ─────────────────────────────────────── */

function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgImgRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          yPercent: 115, opacity: 0, duration: 1.1, delay: i * 0.12, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const verses = ["“A photograph", "is a pause button", "for life.”"];

  return (
    <section ref={sectionRef} className="relative flex items-center justify-center text-center overflow-hidden min-h-[90svh] py-20 px-6">
      <div ref={bgImgRef} className="absolute inset-0 flex items-center justify-center bg-black" style={{ willChange: "transform" }}>
        <ImageWithFallback src={img3} alt="Manifesto backdrop" className="w-full h-full object-cover opacity-30 filter blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/70 to-stone-950" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.32em] mb-8 font-mono text-[#c9a0a6]">
          On Photography
        </p>
        {verses.map((v, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div ref={el => { lineRefs.current[i] = el; }} className="leading-tight font-serif italic text-[#f0ece6]" style={{ fontSize: "clamp(2.2rem,5.5vw,5rem)" }}>
              {v}
            </div>
          </div>
        ))}
        <div style={{ overflow: "hidden" }}>
          <div ref={el => { lineRefs.current[3] = el; }} className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-[#c9a0a6]" />
            <span className="text-[11px] tracking-[0.24em] uppercase font-mono text-white/40">Full Resolution Preserved</span>
            <div className="h-px w-10 bg-[#c9a0a6]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Film Strip ───────────────────────────────────────────── */

function FilmStrip({ onOpenLightbox }: { onOpenLightbox: (photo: PhotoItem) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const strip = PHOTOS.slice(5, 10);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-2 font-mono text-[#c9a0a6]">Close-Up Moments</p>
          <h2 className="font-serif text-3xl md:text-5xl text-[#f0ece6]">The <em>Details</em></h2>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-white/30">05 Full-Size Frames</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {strip.map((photo) => (
          <div
            key={photo.id}
            data-hover
            onClick={() => onOpenLightbox(photo)}
            className="group relative flex flex-col justify-between p-3 rounded-lg bg-stone-900/60 border border-white/10 hover:border-[#c9a0a6]/60 transition-all duration-400 cursor-pointer"
            style={{ minHeight: "320px" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#c9a0a6]">{photo.cat}</span>
              <span className="text-[9px] font-mono text-white/30">{photo.year}</span>
            </div>

            {/* Complete Full-Size Container */}
            <div className="flex-1 w-full flex items-center justify-center bg-black/60 rounded p-2 overflow-hidden">
              <ImageWithFallback
                src={photo.src}
                alt={photo.label}
                className="max-w-full max-h-[220px] w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-2 text-center">
              <span className="block font-serif italic text-sm text-[#f0ece6]">{photo.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Stats ─────────────────────────────────────────────────── */

function Stats() {
  const items = [
    { value: "10", label: "Full-Size Photos" },
    { value: "2+", label: "Years Together" },
    { value: "100%", label: "Uncropped Quality" },
    { value: "∞", label: "Memories Made" },
  ];

  return (
    <section className="px-6 md:px-12 py-20 max-w-[1600px] mx-auto border-t border-white/10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(({ value, label }) => (
          <div key={label} className="flex flex-col">
            <span className="font-serif text-4xl md:text-6xl text-[#f0ece6] leading-none mb-2">{value}</span>
            <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-white/40">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Interactive Lightbox Modal (100% Full-Size Uncropped View) ─── */

function LightboxModal({
  photo,
  onClose,
  onPrev,
  onNext,
}: {
  photo: PhotoItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!photo) return;
    setZoomed(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);

    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [photo, onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[99999] flex flex-col justify-between p-4 md:p-8 bg-black/95 backdrop-blur-2xl text-white transition-opacity duration-300"
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c9a0a6] bg-[#c9a0a6]/10 px-3 py-1 rounded border border-[#c9a0a6]/30">
            {photo.cat}
          </span>
          <span className="text-xs font-mono text-white/40">
            {photo.id + 1} / {PHOTOS.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoomed(!zoomed)}
            className="text-xs font-mono tracking-wider px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
          >
            {zoomed ? "Reset Zoom (1x)" : "Zoom (1.8x)"}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Full-Size Image Frame */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-6 z-20 w-12 h-12 rounded-full bg-stone-900/80 border border-white/20 hover:bg-[#c9a0a6] hover:text-black flex items-center justify-center transition-all"
        >
          ←
        </button>

        {/* Complete Uncropped Image */}
        <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
          <img
            ref={imgRef}
            src={photo.src}
            alt={photo.alt}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain transition-transform duration-500 shadow-2xl rounded"
            style={{ transform: zoomed ? "scale(1.8)" : "scale(1)", cursor: zoomed ? "zoom-out" : "zoom-in" }}
            onClick={() => setZoomed(!zoomed)}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="absolute right-2 md:right-6 z-20 w-12 h-12 rounded-full bg-stone-900/80 border border-white/20 hover:bg-[#c9a0a6] hover:text-black flex items-center justify-center transition-all"
        >
          →
        </button>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 z-10">
        <div>
          <h2 className="font-serif text-2xl text-[#f0ece6] italic">{photo.label} ({photo.year})</h2>
          <p className="text-xs text-white/50 font-sans max-w-xl">{photo.desc}</p>
        </div>
        <div className="text-xs font-mono text-white/30">
          Use ← → Arrow Keys to Navigate · ESC to Close
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="px-6 md:px-12 pt-16 pb-10 border-t border-white/10 bg-stone-950">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-3 font-mono text-[#c9a0a6]">Frames — Full-Size Archive</p>
          <h2 className="font-serif text-3xl md:text-5xl text-[#f0ece6]">
            Every frame,<br /><em>complete & true.</em>
          </h2>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono text-white/50">
          <span>10 Photographs</span>
          <span>·</span>
          <span>100% Unclipped Quality</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono text-white/30">
        <span className="font-serif italic text-white/80">Frames</span>
        <span>© 2024–2026 · All memories reserved · Crafted with GSAP & Lenis</span>
      </div>
    </footer>
  );
}

/* ─── Main App ──────────────────────────────────────────────── */

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const rafCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCb);
    };
  }, [loaded]);

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const idx = PHOTOS.findIndex(p => p.id === activePhoto.id);
    const prevIdx = (idx - 1 + PHOTOS.length) % PHOTOS.length;
    setActivePhoto(PHOTOS[prevIdx]);
  };

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const idx = PHOTOS.findIndex(p => p.id === activePhoto.id);
    const nextIdx = (idx + 1) % PHOTOS.length;
    setActivePhoto(PHOTOS[nextIdx]);
  };

  return (
    <div style={{ background: "#080808", minHeight: "100svh", overflowX: "hidden", color: "#f0ece6" }}>
      <style>{`
        * { cursor: default; }
        @media (hover: hover) {
          *[data-hover] { cursor: pointer !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Preloader onComplete={handleLoaded} />

      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
        <Cursor />
        <Nav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        <main>
          <Hero onOpenLightbox={setActivePhoto} />
          <MarqueeStrip speed={45} />

          <EditorialIntro onOpenLightbox={setActivePhoto} />

          <MarqueeStrip reverse speed={35} accent />

          <HorizontalGallery activeCategory={activeCategory} onOpenLightbox={setActivePhoto} />

          <MarqueeStrip speed={55} />

          <BentoGrid onOpenLightbox={setActivePhoto} />

          <Manifesto />

          <FilmStrip onOpenLightbox={setActivePhoto} />

          <Stats />
        </main>

        <Footer />

        <LightboxModal
          photo={activePhoto}
          onClose={() => setActivePhoto(null)}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
        />
      </div>
    </div>
  );
}
