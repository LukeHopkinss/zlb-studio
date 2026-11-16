import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || result.success !== true) throw new Error('Request failed');
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
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
            role="status" className="border border-white p-6 text-white text-center"
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
            className="space-y-6" aria-busy={sending}
          >
            <label className="block space-y-2">
              <span>Your name</span>
            <input
              className="w-full bg-transparent border-b border-white placeholder-white text-white text-lg py-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-white"
              id="contact-name"
              autoComplete="name"
              maxLength={100}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
            </label>
            <label className="block space-y-2">
              <span>Your email</span>
            <input
              className="w-full bg-transparent border-b border-white placeholder-white text-white text-lg py-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-white"
              id="contact-email"
              autoComplete="email"
              maxLength={254}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            </label>
            <label className="block space-y-2">
              <span>Your message</span>
            <textarea
              className="w-full bg-transparent border-b border-white placeholder-white text-white text-lg py-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-white"
              id="contact-message"
              maxLength={5000}
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="A little about your project…"
              required
            />
            </label>
            <div hidden aria-hidden="true">
              <label>Website<input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" /></label>
            </div>
            <p className="text-sm text-neutral-400">We’ll use your details to respond to your inquiry. Read our <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                Something went wrong sending your message. Please try again or email luke.hopkins@outlook.com.
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

