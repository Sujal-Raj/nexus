import { connectDB } from "@/lib/db";
import Merchant from "@/models/Merchant";
import User from "@/models/User";

// /api/auth/verify/route.ts
export async function POST(req: Request) {
  await connectDB();

  const { email, otp, role } = await req.json();

  const Model = role === "merchant" ? Merchant : User;

  const user = await Model.findOne({ email });

  if (!user || user.otp !== otp)
    return Response.json({ error: "Invalid OTP" });

  user.isVerified = true;
  user.otp = null;

  await user.save();

  return Response.json({ message: "Verified" });
}