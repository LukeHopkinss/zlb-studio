const supabase = require('../supabaseClient');
const { sendAdminNotification, sendUserConfirmation } = require('../mailer');

const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Store message in Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (error) throw error;

    // Send notification to you and confirmation to user
    await sendAdminNotification({ name, email, message });
    await sendUserConfirmation({ name, email, message });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error submitting contact form:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { submitContactForm };
