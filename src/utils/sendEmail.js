const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sample.work.instagram@gmail.com",
    pass: "iiyl elyd xiaf utbq",
  },
});

async function sendEmail(emailOption) {
  const mailOption = {
    to: emailOption.to,
    subject: emailOption.subject,
    text: emailOption.text,
    html: emailOption.html,
  };

  transporter.sendMail(mailOption, (err) => {
    if (err) {
      throw err;
    }
    return true;
  });
}

module.exports = sendEmail;
