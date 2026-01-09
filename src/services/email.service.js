import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  if (!to) {No
    throw new Error(" recipients defined");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
   from: `"MyShop Security" <${process.env.EMAIL_USER}>`,
    to: to,              // 👈 THIS MUST EXIST
    subject: subject,
    text: text,
  });
};

export default sendEmail;
