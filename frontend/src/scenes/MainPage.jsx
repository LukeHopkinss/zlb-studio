import { useEffect, useState } from "react";
import ClienteleMarquee from "../components/ClienteleMarquee";
import {motion} from "framer-motion"
import ContactButton from "../components/ContactButton";
import WorkGrid from "../components/work/WorkGrid";
import useDocumentMeta from "../hooks/useDocumentMeta";

const MainPage = () => {
  const [hideScrollText, setHideScrollText] = useState(false);
  const [showScrollText, setShowScrollText] = useState(false);

  useDocumentMeta({
    title: "work",
    description:
      "zlb studio designs and builds websites for startups and brands, combining clean design with solid engineering. Founded by Luke Hopkins, with experience at NBCUniversal and Y Combinator-backed startups. See our work for PYM Magazine, NYU Stern LARA, Vista Kids Dental, and 2econd 2kin Magazine.",
    path: "/",
  });

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


      <div className="flex flex-col items-start px-6 sm:pl-28 sm:pr-12 lg:pl-38 lg:pr-16 max-w-5xl mx-auto sm:mx-0 space-y-2 -mt-[10rem]">
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
            <p className="text-xl sm:text-2xl lg:text-3xl">founded by Luke Hopkins, with experience at NBCUniversal and Y Combinator-backed startups.</p>
        </motion.div>
      </div>

      {/* Work sits in its own full-width container rather than inside the
          text block above — that block is deliberately left-anchored to the
          Z logo, so centering within it would land off-center on screen. */}
      <div className="w-full px-6 mt-32 sm:mt-44">
        <WorkGrid />
      </div>

     

      <div className="relative w-full flex justify-center items-center mt-20 pb-40">
          <ContactButton />
      </div>
    </div>
  );
};

export default MainPage;
