import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import heroPortrait from "@/assets/hero-portrait.png";

interface HeroSectionProps {
  entered: boolean;
}

const HeroSection = ({ entered }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={entered ? { scale: 1 } : {}}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      {/* Portrait - blended into hero */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={entered ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
        className="absolute right-0 bottom-0 hidden lg:block w-[50%] xl:w-[45%] h-full"
      >
        <img
          src={heroPortrait}
          alt="Dr. Victor Ekpenyong"
          className="w-full h-full object-cover object-top"
        />
        {/* Blend edges into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        {/* Gold tint overlay for blending */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, hsl(40 70% 50% / 0.05) 100%)" }} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28 pt-40">
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
          <p className="text-xs tracking-[0.4em] uppercase text-primary">
            Founder &bull; Engineer &bull; Visionary
          </p>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: "110%" }}
            animate={entered ? { y: 0 } : {}}
            transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9]"
          >
            Dr. Victor
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: "110%" }}
            animate={entered ? { y: 0 } : {}}
            transition={{ delay: 1.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] text-gradient-gold"
          >
            Ekpenyong
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 font-light leading-relaxed"
        >
          Engineering Energy. Building Enduring Impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.9, duration: 0.6 }}
          className="flex flex-wrap items-center gap-5"
        >
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_hsl(40_70%_50%/0.3)]"
          >
            <span className="relative z-10">Explore His Legacy</span>
          </button>
          <button
            onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 border border-primary/40 text-primary text-xs tracking-[0.3em] uppercase hover:bg-primary/10 transition-all duration-500"
          >
            View Gallery
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="flex flex-wrap gap-12 mt-20 pt-8 border-t border-primary/10"
        >
          {[
            { num: "15+", label: "Years in Energy" },
            { num: "3", label: "Elite Business Schools" },
            { num: "∞", label: "Lives Impacted" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="font-display text-3xl font-bold text-primary">{stat.num}</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
