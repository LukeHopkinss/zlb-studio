const { sendAdminNotification, sendUserConfirmation } = require('../utils/mailer');

const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendAdminNotification({ name, email, message });
    await sendUserConfirmation({ name, email, message });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error submitting contact form:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { submitContactForm };
