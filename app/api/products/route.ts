import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// /api/products/route.ts
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort");

  const query: any = {
    title: { $regex: search, $options: "i" },
  };

  let productsQuery = Product.find(query);

  if (sort === "price_asc") productsQuery = productsQuery.sort({ price: 1 });
  if (sort === "price_desc") productsQuery = productsQuery.sort({ price: -1 });

  const products = await productsQuery;

  return Response.json(products);
}