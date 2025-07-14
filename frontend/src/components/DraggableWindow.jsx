import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const DraggableWindow = ({ children, onClose }) => {
  const constraintRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <>
      {/* Separate constraint area per window */}
      <div
        ref={constraintRef}
        className="fixed inset-0 pointer-events-none z-40"
      />

      {isReady && (
        <motion.div
          className="fixed top-[65vh] left-[10vw] w-[80vw] max-w-xl bg-black text-white shadow-xl border border-white rounded-lg z-50 p-6"
          drag
          dragConstraints={constraintRef}
          dragElastic={0}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex flex-col items-center justify-center text-center">
            <button
              onClick={onClose}
              className="absolute top-0 right-2 text-sm font-bold text-white hover:text-red-500"
            >
              ✕
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default DraggableWindow;



