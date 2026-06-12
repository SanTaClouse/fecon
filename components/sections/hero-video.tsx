"use client";

import { useEffect, useRef, useState } from "react";

// Video de fondo del hero (reel vertical 9:16). Los navegadores solo permiten
// autoplay sin audio, así que arranca silenciado en loop y el visitante activa
// el sonido con el botón si quiere. Las rayas quedan de fallback mientras carga.
//
// Servido desde Cloudinary: la extensión .mp4 (el original es .mov) y q_auto
// hacen que Cloudinary transcodifique a H.264 comprimido; so_0 saca el primer
// frame como poster para que haya imagen mientras descarga el video.
const VIDEO_SRC =
  "https://res.cloudinary.com/dlw9ocu3b/video/upload/q_auto/v1781288284/IMG_7466_cxsb98.mp4";
const POSTER_SRC =
  "https://res.cloudinary.com/dlw9ocu3b/video/upload/so_0,q_auto/v1781288284/IMG_7466_cxsb98.jpg";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // React no siempre serializa el atributo `muted` en SSR; lo forzamos acá
  // para que el autoplay no sea bloqueado antes de hidratar.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    if (!next && video.paused) video.play().catch(() => {});
    setMuted(next);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#2A2620]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 13px, rgba(255,255,255,0.05) 13px 26px)",
        }}
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(25,23,19,0.55) 0%, rgba(25,23,19,0.35) 35%, rgba(25,23,19,0.92) 100%)",
        }}
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? "Activar sonido del video" : "Silenciar video"}
        className="absolute right-[20px] top-[116px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-blanco/[0.35] bg-grafito-900/[0.45] text-blanco backdrop-blur-[8px] transition-transform active:scale-[0.94]"
      >
        {muted ? <SpeakerOff /> : <SpeakerOn />}
      </button>
    </div>
  );
}

function SpeakerOn() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="m15.5 9.5 5 5" />
      <path d="m20.5 9.5-5 5" />
    </svg>
  );
}
