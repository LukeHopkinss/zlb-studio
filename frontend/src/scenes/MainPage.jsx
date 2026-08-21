import { useEffect, useState } from "react";
import ClienteleMarquee from "../components/ClienteleMarquee";
import {motion} from "framer-motion"
import ContactButton from "../components/ContactButton";

const MainPage = () => {
  const [hideScrollText, setHideScrollText] = useState(false);
  const [showScrollText, setShowScrollText] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
        setShowScrollText(true);
    }, 5000);

    const handleScroll = () => {
      if (window.scrollY > 10) {
      setHideScrollText(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    return (
    <div className="relative text-white bg-black overflow-x-hidden">

      <div className="flex justify-center items-center h-screen relative">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl">zlb studio</h1>

        {showScrollText && !hideScrollText && (
          <div className="absolute left-1/2 translate-x-[-50%] top-[65%] text-sm flex flex-col items-center animate-fade-bob">
            <span>scroll down</span>
            <span className="text-base">↓</span>
          </div>
        )}
      </div>

 
      <div className="min-h-screen flex flex-col justify-start items-center pt-32 sm:pt-52 lg:pt-80">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl lg:text-5xl text-center px-6">
            <p>here to provide simple solutions</p>
            <p>to complex challenges.</p>
        </motion.div>

        <div className="my-24 sm:my-32 lg:my-50 w-full">
          <ClienteleMarquee />
        </div>
      </div>


      <div className="min-h-screen flex flex-col items-start px-6 md:px-20 lg:px-32 max-w-5xl mx-auto space-y-2 transform translate-x-0 md:-translate-x-12 lg:-translate-x-50 -mt-[10rem]">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true}}
          className="space-y-4">
            <p className="text-xl sm:text-2xl lg:text-3xl">zlb studio designs and builds websites for startups and brands,</p>
            <p className="text-xl sm:text-2xl lg:text-3xl">combining clean design with solid engineering.</p>
            <p className="text-xl sm:text-2xl lg:text-3xl">from first concept to launch, we handle the full build,</p>
            <p className="text-xl sm:text-2xl lg:text-3xl">helping our clients ship fast with sites that actually work.</p>
        </motion.div>
      </div>

     

      <div className="relative w-full flex justify-center items-center mt-20 pb-40">
          <ContactButton />
      </div>
    </div>
  );
};

export default MainPage;
