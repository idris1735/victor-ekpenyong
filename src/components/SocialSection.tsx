import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music2 } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const TIKTOK_POSTS = [
  "https://www.tiktok.com/@victoredikan3/video/7605180016111963413",
  "https://www.tiktok.com/@victoredikan3/video/7542960456965573896",
  "https://www.tiktok.com/@victoredikan3/video/7542263584118590738",
  "https://www.tiktok.com/@victoredikan3/video/7542261425838902535",
  "https://www.tiktok.com/@victoredikan3/video/7343946140947090693",
  "https://www.tiktok.com/@victoredikan3/video/7178498373800166405",
];

const getTikTokVideoId = (url: string) => {
  const match = url.match(/\/video\/(\d{10,})/);
  return match?.[1] ?? "";
};

const SocialSection = () => {
  const { ref, inView } = useInView(0.1);

  useEffect(() => {
    if (document.getElementById("tiktok-embed-script")) return;
    const script = document.createElement("script");
    script.id = "tiktok-embed-script";
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section id="social" ref={ref} className="section-padding bg-card/20 border-y border-primary/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary" />
            <p className="text-xs tracking-[0.5em] uppercase text-primary">Social Media</p>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Social <span className="text-gradient-gold">Highlights</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Real post previews using official TikTok post embed format.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIKTOK_POSTS.map((url, i) => {
            const videoId = getTikTokVideoId(url);
            return (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * i + 0.2, duration: 0.7 }}
                className="rounded-lg border border-primary/20 bg-background/55 backdrop-blur-sm overflow-hidden shadow-[0_8px_24px_hsl(220_20%_6%/0.2)]"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/15">
                  <Music2 className="w-4 h-4 text-primary" />
                  <p className="text-[11px] tracking-[0.25em] uppercase text-primary">TikTok</p>
                </div>

                <div className="p-2">
                  <blockquote
                    className="tiktok-embed"
                    cite={url}
                    data-video-id={videoId}
                    style={{ maxWidth: "100%", minWidth: "100%", margin: 0 }}
                  >
                    <section />
                  </blockquote>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
