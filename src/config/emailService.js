const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    jsonTransport: true
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
