import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
    addresses: [
      {
        fullName: String,
        address: String,
        city: String,
        pincode: String,
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);