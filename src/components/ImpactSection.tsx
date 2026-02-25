import { useEffect, useRef, useState } from "react";
import { Heart, GraduationCap, Users } from "lucide-react";

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const ImpactSection = () => {
  const { ref, inView } = useInView();

  const pillars = [
    { icon: GraduationCap, title: "Educational Scholarships", desc: "Empowering the next generation through access to world-class education." },
    { icon: Users, title: "Youth Empowerment", desc: "Creating pathways for young Africans to lead in energy and innovation." },
    { icon: Heart, title: "Community Development", desc: "Building sustainable programs that uplift communities for the long term." },
  ];

  return (
    <section id="impact" className="section-padding bg-card/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Philanthropy</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
            The Victor & Helen <span className="text-gradient-gold">Foundation</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed">
            A nonprofit organization dedicated to educational scholarships, youth empowerment, and community development across Africa.
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="group text-center p-8 bg-card border border-border hover:border-primary/40 transition-all duration-500 hover-lift"
            >
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center border border-primary/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
