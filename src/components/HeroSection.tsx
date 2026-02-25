import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/60" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        <p
          className="text-sm tracking-[0.3em] uppercase text-primary mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Founder &bull; Engineer &bull; Visionary
        </p>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          Dr. Victor
          <br />
          <span className="text-gradient-gold">Ekpenyong</span>
        </h1>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up font-light"
          style={{ animationDelay: "0.8s" }}
        >
          Engineering Energy. Building Enduring Impact.
        </p>

        <div
          className="flex items-center justify-center gap-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "1.1s" }}
        >
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Explore
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 border border-primary text-primary text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors duration-300"
          >
            Connect
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up" style={{ animationDelay: "1.5s" }}>
        <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent mx-auto" />
      </div>
    </section>
  );
};

export default HeroSection;
