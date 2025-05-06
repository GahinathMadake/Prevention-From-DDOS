const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, htmlBody) =>{
  const msg = {
    to,
    from:process.env.SENDGRID_EMAIL,
    subject,
    text: htmlBody.replace(/<[^>]*>?/gm, ''), // Fallback plain text
    html: htmlBody,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully to', to);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
