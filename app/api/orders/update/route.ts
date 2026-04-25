import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// /api/orders/update/route.ts
export async function PUT(req: Request) {
  await connectDB();

  const { orderId, status } = await req.json();

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return Response.json(order);
}