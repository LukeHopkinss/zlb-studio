const { Resend } = require('resend');

// These values stay on the server. Never expose the API key in Vite variables.
const sendAdminNotification = async ({ name, email, message }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error('Resend is not configured');
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: ['luke.hopkins@outlook.com'],
    replyTo: email,
    subject: `New zlb studio inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });
  if (error || !data?.id) throw new Error('Resend did not accept the message');
  return data;
};

module.exports = { sendAdminNotification };
