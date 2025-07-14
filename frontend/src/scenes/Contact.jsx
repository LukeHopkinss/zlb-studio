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
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4">
      <h1 className="absolute text-3xl font-creatoBold top-110">Contact Us</h1>
      
      <ContactForm key={key} />
    </div>
  );
}
