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

const areas = ["Speaking", "Partnerships", "Advisory", "Foundation"];

const ContactSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="section-padding bg-background border-t border-border" ref={ref}>
      <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Engage</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
          Start a <span className="text-gradient-gold">Conversation</span>
        </h2>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-8" />
        <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
          Meaningful collaborations begin with a conversation.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {areas.map((area) => (
            <span
              key={area}
              className="px-6 py-2 border border-primary/30 text-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
