import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const isOpen = index !== null;
  const count = images.length;

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + count) % count);
  }, [index, count, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % count);
  }, [index, count, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };

    // Lock background scroll while open, and restore whatever the page had.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image"
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close expanded image"
            className="absolute top-4 right-5 text-white text-3xl leading-none opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            &times;
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 text-white text-4xl leading-none opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white px-2"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-6 text-white text-4xl leading-none opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white px-2"
              >
                &rsaquo;
              </button>
            </>
          )}

          <motion.img
            key={images[index]}
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            src={images[index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />

          {count > 1 && (
            <p className="absolute bottom-5 text-white text-xs opacity-60">
              {index + 1} / {count}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
