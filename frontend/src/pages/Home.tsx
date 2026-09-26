import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { initLenis } from "@/lib/scroll";
import { ContentContext, fetchContent } from "@/lib/content";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import LogoWall from "@/components/landing/LogoWall";
import ClientsLead from "@/components/landing/ClientsLead";
import Process from "@/components/landing/Process";
import StatsStrip from "@/components/landing/StatsStrip";
import NumbersStory from "@/components/landing/NumbersStory";
import Expertise from "@/components/landing/Expertise";
import Footer from "@/components/landing/Footer";

export default function Home() {
  useEffect(() => initLenis(), []);
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["site-content"], queryFn: fetchContent, staleTime: 30_000, retry: 1 });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  return (
    <MotionConfig reducedMotion="user">
      <ContentContext.Provider value={{ content: data ?? {}, refresh }}>
        <div className="min-h-screen bg-[#FBF8F2] font-sans text-[#121212] antialiased selection:bg-[#C6F24E] selection:text-[#0F172A]">
          <Nav />
          <main>
            <Hero />
            <Marquee />
            <LogoWall />
            <ClientsLead />
            <Process />
            <StatsStrip />
            <NumbersStory />
            <Expertise />
          </main>
          <Footer />
        </div>
      </ContentContext.Provider>
    </MotionConfig>
  );
}
