const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
  });


const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.AUTH_USER,
      to: to,
      subject: subject,
      text: message,
    }
  
    const info = await transporter.sendMail(mailOptions)
    // console.log=(info)
  
    console.log("////////////////////////////////////////////////////////////////")
    // console.log(info.messageId)
    // console.log("Contenido del correo:");
    console.log(JSON.stringify(info, null, 2));
  } catch (error) {
    console.log(error)
  }
}

module.exports = { 
  sendEmail 
}
