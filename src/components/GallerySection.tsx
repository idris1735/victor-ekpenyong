import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

import gallerySpeaking from "@/assets/gallery-speaking.png";
import galleryField from "@/assets/gallery-field.png";
import galleryBoardroom from "@/assets/gallery-boardroom.png";
import galleryCommunity from "@/assets/gallery-community.png";
import galleryAward from "@/assets/gallery-award.png";
import galleryBlueprints from "@/assets/gallery-blueprints.png";

const images = [
  { src: gallerySpeaking, alt: "Keynote speaking at energy conference", label: "Speaking", span: "col-span-2 row-span-1" },
  { src: galleryAward, alt: "Receiving industry award", label: "Recognition", span: "col-span-1 row-span-2" },
  { src: galleryField, alt: "On-site at oil facility", label: "In the Field", span: "col-span-1 row-span-1" },
  { src: galleryBlueprints, alt: "Engineering blueprints and design", label: "Engineering", span: "col-span-1 row-span-1" },
  { src: galleryBoardroom, alt: "Boardroom leadership", label: "Leadership", span: "col-span-1 row-span-1" },
  { src: galleryCommunity, alt: "Community engagement", label: "Community", span: "col-span-1 row-span-1" },
];

const GallerySection = () => {
  const { ref, inView } = useInView(0.05);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="gallery" ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary" />
            <p className="text-xs tracking-[0.5em] uppercase text-primary">Portfolio</p>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            A Life in <span className="text-gradient-gold">Frames</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Moments that define a legacy — from boardrooms to oil fields, from stages to communities.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[250px] md:auto-rows-[280px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.8 }}
              className={`relative overflow-hidden cursor-pointer group ${img.span}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <motion.img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700"
                animate={{
                  scale: hoveredIdx === i ? 1.08 : 1,
                }}
                transition={{ duration: 0.7 }}
              />
              {/* Dark overlay */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  hoveredIdx === i
                    ? "bg-background/40"
                    : "bg-background/10"
                }`}
              />
              {/* Gold border on hover */}
              <div
                className={`absolute inset-0 border-2 transition-all duration-500 ${
                  hoveredIdx === i
                    ? "border-primary/60"
                    : "border-transparent"
                }`}
              />
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: hoveredIdx === i ? 1 : 0,
                  y: hoveredIdx === i ? 0 : 20,
                }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-primary" />
                  <p className="text-xs tracking-[0.3em] uppercase text-primary">{img.label}</p>
                </div>
                <p className="text-sm text-foreground mt-2 font-light">{img.alt}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
