import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import KenyonSection from "@/components/KenyonSection";
import ImpactSection from "@/components/ImpactSection";
import VisionSection from "@/components/VisionSection";
import FoundersLetter from "@/components/FoundersLetter";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [entered, setEntered] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setEntered(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Preloader onComplete={handlePreloaderComplete} />
      {entered && <Navigation />}
      <HeroSection entered={entered} />
      <AboutSection />
      <GallerySection />
      <KenyonSection />
      <ImpactSection />
      <VisionSection />
      <FoundersLetter />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
