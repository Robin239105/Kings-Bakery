import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { productInputSchema } from "@/lib/zod-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const result = productInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const pData = result.data;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { dietaryTags: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    // Check slug uniqueness (if changed)
    if (product.slug !== pData.slug) {
      const existing = await prisma.product.findUnique({
        where: { slug: pData.slug },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: { message: "A product with this slug already exists." } },
          { status: 400 }
        );
      }
    }

    // Update Product & disconnect previous dietary tags
    const disconnectDietary = product.dietaryTags.map((tag) => ({ id: tag.id }));
    const connectDietary = pData.dietaryTags.map((tagId) => ({ id: tagId }));

    await prisma.$transaction(async (tx) => {
      // 1. Update basic info and tags
      await tx.product.update({
        where: { id },
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
            disconnect: disconnectDietary,
            connect: connectDietary,
          },
        },
      });

      // 2. Refresh images (delete old, insert new)
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      for (const img of pData.images) {
        await tx.productImage.create({
          data: {
            productId: id,
            url: img.url,
            altText: img.altText,
            sortOrder: img.sortOrder,
          },
        });
      }
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        dietaryTags: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    console.error("Admin product update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: { message: "Product deleted successfully" } });
  } catch (error: any) {
    console.error("Admin product delete error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
