import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const dietaryTags = searchParams.get("dietary"); // e.g. "Gluten-Free,Vegan"
    const sort = searchParams.get("sort") || "featured";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const skip = (page - 1) * limit;

    // Build filter query
    const where: any = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (dietaryTags) {
      const tagsList = dietaryTags.split(",").map((t) => t.trim());
      where.dietaryTags = {
        some: {
          label: { in: tagsList },
        },
      };
    }

    // Build order query
    let orderBy: any = {};
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else {
      // default: featured
      orderBy = [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ];
    }

    // Query DB
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          dietaryTags: true,
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
