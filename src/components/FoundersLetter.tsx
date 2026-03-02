import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import textureDark from "@/assets/texture-dark.png";

interface FoundersLetterProps {
  data?: Record<string, unknown>;
}

const FoundersLetter = ({ data }: FoundersLetterProps) => {
  const { ref, inView } = useInView(0.1);
  const letterData = data || {};

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={String(letterData.background || textureDark)} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary" />
              <p className="text-xs tracking-[0.5em] uppercase text-primary">{String(letterData.eyebrow || "The Founder's Letter")}</p>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <span className="font-display text-8xl text-primary/20 leading-none block mb-4">"</span>
              <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl italic leading-[1.4] text-foreground -mt-16 mb-12">
                {String(
                  letterData.quote ||
                    "I believe the future of Africa's energy sector will be built by those willing to combine technical mastery with bold vision. My mission is to continue building solutions that create impact, empower communities, and inspire the next generation of leaders.",
                )}
              </blockquote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-gradient-gold font-display text-xl md:text-2xl tracking-wide">
                {String(letterData.line || "The future will not be inherited. It will be built.")}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-primary/40" />
                <p className="text-xs text-muted-foreground tracking-[0.4em] uppercase">{String(letterData.signoff || "Dr. Victor Ekpenyong")}</p>
                <div className="w-8 h-px bg-primary/40" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FoundersLetter;
