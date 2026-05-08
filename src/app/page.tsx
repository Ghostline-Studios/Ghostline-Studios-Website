import { GamesSection, Hero, ProjectsTeaser } from "@/components/Games";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  AboutSection,
  CareersSection,
  NewsSection,
  PressContactSection,
  SiteFooter,
  TopNav,
} from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export default function HomePage() {
  return (
    <SiteChrome showIntro>
      <RevealOnScroll />
      <TopNav />
      <Hero />
      <ProjectsTeaser />
      <GamesSection />
      <AboutSection />
      <NewsSection />
      <CareersSection />
      <PressContactSection />
      <SiteFooter />
    </SiteChrome>
  );
}
