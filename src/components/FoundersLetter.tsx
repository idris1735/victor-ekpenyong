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

const FoundersLetter = () => {
  const { ref, inView } = useInView();

  return (
    <section className="section-padding bg-card/20 border-t border-border" ref={ref}>
      <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-sm tracking-[0.3em] uppercase text-primary mb-6">The Founder's Letter</p>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-10" />
        <blockquote className="font-display text-2xl md:text-3xl italic leading-relaxed text-foreground mb-10">
          "I believe the future of Africa's energy sector will be built by those willing to combine technical mastery with bold vision. My mission is to continue building solutions that create impact, empower communities, and inspire the next generation of leaders."
        </blockquote>
        <p className="text-primary font-display text-lg tracking-wide">
          The future will not be inherited. It will be built.
        </p>
        <p className="text-muted-foreground text-sm mt-4 tracking-widest uppercase">— Dr. Victor Ekpenyong</p>
      </div>
    </section>
  );
};

export default FoundersLetter;
