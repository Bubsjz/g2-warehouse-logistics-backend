const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";

const emailHelper = async (to, subject, text) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rountravellogistics@gmail.com",
      pass: "pnaj fyug yatu tljw",
    },
  });

  // Set up email options
  let mailOptions = {
    from: "rountravellogistics@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  emailHelper
}
