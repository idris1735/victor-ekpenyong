import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { cmsApi, toSectionMap } from "@/lib/cms";
import galleryEngineering from "@/assets/gallery-life-engineering.jpg";
import galleryField from "@/assets/gallery-life-field.jpg";
import galleryLeadership from "@/assets/gallery-life-leadership.jpg";
import galleryCommunity from "@/assets/gallery-life-community.jpg";
import galleryRecognition from "@/assets/gallery-life-recognition.jpg";
import galleryPortrait from "@/assets/gallery-life-ve.jpg";

const fallbackImages = [
  { src: galleryEngineering, alt: "Engineering leadership in action" },
  { src: galleryRecognition, alt: "Recognition moment" },
  { src: galleryField, alt: "Operations on the field" },
  { src: galleryCommunity, alt: "Community engagement" },
  { src: galleryLeadership, alt: "Leadership presence" },
  { src: galleryPortrait, alt: "Dr. Victor portrait" },
];

const GalleryPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pageQuery = useQuery({
    queryKey: ["cms", "page", "home", "gallery-page"],
    queryFn: () => cmsApi.getPage("home"),
    retry: false,
  });
  const siteQuery = useQuery({
    queryKey: ["cms", "site", "gallery-page"],
    queryFn: cmsApi.getSite,
    retry: false,
  });
  const mediaQuery = useQuery({
    queryKey: ["cms", "gallery-public-media"],
    queryFn: () => cmsApi.getPublicMedia(),
    retry: false,
  });

  const sectionMap = toSectionMap(pageQuery.data);
  const galleryData = (sectionMap.gallery as Record<string, unknown>) || {};
  const imagesInput = Array.isArray(galleryData.images)
    ? (galleryData.images as Array<{ src?: string; alt?: string }>)
    : [];

  const curatedImages = useMemo(
    () =>
      imagesInput
        .filter((image) => typeof image.src === "string" && image.src.trim().length > 0)
        .map((image) => ({
          src: String(image.src),
          alt: String(image.alt || "Gallery image"),
        })),
    [imagesInput],
  );
  const uploadedImages = useMemo(
    () =>
      (mediaQuery.data?.items || []).map((media) => ({
        src: media.path,
        alt: media.alt_text || media.original_name || "Gallery image",
      })),
    [mediaQuery.data?.items],
  );
  const images = useMemo(() => {
    const merged = [...curatedImages, ...uploadedImages];
    const uniqueBySrc = new Map<string, { src: string; alt: string }>();
    for (const image of merged) {
      if (!uniqueBySrc.has(image.src)) {
        uniqueBySrc.set(image.src, image);
      }
    }
    return uniqueBySrc.size > 0 ? Array.from(uniqueBySrc.values()) : fallbackImages;
  }, [curatedImages, uploadedImages]);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation settings={siteQuery.data?.siteSettings} />

      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(40_70%_50%/.18),transparent_44%),radial-gradient(circle_at_bottom,hsl(215_80%_8%/.8),hsl(215_70%_4%_/_1))]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,hsl(40_70%_50%/.05)_40%,transparent_80%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xs tracking-[0.55em] uppercase text-primary mb-4">Museum Collection</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.92]">
              The <span className="text-gradient-gold">Legacy Gallery</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
              A curated visual archive of engineering, leadership, impact, and defining moments.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/"
                className="border border-primary/40 px-6 py-3 text-xs tracking-[0.25em] uppercase text-primary hover:bg-primary/10"
              >
                Back Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-8 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80">
              {images.length} Curated Frames
            </p>
            <p className="text-xs text-muted-foreground">Click any frame to view full artwork</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <motion.button
                key={`${image.src}-${index}`}
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06 * index }}
                className="group relative aspect-[4/5] overflow-hidden border border-primary/20 bg-card/40 text-left"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-primary/0 group-hover:ring-primary/60 transition-all duration-500" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/96 backdrop-blur-md p-6 md:p-10"
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute right-6 top-6 border border-primary/30 p-2 text-primary hover:bg-primary/10"
              aria-label="Close artwork preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto h-full max-w-6xl grid md:grid-cols-[4fr_1fr] gap-6 items-center">
              <img src={activeImage.src} alt={activeImage.alt} className="w-full max-h-[78vh] object-contain border border-primary/20" />
              <div>
                <p className="text-lg text-foreground mb-6">{activeImage.alt}</p>
                <p className="text-sm text-muted-foreground">
                  Curated Frame {activeIndex + 1} of {images.length}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Footer settings={siteQuery.data?.siteSettings} data={sectionMap.footer as Record<string, unknown>} />
    </div>
  );
};

export default GalleryPage;
