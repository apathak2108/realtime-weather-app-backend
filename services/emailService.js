const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (recipientEmail, city, threshold) => {
  const mailOptions = {
    from: "propanany@gmail.com",
    to: recipientEmail,
    subject: `Temperature Alert for ${city}`,
    text: `The temperature in ${city} has exceeded the threshold ${threshold}!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending alert email:", error);
  }
};

module.exports = sendAlertEmail;
