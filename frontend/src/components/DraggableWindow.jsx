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
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
          <motion.div
            className="pointer-events-auto w-full max-w-xl max-h-[80vh] overflow-y-auto bg-black text-white shadow-xl border border-white rounded-lg p-6"
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
        </div>
      )}
    </>
  );
};

export default DraggableWindow;



