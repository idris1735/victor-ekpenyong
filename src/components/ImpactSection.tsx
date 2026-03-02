import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Heart, GraduationCap, Users } from "lucide-react";
import bigmanPhoto from "@/assets/gallery-life-bigman.jpg";

const pillars = [
  {
    icon: GraduationCap,
    title: "Educational Scholarships",
    desc: "Empowering the next generation through access to world-class education and mentorship programs.",
  },
  {
    icon: Users,
    title: "Youth Empowerment",
    desc: "Creating pathways for young Africans to lead in energy, technology, and innovation.",
  },
  {
    icon: Heart,
    title: "Community Development",
    desc: "Building sustainable programs that uplift communities and create lasting social impact.",
  },
];

const ImpactSection = () => {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="impact" ref={ref} className="relative overflow-hidden">
      {/* Split layout: image left, content right */}
      <div className="grid lg:grid-cols-2 min-h-[80vh]">
        {/* Image side */}
        <div className="relative h-[50vh] lg:h-auto overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
            src={bigmanPhoto}
            alt="Dr. Victor Ekpenyong - Victor and Helen Foundation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>

        {/* Content side */}
        <div className="section-padding flex items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-primary" />
                <p className="text-xs tracking-[0.4em] uppercase text-primary">Philanthropy</p>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-[0.95]">
                The Victor & Helen
                <br />
                <span className="text-gradient-gold">Foundation</span>
              </h2>
              <p className="text-muted-foreground leading-[1.8] mb-12">
                A nonprofit organization dedicated to educational scholarships, youth empowerment, and community development across Africa.
              </p>
            </motion.div>

            <div className="space-y-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.7 }}
                  className="group flex gap-5 p-5 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-500"
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-primary/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
