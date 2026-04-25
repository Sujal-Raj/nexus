import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// /api/orders/create/route.ts
export async function POST(req: Request) {
  await connectDB();

  const { userId, items, address } = await req.json();

  const total = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: userId,
    items,
    totalAmount: total,
    address,
  });

  return Response.json(order);
}