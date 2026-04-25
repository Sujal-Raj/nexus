import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

// /api/cart/add/route.ts
export async function POST(req: Request) {
  await connectDB();

  const { userId, productId } = await req.json();

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity: 1 }],
    });
  } else {
    cart.items.push({ product: productId, quantity: 1 });
    await cart.save();
  }

  return Response.json(cart);
}