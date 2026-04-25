import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// /api/products/create/route.ts
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const product = await Product.create(body);

  return Response.json(product);
}