import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const mailService = {
    async sendEmail({ to, subject, text, html }) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER, 
          to,
          subject, 
          text, 
          html, 
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    },
  };
  
  export default mailService;