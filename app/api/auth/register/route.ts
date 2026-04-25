// /api/auth/register/route.ts
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    email,
    password,
    otp,
    otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOTP(email, otp);

  return Response.json({ message: "OTP sent" });
}