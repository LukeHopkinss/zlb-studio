import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    return () => setSubmitted(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="w-full max-w-xl flex-col">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="border border-white p-6 text-white text-center"
          >
            <p className="text-xl">Thank you, your message has been sent.</p>
            <p className="text-xl">We will be in touch with you shortly.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input
              className="w-full bg-transparent border-b border-white placeholder-white text-white text-lg focus:outline-none"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
            <input
              className="w-full bg-transparent border-b border-white placeholder-white text-white text-lg focus:outline-none"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />
            <textarea
              className="w-full bg-transparent border-b border-white placeholder-white text-white text-lg focus:outline-none"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300"
            >
              Send
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

