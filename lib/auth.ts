// /lib/auth.ts
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });