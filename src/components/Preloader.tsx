import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import veLogo from "@/assets/ve-logo-cropped.png";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 3 + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setPhase("reveal"), 400);
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 2000);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, hsl(40 70% 50% / 0.15), transparent 70%)" }}
            />
          </div>

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              phase === "reveal"
                ? { opacity: 1, scale: 1, y: -20 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mb-12"
          >
            <motion.img
              src={veLogo}
              alt="VE logo"
              className="w-[220px] md:w-[280px] h-auto object-contain [filter:drop-shadow(0_0_30px_hsl(40_70%_50%/0.42))_brightness(1.12)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <div
              className="absolute inset-x-8 -bottom-4 h-12 blur-2xl pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(40 70% 50% / 0.38), transparent 72%)" }}
            />
          </motion.div>

          {/* Name reveal */}
          <AnimatePresence>
            {phase === "reveal" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative z-10 text-center"
              >
                <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-3">
                  The Official Portfolio of
                </p>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Dr. Victor Ekpenyong
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          {phase === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48"
            >
              <div className="h-px bg-border overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground text-center mt-3">
                {Math.min(Math.floor(progress), 100)}%
              </p>
            </motion.div>
          )}

          {/* Decorative lines */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent origin-center"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
