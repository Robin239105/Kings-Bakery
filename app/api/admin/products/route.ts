import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { productInputSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          dietaryTags: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
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
    console.error("Admin products fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = productInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const pData = result.data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: pData.slug },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: "A product with this slug already exists." } },
        { status: 400 }
      );
    }

    // Connect dietary tags (tags should already exist, if not we skip)
    const connectDietary = pData.dietaryTags.map((tagIdOrLabel) => {
      // support connecting by ID or label
      return { id: tagIdOrLabel };
    });

    const newProduct = await prisma.product.create({
      data: {
        name: pData.name,
        slug: pData.slug,
        description: pData.description,
        shortTag: pData.shortTag,
        categoryId: pData.categoryId,
        price: pData.price,
        ingredients: pData.ingredients,
        allergens: pData.allergens,
        shelfLifeDays: pData.shelfLifeDays,
        isFeatured: pData.isFeatured,
        isActive: pData.isActive,
        stockStatus: pData.stockStatus,
        dietaryTags: {
          connect: connectDietary,
        },
      },
    });

    // Create product images
    for (const img of pData.images) {
      await prisma.productImage.create({
        data: {
          productId: newProduct.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        },
      });
    }

    const createdProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        images: true,
        dietaryTags: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: createdProduct });
  } catch (error: any) {
    console.error("Admin product create error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
