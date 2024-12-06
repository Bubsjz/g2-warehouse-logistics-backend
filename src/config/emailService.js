const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    jsonTransport: true
const emailHelper = async (to, subject, text) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rountravellogistics@gmail.com",
      pass: "pnaj fyug yatu tljw",
    },
  });


const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: `Warehouse logistics" no-reply@rountravel.com`,
      to,
      subject,
      html: message,
    }
  
    const info = await transporter.sendMail(mailOptions)
  
    console.log("////////////////////////////////////////////////////////////////")
    console.log(info.messageId)
    console.log("Contenido del correo:");
    console.log(JSON.stringify(info, null, 2));
  } catch (error) {
    console.log(error)
  }
}


module.exports = { sendEmail }

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
