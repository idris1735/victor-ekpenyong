import { motion } from "framer-motion";

const Footer = () => (
  <footer className="py-12 px-6 md:px-12 border-t border-border/50">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <span className="font-display text-2xl font-bold text-primary">VE<span className="text-foreground">.</span></span>
          <div className="w-px h-6 bg-border" />
          <p className="font-display text-sm text-muted-foreground tracking-wide">Dr. Victor Ekpenyong</p>
        </motion.div>
        <p className="text-xs text-muted-foreground tracking-[0.2em]">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
