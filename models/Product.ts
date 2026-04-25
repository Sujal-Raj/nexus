import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Use existing model if it exists, otherwise create it
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;