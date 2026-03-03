import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import heroPortrait from "@/assets/victor-ekpenyong-homebanner-cropped.png";

interface HeroSectionProps {
  entered: boolean;
  data?: Record<string, unknown>;
}

const HeroSection = ({ entered, data }: HeroSectionProps) => {
  const navigate = useNavigate();
  const heroData = data || {};
  const badge = String(heroData.badge || "Founder - Engineer - Visionary");
  const firstName = String(heroData.firstName || "Dr. Victor");
  const lastName = String(heroData.lastName || "Ekpenyong");
  const subtitle = String(heroData.subtitle || "Engineering Energy. Building Enduring Impact.");
  const primaryButton = (heroData.primaryButton as { label?: string; targetId?: string } | undefined) || {};
  const secondaryButton = (heroData.secondaryButton as { label?: string; targetId?: string } | undefined) || {};
  const portraitImage = String(heroData.portraitImage || heroPortrait);
  const backgroundImage = String(heroData.backgroundImage || heroBg);

  const goTo = (target: string, fallback: string) => {
    const value = String(target || fallback).trim();
    if (!value) return;
    if (value.startsWith("/")) {
      navigate(value);
      return;
    }
    if (value.toLowerCase() === "gallery") {
      navigate("/gallery");
      return;
    }
    document.getElementById(value.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <motion.div
        initial={{ scale: 1.15 }}
        animate={entered ? { scale: 1 } : {}}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={entered ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
        className="absolute right-0 bottom-[-42px] xl:bottom-[-28px] 2xl:bottom-[-16px] hidden lg:flex items-end justify-end w-[clamp(460px,52vw,980px)] pointer-events-none"
      >
        <img
          src={portraitImage}
          alt="Dr. Victor Ekpenyong"
          className="w-full h-auto object-contain object-bottom object-right select-none"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 94%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 94%)",
          }}
        />
        <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-background/95 via-background/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-background via-background/90 via-background/65 to-transparent" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(130deg, transparent 42%, hsl(40 70% 50% / 0.04) 100%)" }} />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 md:pb-14 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
          className="lg:hidden relative mx-auto mb-6 w-[min(88vw,440px)] pointer-events-none"
        >
          <img
            src={portraitImage}
            alt="Dr. Victor Ekpenyong"
            className="w-full h-auto object-contain object-top select-none"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 58%, transparent 97%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 58%, transparent 97%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-background via-background/80 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={entered ? { width: 48 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-px bg-primary"
          />
          <p className="text-xs tracking-[0.4em] uppercase text-primary">{badge}</p>
        </motion.div>

        <div className="overflow-visible mb-2 pb-2">
          <motion.h1
            initial={{ y: "110%" }}
            animate={entered ? { y: 0 } : {}}
            transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[1.02] pb-[0.04em]"
          >
            {firstName}
          </motion.h1>
        </div>
        <div className="overflow-visible mb-7 pb-4">
          <motion.h1
            initial={{ y: "110%" }}
            animate={entered ? { y: 0 } : {}}
            transition={{ delay: 1.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[1.06] pb-[0.08em] text-gradient-gold"
          >
            {lastName}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mb-9 font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.9, duration: 0.6 }}
          className="flex flex-wrap items-center gap-5"
        >
          <button
            onClick={() => goTo(String(primaryButton.targetId || "about"), "about")}
            className="group relative px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_hsl(40_70%_50%/0.3)]"
          >
            <span className="relative z-10">{String(primaryButton.label || "Explore His Legacy")}</span>
          </button>
          <button
            onClick={() => goTo(String(secondaryButton.targetId || "/gallery"), "/gallery")}
            className="px-10 py-4 border border-primary/40 text-primary text-xs tracking-[0.3em] uppercase hover:bg-primary/10 transition-all duration-500"
          >
            {String(secondaryButton.label || "View Gallery")}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
