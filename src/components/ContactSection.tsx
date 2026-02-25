import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const areas = ["Speaking", "Partnerships", "Advisory", "Foundation"];

const ContactSection = () => {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="contact" ref={ref} className="section-padding border-t border-border relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-primary" />
            <p className="text-xs tracking-[0.4em] uppercase text-primary">Engage</p>
            <div className="w-12 h-px bg-primary" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[0.95]">
            Start a
            <br />
            <span className="text-gradient-gold">Conversation</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-14 max-w-md mx-auto">
            Meaningful collaborations begin with a conversation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {areas.map((area, i) => (
            <motion.span
              key={area}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className="px-8 py-3 border border-primary/20 text-primary text-xs tracking-[0.3em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500 cursor-pointer hover:shadow-[0_0_30px_hsl(40_70%_50%/0.2)]"
            >
              {area}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 pt-8 border-t border-border/50"
        >
          <p className="text-muted-foreground text-sm italic font-display">
            "Meaningful collaborations begin with a conversation."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
