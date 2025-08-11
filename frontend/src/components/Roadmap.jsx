import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";


export default function Roadmap() {
  const steps = [
    { id: 'Branding', desc: 'We develop comprehensive brand systems, including visual identity, tone of voice, and positioning frameworks to establish clear, scalable foundations for growth and recognition.' },
    { id: 'Multi-Media Marketing', desc: 'Designing and deploying integrated campaigns across video, photography, social platforms, and digital channels, we use data-driven insights to maximize reach and engagement.' },
    { id: 'Creative Direction', desc: 'We oversee end-to-end creative execution by aligning visual strategy, narrative development, and production workflows to ensure consistent and compelling brand expression.' },
    { id: 'Web Development & Design', desc: 'Through design and engineering of high-performance, responsive websites using modern frameworks and UI/UX best practices, we make each build optimized for accessibility, conversion, and long-term scalability.' },
    { id: 'CRM', desc: 'We configure and integrate customer relationship management platforms tailored to your workflow. This enables personalized communication, sales pipeline visibility, and automated engagement strategies.' },
  ];

  const [hoveredStep, setHoveredStep] = useState(null);

  const stepGapVH = 60;
  const circleOffsetVH = 15;
  const totalHeightVH = steps.length * stepGapVH + 30;

  useEffect(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-stroke');
          entry.target.classList.remove('opacity-0');
        }
      });
    },
    { threshold: 0.1 }
  );

  const paths = document.querySelectorAll('.path-segment');
  paths.forEach(path => observer.observe(path));

  return () => {
    paths.forEach(path => observer.unobserve(path));
  };
}, []);


  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `${totalHeightVH}vh` }}
    >
      {/* SVG winding path */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox={`0 0 100 100`}
        preserveAspectRatio="none"
      >
        {steps.map((step, index) => {
          if (index === 0) return null;

          const isEven = index % 2 === 0;
          const x = isEven ? 70 : 30;
          const y = (index * stepGapVH * 100) / totalHeightVH + 6;

          const prevEven = (index - 1) % 2 === 0;
          const prevX = prevEven ? 70 : 30;
          const prevY = ((index - 1) * stepGapVH * 100) / totalHeightVH + 6;
          const controlY = (prevY + y) / 2;

          const pathData = `M ${prevX} ${prevY} C ${prevX} ${controlY}, ${x} ${controlY}, ${x} ${y}`;

          return (
            <path
              key={index}
              d={pathData}
              stroke="gray"
              strokeWidth="0.5"
              fill="none"
              className="path-segment opacity-0"
              style={{ animationDelay: `${0.2 + index * 0.2}s` }}
            />
          );
        })}
      </svg>

      {/* Step markers */}
      {steps.map((step, index) => {
        const isEven = index % 2 === 0;
        const isHovered = hoveredStep === step.id;

        return (
          <div
            key={step.id}
            className="absolute transform flex flex-col items-center text-white transition-all duration-300"
            style={{
              top: `calc(${index * stepGapVH}vh + ${circleOffsetVH}vh)`,
              left: isEven ? '70vw' : '30vw',
              transform: 'translateX(-50%)',
            }}
            onMouseEnter={() => setHoveredStep(step.id)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div
              className="rounded-full bg-white text-black font-bold flex items-center justify-center shadow-lg transition-all duration-300 text-center overflow-hidden"
              style={{
                width: isHovered ? '30vw' : '10vw',
                height: isHovered ? '30vw' : '10vw',
                fontSize: isHovered ? '1.25rem' : '1rem',
                paddingLeft: isHovered ? '1rem' : '0',
                paddingRight: isHovered ? '1rem' : '0',
              }}
            >
              <AnimatePresence mode="wait">
                {isHovered ? (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="px-4"
                  >
                    {step.desc}
                  </motion.div>
                ) : (
                  <motion.div
                    key="id"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-xl font-creatoBold hidden md:block"
                  >
                    {step.id}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isHovered && (
              <div className="text-sm text-white font-creatoBold mt-2 block md:hidden text-center">
                {step.id}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}











