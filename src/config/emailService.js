const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rountravellogistics@gmail.com",
    pass: "pnaj fyug yatu tljw",
  },
  });


const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: "rountravellogistics@gmail.com",
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
