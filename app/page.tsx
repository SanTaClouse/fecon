import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { KPIs } from "@/components/sections/kpis";
import { Servicios } from "@/components/sections/servicios";
import { PorQue } from "@/components/sections/por-que";
import { Testimonios } from "@/components/sections/testimonios";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Page() {
  return (
    <main className="bg-blanco">
      <Nav />
      <Hero />
      <KPIs />
      <Servicios />
      <PorQue />
      <Testimonios />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
