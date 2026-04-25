import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: Boolean,
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Merchant ||
  mongoose.model("Merchant", merchantSchema);