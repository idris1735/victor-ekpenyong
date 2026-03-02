import { motion } from "framer-motion";
import { Facebook, Linkedin, Music2 } from "lucide-react";
import veLogo from "@/assets/ve-logo-cropped.png";

const socialLinks = [
  { label: "TikTok", href: "https://www.tiktok.com/@victoredikan3", icon: Music2 },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/victorekpenyong/", icon: Linkedin },
  { label: "Facebook", href: "https://www.facebook.com/p/Victor-Ekpenyong-100063946333381/", icon: Facebook },
];

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
          <img
            src={veLogo}
            alt="VE logo"
            className="h-8 w-auto object-contain opacity-95 [filter:drop-shadow(0_0_14px_hsl(40_70%_50%/0.28))_brightness(1.1)]"
          />
          <div className="w-px h-6 bg-border" />
          <p className="font-display text-sm text-muted-foreground tracking-wide">Dr. Victor Ekpenyong</p>
        </motion.div>

        <div className="flex items-center gap-2">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="w-9 h-9 inline-flex items-center justify-center border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground tracking-[0.2em]">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
