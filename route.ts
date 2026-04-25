import { NextRequest, NextResponse } from 'next/server';

// Mock data - In a real application, you would use a database client like Prisma or Mongoose here.
let products = [
  { id: '1', name: 'Sample Product', price: 29.99, stock: 100 },
  { id: '2', name: 'Merchant Item B', price: 45.00, stock: 50 },
];

/**
 * GET /api/merchant/products
 * Fetches all products for the merchant.
 */
export async function GET() {
  try {
    // Logic to fetch products from your database would go here.
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products', error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/merchant/products
 * Creates a new product for the merchant.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, stock } = body;

    // Basic validation
    if (!name || price === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: name and price' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: Math.random().toString(36).substring(7),
      name,
      price,
      stock: stock || 0,
    };

    // Logic to save to database
    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create product', error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Implementation Note:
 * To handle "remaining" APIs like Update (PUT/PATCH) or Delete (DELETE), 
 * you should create a dynamic route at:
 * d:\nexus\app\api\merchant\products\[id]\route.ts
 * 
 * That file would handle specific item operations using the ID from the params.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
