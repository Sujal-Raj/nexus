// /lib/mail.ts
// import nodemailer from "nodemailer";
import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Ecommerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};