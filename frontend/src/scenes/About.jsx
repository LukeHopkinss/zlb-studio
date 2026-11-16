import { motion } from "framer-motion";
import ContactButton from "../components/ContactButton";
import Hopkins from "./Hopkins";
import useDocumentMeta from "../hooks/useDocumentMeta";

const About = () => {
  useDocumentMeta({
    title: "about",
    description:
      "Meet Luke Hopkins, founder of zlb studio, with experience at NBCUniversal and Y Combinator-backed startups. We design and build websites for startups and brands.",
    path: "/about",
  });

  return (
    <div className="relative bg-black text-white pt-20">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-12 font-creatoBold tracking-tight bg-gradient-to-r from-white via-gray-500 to-white bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient bg-[position:0%_50%]">
            About ZLB Studio
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8">
            ZLB Studio is a web studio that designs and builds websites for startups and brands.
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8">
            We handle everything from design to development, building fast, clean sites that are built to last.
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl">
            No templates — we design every site from scratch and work with you through every step of the process, from first concept to final build.
          </p>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="flex flex-col items-center pb-20 px-6 text-center">
        <Hopkins />
      </div>

      <div className="flex justify-center pt-20 pb-40 sm:pb-56 lg:pb-80">
        <ContactButton />
      </div>
    </div>
  );
};

export default About;

