import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DraggableWindow from "../components/DraggableWindow";
import ContactButton from "../components/ContactButton";
import Hopkins from "./Hopkins";
import Reyzin from "./Reyzin";
import Topacio from "./Topacio";
import Villarreal from "./Villarreal";

const About = () => {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (id) => {
    if (!openWindows.includes(id)) {
      setOpenWindows((prev) => [...prev, id]);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows((prev) => prev.filter((win) => win !== id));
  };

  const renderWindowContent = (id) => {
    switch (id) {
      case 1:
        return <Hopkins />;
      case 2:
        return <Reyzin />;
      case 3:
        return <Topacio />;
      case 4:
        return <Villarreal />;
      default:
        return null;
    }
  };

  // Close windows on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openWindows.length > 0) {
        setOpenWindows([]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [openWindows]);

  return (
    <div className="relative bg-black text-white">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-xl"
        >
          <h1 className="text-6xl mb-12 font-creatoBold tracking-tight bg-gradient-to-r from-white via-gray-500 to-white bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient bg-[position:0%_50%]">
            About ZLB Studio
          </h1>
          <p className="text-2xl mb-8">
            ZLB Studio is a creative consulting studio that helps companies grow with boldness in both creative vision and operational strategy.
          </p>
          <p className="text-2xl mb-8">
            We collaborate with brands ready to lead with clarity and imagination, bridging the gap between expressive design and strategic execution to craft work that moves and endures.
          </p>
          <button
            onClick={() => {
              const section = document.getElementById("team-section");
              section?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-xl px-6 py-2 bg-white text-black rounded hover:bg-gray-300 transition"
          >
            Meet the Team
          </button>
        </motion.div>
      </div>

      {/* Scroll Target Section */}
      <div
        id="team-section"
        className="min-h-screen flex flex-col items-center justify-center pt-32 text-center"
      >
        <h2 className="text-4xl font-creatoBold mb-6">Our Team</h2>
        <p className="text-lg mb-8">Meet the minds behind ZLB Studio.</p>
        <div className="flex flex-wrap justify-center gap-4">
          {[{ id: 1, name: "Luke Hopkins" }, { id: 2, name: "Nick Reyzin" }, { id: 3, name: "Luke Topacio" }, { id: 4, name: "Roberto Villarreal" }].map(({ id, name }) => (
            <button
              key={id}
              className="px-5 py-2 bg-white text-xl text-black rounded hover:bg-gray-300 transition"
              onClick={() => openWindow(id)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center -mt-[17.5rem] pb-80">
        <ContactButton />
      </div>
    

      <AnimatePresence>
        {/* Render Multiple Draggable Windows with unique content */}
        {openWindows.map((id) => (
          <DraggableWindow key={id} onClose={() => closeWindow(id)}>
            {renderWindowContent(id)}
          </DraggableWindow>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default About;

