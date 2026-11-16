import ContactForm from "../components/ContactForm";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function Contact() {
  useDocumentMeta({
    title: "contact",
    description: "Start a project with zlb studio. Tell us what you're building and we'll get back to you.",
    path: "/contact",
  });

  return (
    <main className="min-h-[80svh] text-white px-6 pt-36 pb-16 sm:pt-44 lg:pt-52">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-creatoBold">Contact Us</h1>
        <p className="mt-4 mb-10 text-neutral-400">Tell us what you’re building. We’d love to hear about it.</p>
        <ContactForm />
      </div>
    </main>
  );
}
