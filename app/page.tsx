import TopNav from "@/components/relay/TopNav";
import Hero from "@/components/relay/Hero";
import LogoWall from "@/components/relay/LogoWall";
import Features from "@/components/relay/Features";
import CodeMockup from "@/components/relay/CodeMockup";
import Stats from "@/components/relay/Stats";
import Testimonials from "@/components/relay/Testimonials";
import Footer from "@/components/relay/Footer";

import CTA from "@/components/relay/CTA";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <TopNav />
      <main>
        <Hero />
        <LogoWall />
        <Features />
        <CodeMockup />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
