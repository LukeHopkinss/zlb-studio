import { useEffect, useState } from "react";
import ClienteleMarquee from "../components/ClienteleMarquee";
import Roadmap from "../components/Roadmap";
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
        <h1 className="text-7xl">zlb studio</h1>

        {showScrollText && !hideScrollText && (
          <div className="absolute left-1/2 translate-x-[-50%] top-[65%] text-sm flex flex-col items-center animate-fade-bob">
            <span>scroll down</span>
            <span className="text-base">↓</span>
          </div>
        )}
      </div>

 
      <div className="min-h-screen flex flex-col justify-start items-center pt-80">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl text-center">
            <p>here to provide simple solutions</p>
            <p>to complex challenges.</p>
        </motion.div>

        <div className="my-50 w-full">
          <ClienteleMarquee />
        </div>
      </div>


      <div className="min-h-screen flex flex-col items-start px-8 md:px-20 lg:px-32 max-w-5xl mx-auto space-y-2 transform translate-x-0 md:-translate-x-12 lg:-translate-x-100 -mt-[10rem]">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true}}
          className="space-y-4">
            <p className="text-3xl">zlb studio is a creative consulting partner for startups and brands,</p>
            <p className="text-3xl">blending imaginative vision with operational precision.</p>
            <p className="text-3xl">we speak both the language of creatives and the logic of business,</p>
            <p className="text-3xl">helping our clients grow with clarity, consistency, and meaningful results.</p>
        </motion.div>
      </div>

     

      <div className="relative -mt-[40rem]">
         <div className="absolute left-[65%] text-6xl font-creatoBold z-10">
            <p>our services</p>
        </div>
        <Roadmap />
      </div>

      <div className="relative w-full flex justify-center items-center -translate-y-[25rem] z-10 pb-40">
          <ContactButton />
      </div>
    </div>
  );
};

export default MainPage;
