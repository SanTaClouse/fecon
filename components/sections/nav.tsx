"use client";

import { useEffect, useState } from "react";
import { ModuloF, Wordmark } from "@/components/marks";
import { WA } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 pt-[50px] pb-[12px] transition-[background-color,border-color] duration-300",
        scrolled
          ? "border-b border-white/[0.08] bg-grafito-900/[0.92] backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-screen-sm items-center justify-between px-[20px]">
        <div className="flex items-center gap-[9px]">
          <ModuloF size={22} />
          <Wordmark size={18} />
        </div>
        <a
          href={WA.general}
          target="_blank"
          rel="noopener"
          aria-label="Pedir presupuesto por WhatsApp"
          className="rounded-full border border-blanco/[0.35] px-[15px] py-[8px] font-sans text-[13.5px] font-bold text-blanco no-underline"
        >
          Presupuesto
        </a>
      </div>
    </header>
  );
}
