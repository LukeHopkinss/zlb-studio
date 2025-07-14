const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendAdminNotification = async (data) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${data.name}`,
    text: `
You’ve received a new message:

Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
    `,
  };

  return transporter.sendMail(mailOptions);
};


const sendUserConfirmation = async (data) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Thank you for contacting ZLB Studio`,
    text: `Hi ${data.name},

Thank you for reaching out to ZLB Studio. We’ve received your message and will get back to you as soon as possible.

Here’s a copy of your message:
"${data.message}"

Best regards,  
ZLB Studio Team
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendAdminNotification, sendUserConfirmation };
