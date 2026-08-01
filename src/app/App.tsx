import { useEffect, useRef, useState, useCallback } from "react";
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

const PHOTOS = [
  { src: img0, alt: "Together", label: "Us", year: "2024", cat: "Portrait", desc: "A serene, quiet moment shared together in warm evening light." },
  { src: img1, alt: "Candid wide", label: "Candid", year: "2024", cat: "Candid", desc: "Spontaneous joy captured in an unscripted glance." },
  { src: img2, alt: "Traditional attire", label: "Tradition", year: "2023", cat: "Heritage", desc: "Honoring timeless roots and traditional elegance." },
  { src: img3, alt: "Smiling together", label: "Joy", year: "2023", cat: "Portrait", desc: "Laughter and shared smiles that illuminate every room." },
  { src: img4, alt: "Long Distance", label: "Miles Apart", year: "2023", cat: "Edit", desc: "Distance is just a test of how far love can travel." },
  { src: img5, alt: "Quiet moment", label: "Still", year: "2024", cat: "Candid", desc: "Peaceful silence amidst the world's noise." },
  { src: img6, alt: "Her laughter", label: "Laughter", year: "2024", cat: "Candid", desc: "The purest expression of genuine happiness." },
  { src: img7, alt: "Shy moment", label: "Shy", year: "2024", cat: "Portrait", desc: "Gentle emotions captured in a glance." },
  { src: img8, alt: "Together indoors", label: "Home", year: "2024", cat: "Portrait", desc: "Sanctuary created wherever we are together." },
  { src: img9, alt: "Selfie moment", label: "Us Again", year: "2024", cat: "Portrait", desc: "Preserving everyday memories side-by-side." },
];

const MARQUEE_ITEMS = ["MEMORIES", "·", "MOMENTS", "·", "FOREVER", "·", "LOVE", "·", "CANDID", "·", "STORIES", "·"];

/* ─── Helpers ──────────────────────────────────────────────── */

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

/* ─── Cursor ───────────────────────────────────────────────── */

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
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      gsap.set(dot, { x: mx - 3, y: my - 3 });
      gsap.set(circle, { x: cx - 18, y: cy - 18 });
    };
    gsap.ticker.add(tickFn);

    const onEnter = () => gsap.to(circle, { scale: 1.8, opacity: 0.35, duration: 0.35, ease: "expo.out" });
    const onLeave = () => gsap.to(circle, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out" });
    const onMouseDown = () => gsap.to([dot, circle], { scale: 0.7, duration: 0.15 });
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
      <div ref={circleRef} className="fixed top-0 left-0 z-[9998] pointer-events-none w-9 h-9 rounded-full" style={{ border: "1px solid rgba(201,160,166,0.55)" }} />
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
            yPercent: -100, duration: 1, ease: "expo.inOut",
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
    <div ref={wrapRef} className="fixed inset-0 z-[9000] flex flex-col items-start justify-end pb-16 px-10 md:px-16" style={{ background: "#080808" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span ref={numRef} className="select-none tabular-nums" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(5rem,18vw,16rem)", color: "rgba(240,236,230,0.06)", fontWeight: 900, lineHeight: 1 }}>0</span>
      </div>
      <div className="relative z-10 mb-8">
        <div style={{ overflow: "hidden" }}><div ref={line1Ref} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "#f0ece6", fontWeight: 400, fontStyle: "italic", lineHeight: 1.1 }}>Loading your</div></div>
        <div style={{ overflow: "hidden" }}><div ref={line2Ref} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "#c9a0a6", fontWeight: 400, lineHeight: 1.1 }}>story…</div></div>
      </div>
      <div className="w-full max-w-xs h-px overflow-hidden" style={{ background: "rgba(240,236,230,0.08)" }}>
        <div ref={barRef} className="h-full origin-left scale-x-0" style={{ background: "#c9a0a6" }} />
      </div>
    </div>
  );
}

/* ─── Nav ──────────────────────────────────────────────────── */

function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-8 md:px-12 transition-all duration-700"
      style={{
        height: scrolled ? "64px" : "80px",
        background: scrolled ? "rgba(8,8,8,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(240,236,230,0.06)" : "1px solid transparent",
      }}
    >
      <span data-hover style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#f0ece6", fontStyle: "italic", letterSpacing: "0.12em" }}>
        Frames
      </span>
      <div className="flex items-center gap-6 md:gap-10">
        {["Gallery", "Story", "Contact"].map(n => (
          <button key={n} data-hover className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-50" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.7)", background: "none", border: "none", cursor: "pointer" }}>{n}</button>
        ))}
      </div>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const h1aRef = useRef<HTMLDivElement>(null);
  const h1bRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const words = ["story.", "journey.", "moments.", "forever."];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(bgRef.current, { scale: 1.12, duration: 2.2, ease: "expo.out" })
        .from(tagRef.current, { opacity: 0, y: 16, duration: 0.8 }, "-=1.4")
        .from([h1aRef.current, h1bRef.current], { yPercent: 110, stagger: 0.12, duration: 1.1, ease: "expo.out" }, "-=1.0")
        .from(subRef.current, { opacity: 0, y: 14, duration: 0.8 }, "-=0.6")
        .from(scrollIndRef.current, { opacity: 0, duration: 0.6 }, "-=0.3");

      gsap.to(bgRef.current, {
        yPercent: 22,
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
      gsap.to(el, { yPercent: -115, opacity: 0, duration: 0.42, ease: "expo.in", onComplete: () => {
        setWordIdx(i => (i + 1) % words.length);
        gsap.fromTo(el, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "expo.out" });
      }});
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={sectionRef} className="relative flex flex-col justify-end" style={{ height: "100svh", minHeight: "600px" }}>
      {/* Full-size complete aspect container */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden flex items-center justify-center bg-black/60" style={{ willChange: "transform" }}>
        <ImageWithFallback src={img0} alt="Hero" className="w-full h-full object-cover md:object-contain object-top" style={{ marginTop: "-2%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.05) 30%, rgba(8,8,8,0.6) 70%, rgba(8,8,8,0.97) 100%)" }} />
      </div>

      <div className="relative z-10 px-8 md:px-12 pb-16 md:pb-20 max-w-6xl">
        <p ref={tagRef} className="text-[11px] uppercase tracking-[0.32em] mb-6 md:mb-8" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>
          A Personal Collection · 2023–2024
        </p>
        <div className="mb-4">
          <div style={{ overflow: "hidden" }}>
            <div ref={h1aRef} className="leading-[0.92]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(4rem,11vw,9.5rem)", color: "#f0ece6", fontWeight: 400, letterSpacing: "-0.025em" }}>
              Our
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={h1bRef} className="leading-[0.92] flex items-baseline gap-4 flex-wrap">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(4rem,11vw,9.5rem)", color: "#f0ece6", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.025em" }}>
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
        <p ref={subRef} className="text-sm max-w-xs md:max-w-sm mt-6 cursor-pointer" onClick={() => onOpenLightbox(PHOTOS[0])} style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.55)", fontWeight: 300, lineHeight: 1.85, letterSpacing: "0.01em" }}>
          Genuine moments, candid glances, and the quiet beauty of two lives woven together.
        </p>
      </div>

      <div ref={scrollIndRef} className="absolute bottom-10 right-10 z-10 hidden md:flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.28)", writingMode: "vertical-rl" }}>scroll</span>
        <div className="w-px h-14 overflow-hidden" style={{ background: "rgba(240,236,230,0.1)" }}>
          <div className="w-full" style={{ height: "50%", background: "#c9a0a6", animation: "scrollLine 1.6s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── Marquee ──────────────────────────────────────────────── */

function MarqueeStrip({ reverse = false, accent = false, speed = 50 }: { reverse?: boolean; accent?: boolean; speed?: number }) {
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
    <div className="overflow-hidden py-4 md:py-5" style={{ borderTop: "1px solid rgba(240,236,230,0.06)", borderBottom: "1px solid rgba(240,236,230,0.06)" }}>
      <div ref={trackRef} className="flex gap-7 whitespace-nowrap" style={{ willChange: "transform" }}>
        {items.map((w, i) => (
          <span key={i} className="text-[10px] tracking-[0.3em] uppercase select-none" style={{ fontFamily: "'DM Mono', monospace", color: w === "·" ? "rgba(240,236,230,0.15)" : accent ? "rgba(201,160,166,0.6)" : "rgba(240,236,230,0.3)" }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Editorial Intro ──────────────────────────────────────── */

function EditorialIntro({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imgWrapRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.to(imgInnerRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          yPercent: 105, opacity: 0, duration: 1, delay: i * 0.1, ease: "expo.out",
          scrollTrigger: { trigger: textRef.current, start: "top 78%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const lines = ["Every photograph", "is a secret about a", "secret."];

  return (
    <section ref={sectionRef} className="px-8 md:px-12 py-24 md:py-36 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center max-w-[1600px] mx-auto">
      <div ref={textRef} className="order-2 md:order-1">
        <p className="text-[11px] uppercase tracking-[0.28em] mb-8 md:mb-12" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>About this Collection</p>
        <div className="mb-8">
          {lines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <div ref={el => { lineRefs.current[i] = el; }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,4.5vw,4rem)", color: "#f0ece6", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.018em", fontStyle: i === 1 ? "italic" : "normal" }}>
                {line}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.5)", fontWeight: 300 }}>
          This collection captures 10 genuine photographs — unposed, unrehearsed, and deeply personal. From traditional celebrations to quiet everyday moments.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px w-12" style={{ background: "#c9a0a6" }} />
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.4)" }}>10 Photographs · 2023–2024</span>
        </div>
      </div>

      <div
        ref={imgWrapRef}
        data-hover
        onClick={() => onOpenLightbox(PHOTOS[2])}
        className="order-1 md:order-2 relative overflow-hidden aspect-[3/4] rounded-lg cursor-pointer bg-black/40 p-2"
        style={{ clipPath: "inset(0% 0% 0% 0%)", border: "1px solid rgba(240,236,230,0.08)" }}
      >
        <div ref={imgInnerRef} className="absolute inset-0 flex items-center justify-center scale-[1.1]" style={{ willChange: "transform" }}>
          <ImageWithFallback src={img2} alt="Traditional moment" className="w-full h-full object-cover md:object-contain" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom right, transparent 60%, rgba(8,8,8,0.5) 100%)" }} />
        <div className="absolute bottom-6 left-6">
          <span className="text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>Heritage · 2023</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Responsive GSAP Horizontal Gallery (ALL DEVICES) ───────── */

function HorizontalGallery({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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
      const scrollDistance = track.scrollWidth - window.innerWidth + (isMobile ? 40 : 160);

      gsap.from(titleRef.current, {
        opacity: 0, y: 30, duration: 0.8,
        scrollTrigger: { trigger: outer, start: "top 80%" },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          pin: true,
          start: "top top",
          end: () => "+=" + scrollDistance,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, { x: -scrollDistance, ease: "none" });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={outerRef} className="relative overflow-hidden bg-background">
      <div ref={titleRef} className="absolute top-0 left-0 px-8 md:px-12 pt-16 z-10 flex items-end justify-between w-full pr-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>All Photographs</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", color: "#f0ece6", fontWeight: 400 }}>The <em>Complete</em> Set</h2>
        </div>
        <span className="text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.35)" }}>← drag · scroll →</span>
      </div>

      <div
        ref={trackRef}
        className="flex items-center gap-4 md:gap-6 pt-36 pb-12 px-8 md:px-12 whitespace-nowrap"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {PHOTOS.map((p, i) => (
          <HGalleryCard key={i} photo={p} index={i} onOpenLightbox={onOpenLightbox} />
        ))}
        <div className="flex-shrink-0 w-16 md:w-20" />
      </div>
    </div>
  );
}

function HGalleryCard({ photo, index, onOpenLightbox }: { photo: typeof PHOTOS[0]; index: number; onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const heights = [520, 440, 580, 460, 500, 420, 560, 440, 520, 480];
  const widths = [320, 260, 340, 280, 300, 260, 320, 280, 310, 290];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(card, {
      rotateY: (x / rect.width) * 10,
      rotateX: (-y / rect.height) * 10,
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
      className="relative flex-shrink-0 overflow-hidden rounded-lg bg-stone-900/60 p-2 cursor-pointer transition-shadow duration-500"
      style={{
        width: `${widths[index]}px`,
        height: `${heights[index]}px`,
        maxWidth: "85vw",
        border: hovered ? "1px solid rgba(201,160,166,0.6)" : "1px solid rgba(240,236,230,0.08)",
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <ImageWithFallback
        src={photo.src}
        alt={photo.alt}
        className="w-full h-full object-cover md:object-contain rounded transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1.0)", willChange: "transform" }}
        draggable={false}
      />
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.88) 0%, transparent 55%)", opacity: hovered ? 1 : 0.45 }} />
      <div className="absolute top-4 left-4 transition-all duration-400" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-8px)" }}>
        <span className="text-[10px] px-2.5 py-1.5 tracking-[0.15em] uppercase font-mono" style={{ color: "#c9a0a6", background: "rgba(8,8,8,0.75)", backdropFilter: "blur(10px)" }}>
          {photo.cat}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500" style={{ transform: hovered ? "translateY(0)" : "translateY(10px)", opacity: hovered ? 1 : 0.7 }}>
        <span className="block text-[11px] mb-1.5 font-mono" style={{ color: "rgba(240,236,230,0.5)", letterSpacing: "0.12em" }}>{photo.year}</span>
        <span className="block text-xl font-serif italic" style={{ color: "#f0ece6", fontWeight: 400 }}>{photo.label}</span>
      </div>
      <div className="absolute top-4 right-4 transition-all duration-400" style={{ opacity: hovered ? 1 : 0 }}>
        <span className="text-[11px] tracking-widest font-mono" style={{ color: "rgba(240,236,230,0.5)" }}>0{index + 1}</span>
      </div>
    </div>
  );
}

/* ─── Feature Photos ───────────────────────────────────────── */

function FeaturePhoto({ photo, quote, label, year, reverse = false, onOpenLightbox }: {
  photo: string;
  quote: string;
  label: string;
  year: string;
  reverse?: boolean;
  onOpenLightbox: (photo: typeof PHOTOS[0]) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sentences = quote.split("|");
  const matchedPhoto = PHOTOS.find(p => p.src === photo) || PHOTOS[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imgWrapRef.current, {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 1.6,
        ease: "expo.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
      gsap.to(imgRef.current, {
        yPercent: -16,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          yPercent: 110, opacity: 0, duration: 1.1, delay: i * 0.12, ease: "expo.out",
          scrollTrigger: { trigger: textRef.current, start: "top 80%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-8 md:px-12 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-center max-w-[1600px] mx-auto">
      <div
        ref={imgWrapRef}
        data-hover
        onClick={() => onOpenLightbox(matchedPhoto)}
        className={`relative overflow-hidden aspect-[3/4] rounded-lg cursor-pointer bg-black/40 p-2 ${reverse ? "md:order-2" : "md:order-1"}`}
        style={{ clipPath: "inset(0% 0% 0% 0%)", border: "1px solid rgba(240,236,230,0.08)" }}
      >
        <div ref={imgRef} className="absolute inset-0 flex items-center justify-center scale-[1.22]" style={{ willChange: "transform" }}>
          <ImageWithFallback src={photo} alt={label} className="w-full h-full object-cover md:object-contain" />
        </div>
      </div>
      <div ref={textRef} className={`${reverse ? "md:order-1" : "md:order-2"}`}>
        <p className="text-[11px] uppercase tracking-[0.28em] mb-8 font-mono" style={{ color: "#c9a0a6" }}>{label} · {year}</p>
        <div className="mb-8">
          {sentences.map((s, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <div ref={el => { lineRefs.current[i] = el; }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.8vw,3.4rem)", color: "#f0ece6", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.015em", fontStyle: i % 2 === 1 ? "italic" : "normal" }}>
                {s}
              </div>
            </div>
          ))}
        </div>
        <div className="h-px max-w-[200px]" style={{ background: "rgba(240,236,230,0.1)" }} />
      </div>
    </section>
  );
}

/* ─── Bento Grid ───────────────────────────────────────────── */

function BentoGrid({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          yPercent: 110, opacity: 0, duration: 1, delay: i * 0.1, ease: "expo.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 82%" },
        });
      });
      gsap.from(".bento-cell", {
        opacity: 0, scale: 0.96, y: 40, stagger: { amount: 0.6, from: "random" }, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const bentoItems = [
    { src: img1, alt: "Candid", label: "Candid", span: "col-span-1 md:col-span-1 row-span-2", photo: PHOTOS[1] },
    { src: img3, alt: "Joy", label: "Joy", span: "col-span-1 row-span-1", photo: PHOTOS[3] },
    { src: img5, alt: "Still", label: "Still", span: "col-span-1 row-span-1", photo: PHOTOS[5] },
    { src: img7, alt: "Shy", label: "Shy", span: "col-span-1 md:col-span-1 row-span-2", photo: PHOTOS[7] },
    { src: img4, alt: "Miles Apart", label: "Long Distance", span: "col-span-1 md:col-span-2 row-span-1", photo: PHOTOS[4] },
  ];

  return (
    <section ref={sectionRef} className="px-8 md:px-12 py-24 md:py-36">
      <div ref={titleRef} className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-3 font-mono" style={{ color: "#c9a0a6" }}>Selected Works</p>
          <div>
            {["Captured in", "Light"].map((l, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <div ref={el => { lineRefs.current[i] = el; }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,4.5vw,4rem)", color: "#f0ece6", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.018em", fontStyle: i === 1 ? "italic" : "normal" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm max-w-xs font-light" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.45)", lineHeight: 1.7 }}>
          A curated selection from the full archive. Each frame, a frozen breath.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[260px] md:auto-rows-[300px]">
        {bentoItems.map((item, i) => (
          <BentoCell key={i} item={item} index={i} onOpenLightbox={onOpenLightbox} />
        ))}
      </div>
    </section>
  );
}

function BentoCell({ item, index, onOpenLightbox }: { item: { src: string; alt: string; label: string; span: string; photo: typeof PHOTOS[0] }; index: number; onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`bento-cell relative overflow-hidden rounded-lg bg-stone-900/60 p-2 ${item.span}`}
      data-hover
      onClick={() => onOpenLightbox(item.photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", border: "1px solid rgba(240,236,230,0.08)" }}
    >
      <ImageWithFallback
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-cover md:object-contain rounded transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1)", willChange: "transform" }}
      />
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, transparent 40%, rgba(8,8,8,0.75) 100%)", opacity: hovered ? 1 : 0.35 }} />
      <div className="absolute bottom-5 left-5 transition-all duration-400" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#f0ece6", fontStyle: "italic" }}>{item.label}</span>
      </div>
      <div className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center transition-all duration-300 rounded-full" style={{ background: "rgba(8,8,8,0.65)", backdropFilter: "blur(8px)", opacity: hovered ? 1 : 0 }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L10 1M10 1H3M10 1V8" stroke="#c9a0a6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

/* ─── Manifesto ────────────────────────────────────────────── */

function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgImgRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          yPercent: 115, opacity: 0, duration: 1.2, delay: i * 0.15, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const verses = ["“A photograph", "is a pause", "button for life.”"];

  return (
    <section ref={sectionRef} className="relative flex items-center justify-center text-center overflow-hidden" style={{ minHeight: "100svh" }}>
      <div ref={bgImgRef} className="absolute inset-0 flex items-center justify-center scale-[1.25]" style={{ willChange: "transform" }}>
        <ImageWithFallback src={img3} alt="Manifesto backdrop" className="w-full h-full object-cover md:object-contain opacity-40" />
        <div className="absolute inset-0" style={{ background: "rgba(8,8,8,0.75)" }} />
      </div>
      <div className="relative z-10 px-8 py-20 max-w-3xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.32em] mb-10 font-mono" style={{ color: "#c9a0a6" }}>
          On Photography
        </p>
        {verses.map((v, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div ref={el => { lineRefs.current[i] = el; }} className="leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem,6vw,5.5rem)", color: "#f0ece6", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.02em" }}>
              {v}
            </div>
          </div>
        ))}
        <div style={{ overflow: "hidden" }}>
          <div ref={el => { lineRefs.current[3] = el; }} className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-10" style={{ background: "#c9a0a6" }} />
            <span className="text-[11px] tracking-[0.24em] uppercase font-mono" style={{ color: "rgba(240,236,230,0.5)" }}>Unknown</span>
            <div className="h-px w-10" style={{ background: "#c9a0a6" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Film Strip ───────────────────────────────────────────── */

function FilmStrip({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0, y: 24, duration: 0.8,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });
      gsap.from(".film-cell", {
        opacity: 0, scaleY: 0.85, transformOrigin: "bottom center", stagger: 0.1, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const strip = [img5, img6, img7, img8, img9];

  return (
    <section ref={sectionRef} className="px-8 md:px-12 py-24 md:py-32">
      <div ref={titleRef} className="mb-10 md:mb-14 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] mb-2 font-mono" style={{ color: "#c9a0a6" }}>Close-Ups</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", color: "#f0ece6", fontWeight: 400 }}>The <em>Details</em></h2>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-mono" style={{ color: "rgba(240,236,230,0.3)" }}>05 frames</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {strip.map((src, i) => (
          <FilmCell key={i} src={src} label={PHOTOS[5 + i].label} photo={PHOTOS[5 + i]} index={i} onOpenLightbox={onOpenLightbox} />
        ))}
      </div>
    </section>
  );
}

function FilmCell({ src, label, photo, index, onOpenLightbox }: { src: string; label: string; photo: typeof PHOTOS[0]; index: number; onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const [hovered, setHovered] = useState(false);
  const heights = ["420px", "360px", "480px", "400px", "440px"];
  return (
    <div
      className="film-cell relative overflow-hidden rounded-lg bg-stone-900/60 p-2 col-span-1 cursor-pointer"
      style={{ height: heights[index], border: "1px solid rgba(240,236,230,0.08)" }}
      data-hover
      onClick={() => onOpenLightbox(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ImageWithFallback
        src={src}
        alt={label}
        className="w-full h-full object-cover md:object-contain rounded transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.07)" : "scale(1)", willChange: "transform" }}
      />
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 50%)", opacity: hovered ? 1 : 0.4 }} />
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-400" style={{ transform: hovered ? "translateY(0)" : "translateY(6px)", opacity: hovered ? 1 : 0.8 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#f0ece6", fontStyle: "italic" }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Stats ─────────────────────────────────────────────────── */

function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const items = [
    { value: "10", label: "Photographs" },
    { value: "2+", label: "Years Together" },
    { value: "∞", label: "Memories Made" },
    { value: "1", label: "Story Told" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-row", {
        opacity: 0, y: 32, stagger: 0.1, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
      gsap.from(".stat-divider", {
        scaleX: 0, stagger: 0.08, duration: 1, ease: "expo.out", transformOrigin: "left",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-8 md:px-12 py-24 md:py-32 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.28em] mb-3 font-mono" style={{ color: "#c9a0a6" }}>By the Numbers</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.5rem)", color: "#f0ece6", fontWeight: 400 }}>The <em>Archive</em></h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {items.map(({ value, label }, i) => (
          <div key={label} className="stat-row pr-8 md:pr-12 py-8 md:py-0" style={{ borderRight: i < 3 ? "1px solid rgba(240,236,230,0.07)" : "none", borderBottom: "none" }}>
            <div className="stat-divider mb-4 h-px w-full" style={{ background: "rgba(240,236,230,0.08)" }} />
            <span className="block leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem,5vw,5rem)", color: "#f0ece6", fontWeight: 400 }}>{value}</span>
            <span className="text-[11px] tracking-[0.22em] uppercase font-mono" style={{ color: "rgba(240,236,230,0.4)" }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Lightbox Modal ────────────────────────────────────────── */

function LightboxModal({ photo, onClose, onPrev, onNext }: { photo: typeof PHOTOS[0] | null; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
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
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [photo, onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[99999] flex flex-col justify-between p-4 md:p-8 bg-black/95 backdrop-blur-2xl text-white">
      <div className="flex items-center justify-between z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[#c9a0a6] px-3 py-1 rounded bg-[#c9a0a6]/10 border border-[#c9a0a6]/30">
          {photo.cat} · {photo.year}
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoomed(!zoomed)} className="text-xs font-mono px-3 py-1.5 rounded bg-white/10 hover:bg-white/20">
            {zoomed ? "Reset (1x)" : "Zoom (1.8x)"}
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center font-bold">
            ✕
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <button onClick={onPrev} className="absolute left-2 md:left-6 z-20 w-12 h-12 rounded-full bg-stone-900/80 border border-white/20 hover:bg-[#c9a0a6] hover:text-black flex items-center justify-center transition-all">
          ←
        </button>
        <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
          <img
            src={photo.src}
            alt={photo.alt}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain transition-transform duration-500 rounded shadow-2xl"
            style={{ transform: zoomed ? "scale(1.8)" : "scale(1)", cursor: zoomed ? "zoom-out" : "zoom-in" }}
            onClick={() => setZoomed(!zoomed)}
          />
        </div>
        <button onClick={onNext} className="absolute right-2 md:right-6 z-20 w-12 h-12 rounded-full bg-stone-900/80 border border-white/20 hover:bg-[#c9a0a6] hover:text-black flex items-center justify-center transition-all">
          →
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 z-10">
        <div>
          <h2 className="font-serif text-2xl text-[#f0ece6] italic">{photo.label}</h2>
          <p className="text-xs text-white/50 font-sans">{photo.desc}</p>
        </div>
        <span className="text-xs font-mono text-white/30">Use ← → Arrow Keys to Navigate · ESC to Close</span>
      </div>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */

function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-content", {
        opacity: 0, y: 24, stagger: 0.08, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="px-8 md:px-12 pt-16 pb-10" style={{ borderTop: "1px solid rgba(240,236,230,0.07)" }}>
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-16">
        <div className="footer-content">
          <p className="text-[11px] uppercase tracking-[0.28em] mb-4 font-mono" style={{ color: "#c9a0a6" }}>Frames — Personal Archive</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem,5vw,4.5rem)", color: "#f0ece6", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Every frame,<br /><em>a feeling.</em>
          </h2>
        </div>
        <div className="footer-content flex flex-col gap-3">
          {["Instagram", "Contact", "Prints"].map(n => (
            <button key={n} data-hover className="text-sm text-left transition-opacity hover:opacity-50" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.5)", fontWeight: 300, background: "none", border: "none", cursor: "pointer" }}>{n}</button>
          ))}
        </div>
      </div>
      <div className="footer-content flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6" style={{ borderTop: "1px solid rgba(240,236,230,0.06)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "#f0ece6", fontStyle: "italic" }}>Frames</span>
        <span className="text-[11px] tracking-[0.15em] font-mono" style={{ color: "rgba(240,236,230,0.3)" }}>© 2024–2026 · All memories reserved · Crafted with care</span>
      </div>
    </footer>
  );
}

/* ─── App ───────────────────────────────────────────────────── */

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activePhoto, setActivePhoto] = useState<typeof PHOTOS[0] | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

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

  const handlePrev = () => {
    if (!activePhoto) return;
    const idx = PHOTOS.findIndex(p => p.src === activePhoto.src);
    const prevIdx = (idx - 1 + PHOTOS.length) % PHOTOS.length;
    setActivePhoto(PHOTOS[prevIdx]);
  };

  const handleNext = () => {
    if (!activePhoto) return;
    const idx = PHOTOS.findIndex(p => p.src === activePhoto.src);
    const nextIdx = (idx + 1) % PHOTOS.length;
    setActivePhoto(PHOTOS[nextIdx]);
  };

  return (
    <div style={{ background: "#080808", minHeight: "100svh", overflowX: "hidden" }}>
      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(220%); opacity: 0; }
        }
        * { cursor: default; }
        @media (hover: hover) {
          *[data-hover] { cursor: pointer !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Preloader onComplete={handleLoaded} />

      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
        <Cursor />
        <Nav />

        <main>
          <Hero onOpenLightbox={setActivePhoto} />
          <MarqueeStrip speed={55} />

          <EditorialIntro onOpenLightbox={setActivePhoto} />

          <MarqueeStrip reverse speed={40} accent />

          <HorizontalGallery onOpenLightbox={setActivePhoto} />

          <FeaturePhoto
            photo={img6}
            quote="A genuine laugh|is the most|beautiful portrait."
            label="Her Laughter"
            year="2024"
            onOpenLightbox={setActivePhoto}
          />

          <div style={{ borderTop: "1px solid rgba(240,236,230,0.06)" }} />

          <FeaturePhoto
            photo={img4}
            quote={"Distance is just|a test of how far|love can travel."}
            label="Long Distance"
            year="2023"
            reverse
            onOpenLightbox={setActivePhoto}
          />

          <MarqueeStrip speed={65} />

          <BentoGrid onOpenLightbox={setActivePhoto} />

          <Manifesto />

          <FilmStrip onOpenLightbox={setActivePhoto} />

          <Stats />
        </main>

        <Footer />

        <LightboxModal
          photo={activePhoto}
          onClose={() => setActivePhoto(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
