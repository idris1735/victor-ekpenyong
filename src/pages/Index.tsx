import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import KenyonSection from "@/components/KenyonSection";
import ImpactSection from "@/components/ImpactSection";
import VisionSection from "@/components/VisionSection";
import FoundersLetter from "@/components/FoundersLetter";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
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
