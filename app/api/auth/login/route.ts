// /api/auth/login/route.ts
import { comparePassword, generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Merchant from "@/models/Merchant";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { email, password, role } = await req.json();

  const Model = role === "merchant" ? Merchant : User;

  const user = await Model.findOne({ email });

  if (!user) return Response.json({ error: "Not found" });

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) return Response.json({ error: "Wrong password" });

  const token = generateToken({ id: user._id, role });

  const res = Response.json({ 
    message: "Logged in",
    userId: user._id.toString(),
    role 
  });

  res.headers.set(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; Secure`
  );

  return res;
}