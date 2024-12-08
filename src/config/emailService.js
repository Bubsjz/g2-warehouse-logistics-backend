const nodemailer = require("nodemailer");

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
      html: message,
    }
  
    const info = await transporter.sendMail(mailOptions)
  

  } catch (error) {
    console.log(error)
  }
}

module.exports = { 
  sendEmail 
}
