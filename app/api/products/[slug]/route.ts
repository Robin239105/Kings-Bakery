import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        dietaryTags: true,
        category: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
