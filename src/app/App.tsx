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
import img10 from "@/imports/image-10.png";
import img11 from "@/imports/image-11.png";
import img12 from "@/imports/image-12.png";
import img13 from "@/imports/image-13.png";
import img14 from "@/imports/image-14.jpg";
import img15 from "@/imports/image-15.png";
import img16 from "@/imports/image-16.png";
import img17 from "@/imports/image-17.png";
import img18 from "@/imports/image-18.png";
import img19 from "@/imports/image-19.png";


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
  { id: 9, src: img9, alt: "Selfie moment", label: "Us Again", year: "2024", cat: "Portrait", desc: "Preserving everyday memories side-by-side forever." },
  { id: 10, src: img10, alt: "Holding hands", label: "Intertwined", year: "2024", cat: "Candid", desc: "Fingers intertwined, a silent promise in warm golden light." },
  { id: 11, src: img11, alt: "Hands in monochrome", label: "Timeless Touch", year: "2024", cat: "Edit", desc: "A timeless black-and-white frame of hands that hold the world." },
  { id: 12, src: img12, alt: "Train door smile", label: "Journey Begins", year: "2024", cat: "Candid", desc: "Her radiant smile at the train door, where every journey starts." },
  { id: 13, src: img13, alt: "Silhouette together", label: "Golden Hour", year: "2024", cat: "Edit", desc: "Two silhouettes against the fading sky, lost in the moment." },
  { id: 14, src: img14, alt: "Waiting at station", label: "The Wait", year: "2024", cat: "Candid", desc: "A quiet moment of waiting at the station, beauty in patience." },
  { id: 15, src: img15, alt: "Fun selfie", label: "Playful Us", year: "2024", cat: "Portrait", desc: "Goofy filters and genuine laughter at the station together." },
  { id: 16, src: img16, alt: "Temple visit", label: "Sacred Moments", year: "2023", cat: "Heritage", desc: "Exploring ancient temples, creating memories amidst heritage." },
  { id: 17, src: img17, alt: "Indoor selfie", label: "Cozy Together", year: "2023", cat: "Portrait", desc: "Simple indoor moments that mean the most to us." },
  { id: 18, src: img18, alt: "Temple selfie", label: "Heritage Duo", year: "2023", cat: "Heritage", desc: "Side by side at a sacred temple, tradition meets togetherness." },
  { id: 19, src: img19, alt: "Movie night", label: "Cinema Date", year: "2024", cat: "Candid", desc: "Snuggled up in the theater, a cozy cinema date night." },
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

    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
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
      className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-4 md:px-12 transition-all duration-700"
      style={{
        height: scrolled ? "60px" : "80px",
        background: scrolled ? "rgba(8,8,8,0.95)" : "linear-gradient(to bottom, rgba(8,8,8,0.7) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(240,236,230,0.08)" : "1px solid transparent",
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

/* ─── Hero (Frameless Image) ───────────────────────────────── */

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
      {/* Pure frameless hero background image of us */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden" style={{ willChange: "transform" }}>
        <ImageWithFallback src={img9} alt="Hero background of us" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.05) 30%, rgba(8,8,8,0.6) 70%, rgba(8,8,8,0.97) 100%)" }} />
      </div>

      <div className="relative z-10 px-5 md:px-12 pb-14 md:pb-20 max-w-6xl">
        <p ref={tagRef} className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] mb-4 md:mb-8" style={{ fontFamily: "'DM Mono', monospace", color: "#c9a0a6" }}>
          A Personal Collection · 2023–2024
        </p>
        <div className="mb-4">
          <div style={{ overflow: "hidden" }}>
            <div ref={h1aRef} className="leading-[0.92]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem,9vw,9.5rem)", color: "#f0ece6", fontWeight: 400, letterSpacing: "-0.025em" }}>
              Our
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={h1bRef} className="leading-[0.92] flex items-baseline gap-3 md:gap-4 flex-wrap">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem,9vw,9.5rem)", color: "#f0ece6", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.025em" }}>
                beautiful
              </span>
              <span style={{ overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }}>
                <span ref={wordRef} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,5vw,4.8rem)", color: "#c9a0a6", fontWeight: 400, display: "inline-block", letterSpacing: "-0.02em" }}>
                  {words[wordIdx]}
                </span>
              </span>
            </div>
          </div>
        </div>
        <p ref={subRef} className="text-sm max-w-xs md:max-w-sm mt-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onOpenLightbox(PHOTOS[9])} style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,230,0.55)", fontWeight: 300, lineHeight: 1.85, letterSpacing: "0.01em" }}>
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

/* ─── Editorial Intro (Frameless Image) ────────────────────── */

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
          This collection captures 20 genuine photographs — unposed, unrehearsed, and deeply personal. From traditional celebrations to quiet everyday moments.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px w-12" style={{ background: "#c9a0a6" }} />
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(240,236,230,0.4)" }}>20 Photographs · 2023–2024</span>
        </div>
      </div>

      {/* Complete full-size uncropped image - larger container */}
      <div
        ref={imgWrapRef}
        data-hover
        onClick={() => onOpenLightbox(PHOTOS[2])}
        className="order-1 md:order-2 relative overflow-hidden cursor-pointer flex items-start justify-center min-h-[420px] md:min-h-[750px] max-h-[850px] w-full rounded-lg"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div ref={imgInnerRef} className="w-full h-full flex items-start justify-center overflow-hidden" style={{ willChange: "transform" }}>
          <ImageWithFallback src={img2} alt="Traditional moment" className="w-full h-full object-cover object-top rounded-lg" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom right, transparent 60%, rgba(8,8,8,0.5) 100%)" }} />
        <div className="absolute bottom-6 left-6">
          <span className="text-[11px] tracking-[0.18em] uppercase font-mono" style={{ color: "rgba(240,236,230,0.7)" }}>Heritage · 2023</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Kinetic 3D Text Room / Tunnel (Tejj.in Inspired) ──────── */

function KineticTextRoom({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const topText = ["COME SEE HOW", "MOMENTS LIVE FOREVER", "GENUINE UNPOSED", "COME SEE HOW"];
  const bottomText = ["COME SEE HOW", "WE CAPTURE STORIES", "TIMELESS ELEGANCE", "COME SEE HOW"];
  const sideText = ["MEMORIES", "STORY", "CANDID", "FOREVER", "PHOTOGRAPHS"];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;

    gsap.to(room, {
      rotateY: mousePos.x * 15,
      rotateX: -mousePos.y * 15,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [mousePos]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        roomRef.current,
        { scale: 0.82, rotateX: 12 },
        {
          scale: 1,
          rotateX: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[650px] overflow-hidden bg-[#080808] flex items-center justify-center select-none"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Perspective Room Container */}
      <div
        ref={roomRef}
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Top Ceiling Wall */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden flex flex-col justify-end opacity-90"
          style={{
            transform: "rotateX(-80deg) translateZ(10px)",
            transformOrigin: "top center",
          }}
        >
          <div className="flex flex-col gap-2 animate-marquee-fast whitespace-nowrap">
            {[...topText, ...topText].map((t, idx) => (
              <div
                key={idx}
                className="text-[clamp(3.5rem,7vw,8.5rem)] font-black uppercase tracking-tighter leading-none"
                style={{ color: idx % 2 === 0 ? "#818cf8" : "#a5b4fc" }}
              >
                {t} · {t} · {t}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Floor Wall */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden flex flex-col justify-start opacity-90"
          style={{
            transform: "rotateX(80deg) translateZ(10px)",
            transformOrigin: "bottom center",
          }}
        >
          <div className="flex flex-col gap-2 animate-marquee-fast-reverse whitespace-nowrap">
            {[...bottomText, ...bottomText].map((t, idx) => (
              <div
                key={idx}
                className="text-[clamp(3.5rem,7vw,8.5rem)] font-black uppercase tracking-tighter leading-none"
                style={{ color: idx % 2 === 0 ? "#818cf8" : "#93c5fd" }}
              >
                {t} · {t} · {t}
              </div>
            ))}
          </div>
        </div>

        {/* Left Wall */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden flex items-center justify-start opacity-90"
          style={{
            transform: "rotateY(80deg) translateZ(10px)",
            transformOrigin: "left center",
          }}
        >
          <div className="flex gap-4 animate-marquee-fast whitespace-nowrap">
            {[...sideText, ...sideText].map((t, idx) => (
              <div
                key={idx}
                className="text-[clamp(3.5rem,7vw,8.5rem)] font-black uppercase tracking-tighter leading-none"
                style={{
                  color: "#818cf8",
                  writingMode: "vertical-rl",
                }}
              >
                {t} · {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right Wall */}
        <div
          className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden flex items-center justify-end opacity-90"
          style={{
            transform: "rotateY(-80deg) translateZ(10px)",
            transformOrigin: "right center",
          }}
        >
          <div className="flex gap-4 animate-marquee-fast-reverse whitespace-nowrap">
            {[...sideText, ...sideText].map((t, idx) => (
              <div
                key={idx}
                className="text-[clamp(3.5rem,7vw,8.5rem)] font-black uppercase tracking-tighter leading-none"
                style={{
                  color: "#a5b4fc",
                  writingMode: "vertical-rl",
                }}
              >
                {t} · {t}
              </div>
            ))}
          </div>
        </div>

        {/* Center Opening Hero Portal Box */}
        <div
          data-hover
          onClick={() => onOpenLightbox(PHOTOS[9])}
          className="relative z-30 w-[88vw] h-[230px] sm:w-[420px] sm:h-[260px] md:w-[540px] md:h-[320px] rounded-2xl overflow-hidden border border-indigo-400/40 shadow-[0_0_100px_rgba(129,140,248,0.45)] cursor-pointer group bg-black"
          style={{ transform: "translateZ(90px)" }}
        >
          <ImageWithFallback
            src={img9}
            alt="Hero background of us"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-indigo-300 mb-2">
              A Personal Collection · 2023–2024
            </span>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white font-normal mb-1">
              Our Beautiful Story
            </h1>
            <p className="text-xs text-white/60 font-sans font-light">
              Click to view photo · Scroll to explore the archive ↓
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 z-40 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-indigo-200/50">
          Scroll Down
        </span>
        <div className="w-4 h-7 rounded-full border border-indigo-300/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-indigo-300 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ─── Responsive GSAP Horizontal Gallery (Frameless Images) ─── */

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
        className="flex items-center gap-5 md:gap-8 pt-36 pb-12 px-8 md:px-12 whitespace-nowrap"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {PHOTOS.map((p, i) => (
          <FramelessImageCard key={i} photo={p} index={i} onOpenLightbox={onOpenLightbox} />
        ))}
        <div className="flex-shrink-0 w-16 md:w-20" />
      </div>
    </div>
  );
}

/* Pure Frameless Image Component (NO Card borders, NO card boxes) */

function FramelessImageCard({ photo, index, onOpenLightbox }: { photo: typeof PHOTOS[0]; index: number; onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const heights = [520, 440, 580, 460, 500, 420, 560, 440, 520, 480, 530, 450, 570, 470, 510, 430, 550, 460, 500, 490];
  const widths = [320, 260, 340, 280, 300, 260, 320, 280, 310, 290, 330, 270, 350, 290, 310, 270, 330, 290, 320, 300];

  const cardWidth = widths[index % widths.length];
  const cardHeight = heights[index % heights.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      rotateY: (x / rect.width) * 8,
      rotateX: (-y / rect.height) * 8,
      scale: 1.04,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const el = imgRef.current;
    if (!el) return;
    setHovered(false);
    gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div
      ref={imgRef}
      data-hover
      onClick={() => onOpenLightbox(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        maxWidth: "85vw",
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {/* Pure image floating directly */}
      <ImageWithFallback
        src={photo.src}
        alt={photo.alt}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.08)" : "scale(1.0)", willChange: "transform" }}
        draggable={false}
      />

      {/* Floating text & metadata overlay directly on image */}
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 55%)", opacity: hovered ? 1 : 0.45 }} />
      <div className="absolute top-4 left-4 transition-all duration-400" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-8px)" }}>
        <span className="text-[10px] px-2 py-1 tracking-[0.15em] uppercase font-mono" style={{ color: "#c9a0a6", background: "rgba(8,8,8,0.65)", backdropFilter: "blur(10px)" }}>
          {photo.cat}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500" style={{ transform: hovered ? "translateY(0)" : "translateY(10px)", opacity: hovered ? 1 : 0.75 }}>
        <span className="block text-[11px] mb-1 font-mono" style={{ color: "rgba(240,236,230,0.5)", letterSpacing: "0.12em" }}>{photo.year}</span>
        <span className="block text-xl font-serif italic" style={{ color: "#f0ece6", fontWeight: 400 }}>{photo.label}</span>
      </div>
      <div className="absolute top-4 right-4 transition-all duration-400" style={{ opacity: hovered ? 1 : 0 }}>
        <span className="text-[11px] tracking-widest font-mono" style={{ color: "rgba(240,236,230,0.5)" }}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
      </div>
    </div>
  );
}

/* ─── Feature Photos (Frameless Images) ────────────────────── */

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
      {/* Frameless Floating Image - Full Top Visible */}
      <div
        ref={imgWrapRef}
        data-hover
        onClick={() => onOpenLightbox(matchedPhoto)}
        className={`relative overflow-hidden cursor-pointer ${reverse ? "md:order-2" : "md:order-1"}`}
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div ref={imgRef} className="w-full flex items-center justify-center">
          <ImageWithFallback src={photo} alt={label} className="w-full h-auto max-h-[82vh] object-cover object-top" />
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

/* ─── Bento Grid (Frameless Images) ────────────────────────── */

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
      className={`bento-cell relative overflow-hidden ${item.span}`}
      data-hover
      onClick={() => onOpenLightbox(item.photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Pure frameless image */}
      <ImageWithFallback
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.08)" : "scale(1)", willChange: "transform" }}
      />
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, transparent 40%, rgba(8,8,8,0.75) 100%)", opacity: hovered ? 1 : 0.35 }} />
      <div className="absolute bottom-5 left-5 transition-all duration-400" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#f0ece6", fontStyle: "italic" }}>{item.label}</span>
      </div>
      <div className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center transition-all duration-300 rounded-full" style={{ background: "rgba(8,8,8,0.55)", backdropFilter: "blur(8px)", opacity: hovered ? 1 : 0 }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L10 1M10 1H3M10 1V8" stroke="#c9a0a6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

/* ─── Manifesto (Frameless Background Image) ────────────────── */

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
        <ImageWithFallback src={img3} alt="Manifesto backdrop" className="w-full h-full object-cover opacity-35" />
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

/* ─── Film Strip (Frameless Images) ────────────────────────── */

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
  const isMobile = useIsMobile();
  const heightsDesktop = ["420px", "360px", "480px", "400px", "440px"];
  const heightsMobile = ["280px", "240px", "310px", "260px", "290px"];
  const height = isMobile ? heightsMobile[index] : heightsDesktop[index];

  return (
    <div
      className="film-cell relative overflow-hidden col-span-1 cursor-pointer"
      style={{ height }}
      data-hover
      onClick={() => onOpenLightbox(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pure frameless image */}
      <ImageWithFallback
        src={src}
        alt={label}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.07)" : "scale(1)", willChange: "transform" }}
      />
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 50%)", opacity: hovered ? 1 : 0.4 }} />
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-400" style={{ transform: hovered ? "translateY(0)" : "translateY(6px)", opacity: hovered ? 1 : 0.8 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#f0ece6", fontStyle: "italic" }}>{label}</span>
      </div>
    </div>
  );
}



/* ─── Polaroid Fan Deck Carousel ──────────────────────────── */

function PolaroidFanDeck({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handCaptions = [
    "us together",
    "candid smiles",
    "heritage & roots",
    "pure joy",
    "miles apart",
    "quiet stillness",
    "her genuine laugh",
    "shy glance",
    "warm indoors",
    "forever memory",
    "intertwined hands",
    "timeless monochrome",
    "journey smile",
    "sunlit silhouettes",
    "platform whispers",
    "playful moments",
    "sacred devotion",
    "cozy selfie",
    "temple visit",
    "cinema date night"
  ];

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % PHOTOS.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    if (diff > 40) handlePrev();
    else if (diff < -40) handleNext();
    setDragStartX(null);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-4 md:px-12 py-28 md:py-40 overflow-hidden select-none bg-[#080808]">
      {/* Background Watermark Outlined Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(6rem, 22vw, 24rem)", fontWeight: 900, color: "transparent", WebkitTextStroke: "2px #f0ece6", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
          LIFETIME
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-[11px] uppercase tracking-[0.28em] mb-3 font-mono" style={{ color: "#c9a0a6" }}>Polaroid Deck</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.6rem)", color: "#f0ece6", fontWeight: 400 }}>
          The <em>Interactive</em> Stack
        </h2>
      </div>

      {/* 3D Stack / Fan Container */}
      <div
        className="relative z-20 max-w-5xl mx-auto h-[480px] md:h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          data-hover
          className="absolute left-2 md:left-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-stone-900/80 border border-white/15 hover:border-[#c9a0a6] hover:bg-[#c9a0a6] hover:text-black text-white text-xl flex items-center justify-center transition-all shadow-2xl"
          aria-label="Previous Photo"
        >
          ‹
        </button>

        {/* Polaroid Cards Deck */}
        <div className="relative w-full h-full flex items-center justify-center perspective-[1200px]">
          {PHOTOS.map((photo, i) => {
            const offset = (i - activeIndex + PHOTOS.length) % PHOTOS.length;
            let relativeOffset = offset;
            if (relativeOffset > PHOTOS.length / 2) {
              relativeOffset -= PHOTOS.length;
            }

            const absOffset = Math.abs(relativeOffset);
            const isCenter = relativeOffset === 0;

            const rotateDeg = relativeOffset * 7.5;
            const translateX = relativeOffset * (window.innerWidth < 768 ? 26 : 46);
            const translateY = Math.abs(relativeOffset) * (window.innerWidth < 768 ? 8 : 12);
            const scale = 1 - absOffset * 0.055;
            const zIndex = 30 - absOffset;
            const opacity = absOffset > 4 ? 0 : 1 - absOffset * 0.18;

            return (
              <div
                key={i}
                data-hover
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCenter) {
                    onOpenLightbox(photo);
                  } else {
                    setActiveIndex(i);
                  }
                }}
                className="absolute transition-all duration-700 ease-out origin-bottom cursor-pointer"
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, 0px) rotate(${rotateDeg}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  visibility: opacity <= 0 ? "hidden" : "visible",
                  willChange: "transform, opacity",
                }}
              >
                {/* Polaroid Frame */}
                <div className="w-[250px] sm:w-[320px] md:w-[380px] bg-[#f7f3eb] p-3 sm:p-4 pb-6 sm:pb-8 rounded-[3px] shadow-[0_22px_55px_rgba(0,0,0,0.7)] border border-[#e5ded0]/60 transition-transform duration-300 hover:scale-[1.02]">
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 rounded-[2px]">
                    <ImageWithFallback
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Handwritten Blue Caption */}
                  <div className="pt-4 text-center">
                    <span
                      style={{
                        fontFamily: "'Caveat', 'Dancing Script', 'Playfair Display', cursive",
                        fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)",
                        color: "#2563eb",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {handCaptions[i]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          data-hover
          className="absolute right-2 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-stone-900/80 border border-white/15 hover:border-[#c9a0a6] hover:bg-[#c9a0a6] hover:text-black text-white text-xl flex items-center justify-center transition-all shadow-2xl"
          aria-label="Next Photo"
        >
          ›
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="relative z-20 flex items-center justify-center gap-2 mt-8 md:mt-12">
        {PHOTOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              background: idx === activeIndex ? "#c9a0a6" : "rgba(240,236,230,0.2)",
              transform: idx === activeIndex ? "scale(1.4)" : "scale(1)",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Full Width Bottom Banner (Edge-to-Edge Widescreen) ───── */

function FullWidthBottomBanner({ onOpenLightbox }: { onOpenLightbox: (photo: typeof PHOTOS[0]) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const matchedPhoto = PHOTOS.find(p => p.src === img13) || PHOTOS[13];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-hover
      onClick={() => onOpenLightbox(matchedPhoto)}
      className="relative w-full h-[55vh] sm:h-[65vh] md:h-[80vh] overflow-hidden bg-black cursor-pointer my-12 md:my-20"
    >
      <div ref={imgRef} className="w-full h-full flex items-center justify-center">
        <ImageWithFallback
          src={img13}
          alt="Golden Hour Silhouette"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

      <div className="absolute bottom-10 left-6 right-6 md:bottom-16 md:left-14 md:right-14 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
        <div>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] font-mono text-[#c9a0a6] mb-2 block">
            Golden Hour · 2024
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-6xl text-[#f0ece6] font-normal leading-tight">
            Two souls, one horizon.
          </h2>
        </div>
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/40">
          Full Width View ↗
        </span>
      </div>
    </section>
  );
}

/* ─── Lightbox Modal ────────────────────────────────────────── */

function LightboxModal({ photo, onClose, onPrev, onNext }: { photo: typeof PHOTOS[0] | null; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 45) onPrev();
    else if (diff < -45) onNext();
    setTouchStartX(null);
  };

  if (!photo) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[99999] flex flex-col justify-between p-4 md:p-8 bg-black/95 backdrop-blur-2xl text-white select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
            className="max-w-full max-h-[82vh] w-auto h-auto object-contain transition-transform duration-500"
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
        @keyframes marqueeFast {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marqueeFastReverse {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .animate-marquee-fast {
          animation: marqueeFast 14s linear infinite;
        }
        .animate-marquee-fast-reverse {
          animation: marqueeFastReverse 14s linear infinite;
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
          <KineticTextRoom onOpenLightbox={setActivePhoto} />
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

          <div style={{ borderTop: "1px solid rgba(240,236,230,0.06)" }} />

          <FeaturePhoto
            photo={img16}
            quote="Sacred devotion,|tradition & grace|in quiet harmony."
            label="Blessed Moments"
            year="2024"
            onOpenLightbox={setActivePhoto}
          />

          <div style={{ borderTop: "1px solid rgba(240,236,230,0.06)" }} />

          <FeaturePhoto
            photo={img10}
            quote="Fingers intertwined,|a silent promise|under golden light."
            label="Intertwined"
            year="2024"
            reverse
            onOpenLightbox={setActivePhoto}
          />

          <MarqueeStrip speed={65} />

          <BentoGrid onOpenLightbox={setActivePhoto} />

          <Manifesto />

          <FilmStrip onOpenLightbox={setActivePhoto} />

          <PolaroidFanDeck onOpenLightbox={setActivePhoto} />

          <FullWidthBottomBanner onOpenLightbox={setActivePhoto} />
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
