import { useEffect, useRef, useState } from "react";
import sectionBg from "@/assets/section-bg.jpg";

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

const KenyonSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="kenyon" className="relative section-padding overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${sectionBg})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className={`max-w-2xl transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Founded</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Kenyon <span className="text-gradient-gold">International</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary mb-8" />
          <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
            An indigenous oilfield services company specializing in well intervention and production optimization. Kenyon has become a trusted partner for operators seeking globally aligned upstream engineering solutions.
          </p>

          <blockquote className="border-l-2 border-primary pl-6 py-2 mb-10">
            <p className="font-display text-lg italic text-foreground leading-relaxed">
              "The future of energy in Africa will be built by those willing to combine technical mastery with bold vision."
            </p>
          </blockquote>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { title: "Well Intervention", desc: "Advanced well control and intervention services" },
            { title: "Asset Integrity", desc: "Comprehensive integrity management solutions" },
            { title: "Production Optimization", desc: "Maximizing output through engineering innovation" },
            { title: "Technical Innovation", desc: "Cutting-edge engineering approaches" },
          ].map((cap, i) => (
            <div
              key={i}
              className="group p-6 bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-500 hover-lift"
            >
              <div className="w-8 h-0.5 bg-primary mb-4 group-hover:w-12 transition-all duration-500" />
              <h3 className="font-display text-lg font-semibold mb-2">{cap.title}</h3>
              <p className="text-sm text-muted-foreground">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KenyonSection;
