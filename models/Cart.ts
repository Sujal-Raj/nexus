import mongoose from "mongoose";

// /models/Cart.ts
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

export default mongoose.models.Cart ||
  mongoose.model("Cart", cartSchema);