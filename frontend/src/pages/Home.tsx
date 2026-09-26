import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { initLenis } from "@/lib/scroll";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import LogoWall from "@/components/landing/LogoWall";
import ClientsLead from "@/components/landing/ClientsLead";
import Process from "@/components/landing/Process";
import NumbersStory from "@/components/landing/NumbersStory";
import ArtBreak from "@/components/landing/ArtBreak";
import Expertise from "@/components/landing/Expertise";
import Footer from "@/components/landing/Footer";

export default function Home() {
  useEffect(() => initLenis(), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FBF8F2] font-sans text-[#121212] antialiased selection:bg-[#C6F24E] selection:text-[#0F172A]">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <LogoWall />
          <ClientsLead />
          <Process />
          <NumbersStory />
          <ArtBreak />
          <Expertise />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
