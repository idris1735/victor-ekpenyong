import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import kenyonHero from "@/assets/kenyon-hero.png";

const capabilities = [
  { num: "01", title: "Well Intervention & Control", desc: "Advanced techniques for complex well scenarios across challenging environments." },
  { num: "02", title: "Asset Integrity Solutions", desc: "Comprehensive integrity management ensuring operational safety and longevity." },
  { num: "03", title: "Production Optimization", desc: "Data-driven strategies to maximize output and operational efficiency." },
  { num: "04", title: "Technical Innovation", desc: "Pioneering engineering approaches that set new industry benchmarks." },
];

const KenyonSection = () => {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="kenyon" ref={ref} className="relative overflow-hidden">
      {/* Full-bleed image */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          src={kenyonHero}
          alt="Offshore oil platform at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* Overlay title */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-px bg-primary" />
                <p className="text-xs tracking-[0.4em] uppercase text-primary">Founded</p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9]">
                Kenyon
                <br />
                <span className="text-gradient-gold">International</span>
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Description + Quote */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground leading-[1.8] max-w-xl"
            >
              An indigenous oilfield services company specializing in well intervention and production optimization. Kenyon has become a trusted partner for operators seeking globally aligned upstream engineering solutions.
            </motion.p>

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative pl-8 border-l-2 border-primary"
            >
              <p className="font-display text-xl md:text-2xl italic text-foreground leading-relaxed">
                "The future of energy in Africa will be built by those willing to combine technical mastery with bold vision."
              </p>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mt-4">— Dr. Victor Ekpenyong</p>
            </motion.blockquote>
          </div>

          {/* Capabilities grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
                className="group bg-background p-8 hover:bg-card transition-all duration-700 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-700" />
                <span className="font-display text-4xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                  {cap.num}
                </span>
                <h3 className="font-display text-lg font-semibold mt-4 mb-3 group-hover:text-primary transition-colors duration-500">
                  {cap.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KenyonSection;
