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

const AboutSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section-padding bg-background relative" ref={ref}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">About</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Upstream Engineering <span className="text-gradient-gold">Specialist</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary mb-8" />
          <p className="text-muted-foreground leading-relaxed mb-6">
            With over 15 years of experience in upstream oil and gas engineering, Dr. Victor Ekpenyong has built a reputation for combining deep technical expertise with entrepreneurial leadership.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            His work spans drilling support, well control, asset integrity, and production optimization across complex operating environments — advancing African engineering capacity through globally competitive solutions.
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-8">
            <h3 className="font-display text-xl font-semibold text-primary mb-6">Academic & Global Leadership Training</h3>
            {[
              { school: "Oxford Saïd Business School", type: "Executive Education" },
              { school: "Harvard Business School", type: "Executive Education" },
              { school: "Lagos Business School", type: "Executive Education" },
            ].map((edu, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors duration-300">
                <p className="font-display text-lg font-medium text-foreground">{edu.school}</p>
                <p className="text-sm text-muted-foreground tracking-wide">{edu.type}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-card border border-border rounded-sm">
            <h3 className="font-display text-lg font-semibold mb-3">Leadership Philosophy</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sustainable enterprise growth is built on technical credibility, disciplined execution, and a strong commitment to people development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
