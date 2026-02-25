import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import visionAfrica from "@/assets/vision-africa.png";

const visions = [
  { label: "The Future", text: "Indigenous expertise supported by global standards." },
  { label: "Resilience", text: "Building self-sustaining energy ecosystems." },
  { label: "Investment", text: "Treating talent as the primary infrastructure of long-term growth." },
];

const topics = [
  "Indigenous Energy Leadership in Africa",
  "Engineering-Led Enterprise Building",
  "Innovation in Emerging Energy Markets",
  "Building Resilient African Institutions",
];

const VisionSection = () => {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="vision" ref={ref} className="relative overflow-hidden">
      {/* Full-bleed vision image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          src={visionAfrica}
          alt="Africa's energy future - futuristic skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-center"
          >
            The <span className="text-gradient-gold">Future</span>
          </motion.h2>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          {/* Vision pillars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-primary" />
              <p className="text-xs tracking-[0.4em] uppercase text-primary">Vision</p>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-12 leading-tight">
              African Energy <span className="text-gradient-gold">Tomorrow</span>
            </h3>

            <div className="space-y-10">
              {visions.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.6 }}
                  className="flex gap-6 items-start group"
                >
                  <span className="font-display text-5xl font-bold text-primary/10 group-hover:text-primary/30 transition-colors duration-500 leading-none">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {v.label}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{v.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Speaking topics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-primary" />
              <p className="text-xs tracking-[0.4em] uppercase text-primary">Speaking</p>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-12 leading-tight">
              Topics & <span className="text-gradient-gold">Engagements</span>
            </h3>

            <div className="space-y-0 border-t border-border">
              {topics.map((topic, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  className="group flex items-center gap-5 py-6 border-b border-border hover:border-primary/30 hover:pl-4 transition-all duration-500 cursor-pointer"
                >
                  <div className="w-2 h-2 bg-primary/20 group-hover:bg-primary group-hover:shadow-[0_0_15px_hsl(40_70%_50%/0.5)] transition-all duration-500 rounded-full" />
                  <span className="text-foreground group-hover:text-primary transition-colors duration-500 tracking-wide">
                    {topic}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
