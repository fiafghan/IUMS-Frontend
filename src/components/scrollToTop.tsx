import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scrollToTop"
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={scrollToTop}
          title="Back to top"
          className="fixed bottom-5 right-5 z-50 p-3 rounded-full
                     bg-gradient-to-br from-slate-800 to-slate-500
                     text-white 
                     shadow-[0_6px_15px_rgba(0,0,0,0.25)] 
                     hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)]
                     hover:scale-110 hover:-translate-y-0.5
                     active:scale-95 active:translate-y-0.5
                     focus:outline-none focus:ring-2 focus:slate-500 scale-80"
        >
          <ArrowUp className="w-5 h-5 drop-shadow-sm" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
