import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import portrait from "@/assets/portrait.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      {/* Portrait */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-0 bottom-0 hidden lg:block w-[45%] h-full"
      >
        <img
          src={portrait}
          alt="Dr. Victor Ekpenyong"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32 pt-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-px bg-primary" />
          <p className="text-xs tracking-[0.4em] uppercase text-primary">
            Founder &bull; Engineer &bull; Visionary
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] mb-8 max-w-4xl"
        >
          Dr. Victor
          <br />
          <span className="text-gradient-gold">Ekpenyong</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 font-light leading-relaxed"
        >
          Engineering Energy. Building Enduring Impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap items-center gap-5"
        >
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="group px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.3em] uppercase transition-all duration-500 hover:shadow-[0_0_40px_hsl(40_70%_50%/0.3)]"
          >
            Explore His Legacy
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 border border-primary/40 text-primary text-xs tracking-[0.3em] uppercase hover:bg-primary/10 transition-all duration-500"
          >
            Connect
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
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
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
