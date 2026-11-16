const { sendAdminNotification } = require('../utils/mailer');

const submitContactForm = async (req, res) => {
  const { name, email, message, website } = req.body || {};
  if (website) return res.status(200).json({ success: true });
  if (
    typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
    typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== 'string' || !message.trim() || message.length > 5000
  ) {
    return res.status(400).json({ success: false, error: 'Please provide a valid name, email, and message.' });
  }
  try {
    await sendAdminNotification({ name: name.trim(), email: email.trim(), message: message.trim() });
    return res.status(200).json({ success: true });
  } catch {
    console.error('Contact delivery failed');
    return res.status(503).json({ success: false, error: 'Unable to send your message. Please try again later.' });
  }
};

module.exports = { submitContactForm };
