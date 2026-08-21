import { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const resetForm = () => setKey((prev) => prev + 1);
    window.addEventListener("beforeunload", resetForm);
    return () => window.removeEventListener("beforeunload", resetForm);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4 pt-12 pb-28">
      <h1 className="absolute text-2xl sm:text-3xl font-creatoBold top-24 sm:top-40 lg:top-60">Contact Us</h1>

      <h1 className="relative mt-16 sm:mt-24 lg:mt-40"><ContactForm key={key} /></h1>
    </div>
  );
}
