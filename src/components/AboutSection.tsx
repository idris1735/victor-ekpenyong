import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCounter } from "@/hooks/useCounter";
import engineering from "@/assets/engineering.png";

const AboutSection = () => {
  const { ref, inView } = useInView(0.1);
  const years = useCounter(15, 2000, inView);
  const schools = useCounter(3, 1800, inView);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden">
      {/* Full-width image break */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={engineering}
          alt="Engineering excellence"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/20 to-background" />
        <div className="absolute inset-0 bg-primary/5" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="w-full max-w-5xl">
            <div className="text-center mb-8">
              <p className="text-sm tracking-[0.4em] uppercase text-primary/90">Years of Excellence</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                { num: `${years}+`, label: "Years in Energy" },
                { num: `${schools}`, label: "Elite Business Schools" },
                { num: "∞", label: "Lives Impacted" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.7 }}
                  className="relative p-6 md:p-7 text-center bg-background/45 backdrop-blur-md border border-primary/30 rounded-xl shadow-[0_0_35px_hsl(40_70%_50%/0.16)]"
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
                  <motion.p
                    animate={stat.num === "∞" && inView ? { scale: [1, 1.08, 1] } : {}}
                    transition={stat.num === "∞" ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" } : {}}
                    className="font-display text-5xl md:text-6xl font-bold text-primary drop-shadow-[0_0_24px_hsl(40_70%_50%/0.55)]"
                  >
                    {stat.num}
                  </motion.p>
                  <p className="text-[11px] md:text-xs tracking-[0.26em] uppercase text-foreground/90 mt-2">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-primary" />
              <p className="text-xs tracking-[0.4em] uppercase text-primary">About</p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[0.95]">
              Upstream Engineering
              <br />
              <span className="text-gradient-gold">Specialist</span>
            </h2>
            <p className="text-muted-foreground leading-[1.8] text-lg mb-6 max-w-2xl">
              With over 15 years of experience in upstream oil and gas engineering, Dr. Victor Ekpenyong has built a reputation for combining deep technical expertise with entrepreneurial leadership.
            </p>
            <p className="text-muted-foreground leading-[1.8] max-w-2xl">
              His work spans drilling support, well control, asset integrity, and production optimization across complex operating environments — advancing African engineering capacity through globally competitive solutions.
            </p>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-primary mb-6 tracking-wide">
                Academic & Global Leadership
              </h3>
              {[
                { school: "Oxford Saïd Business School", type: "Executive Education" },
                { school: "Harvard Business School", type: "Executive Education" },
                { school: "Lagos Business School", type: "Executive Education" },
              ].map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                  className="group border-l-2 border-primary/20 pl-6 py-4 mb-2 hover:border-primary hover:bg-primary/5 transition-all duration-500"
                >
                  <p className="font-display text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {edu.school}
                  </p>
                  <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mt-1">
                    {edu.type}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="p-8 bg-card/60 backdrop-blur-sm border border-border relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
              <h3 className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4">Philosophy</h3>
              <p className="text-muted-foreground text-sm leading-[1.8] italic">
                "Sustainable enterprise growth is built on technical credibility, disciplined execution, and a strong commitment to people development."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
