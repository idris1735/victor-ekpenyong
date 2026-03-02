import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import KenyonSection from "@/components/KenyonSection";
import ImpactSection from "@/components/ImpactSection";
import VisionSection from "@/components/VisionSection";
import FoundersLetter from "@/components/FoundersLetter";
import SocialSection from "@/components/SocialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { cmsApi, toSectionMap } from "@/lib/cms";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const pageQuery = useQuery({
    queryKey: ["cms", "page", "home", "public"],
    queryFn: () => cmsApi.getPage("home"),
    retry: false,
  });
  const siteQuery = useQuery({
    queryKey: ["cms", "site", "public"],
    queryFn: cmsApi.getSite,
    retry: false,
  });

  const handlePreloaderComplete = useCallback(() => {
    setEntered(true);
  }, []);

  const sectionMap = toSectionMap(pageQuery.data);
  const siteSettings = siteQuery.data?.siteSettings || {};
  const brand = (siteSettings as { brand?: { logoUrl?: string } }).brand;
  const dynamicLogo = brand?.logoUrl;

  return (
    <div className="min-h-screen bg-background">
      <Preloader onComplete={handlePreloaderComplete} logoUrl={dynamicLogo} />
      {entered && <Navigation settings={siteSettings} />}
      <HeroSection entered={entered} data={sectionMap.hero} />
      <AboutSection data={sectionMap.about} />
      <GallerySection data={sectionMap.gallery} />
      <KenyonSection data={sectionMap.kenyon} />
      <ImpactSection data={sectionMap.impact} />
      <VisionSection data={sectionMap.vision} />
      <FoundersLetter data={sectionMap.foundersLetter} />
      <SocialSection data={sectionMap.social} />
      <ContactSection data={sectionMap.contact} />
      <Footer settings={siteSettings} data={sectionMap.footer} />
    </div>
  );
};

export default Index;
