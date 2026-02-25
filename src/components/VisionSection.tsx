import { useEffect, useRef, useState } from "react";

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

const VisionSection = () => {
  const { ref, inView } = useInView();

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

  return (
    <section id="vision" className="section-padding bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Vision</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
            African Energy <span className="text-gradient-gold">Future</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary mb-8" />

          <div className="space-y-6">
            {visions.map((v, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-primary font-display text-2xl font-bold opacity-30">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">{v.label}</h3>
                  <p className="text-muted-foreground text-sm">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Speaking</p>
          <h3 className="font-display text-2xl font-bold mb-8">Topics & Engagements</h3>

          <div className="space-y-4">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-4 border border-border hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-2 h-2 bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
                <span className="text-foreground text-sm tracking-wide">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
