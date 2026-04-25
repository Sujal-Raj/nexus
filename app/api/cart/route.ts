import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product"; // Required for population

/**
 * GET /api/cart?userId=...
 * Fetches the shopping cart for a specific user.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Find cart and populate product details in the items array
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found', items: [] }, { status: 200 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching cart', error: (error as Error).message },
      { status: 500 }
    );
  }
}