import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { tastingBoxInputSchema } from "@/lib/zod-schemas";

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
    const result = tastingBoxInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const boxData = result.data;

    const box = await prisma.tastingBox.findUnique({
      where: { id },
    });

    if (!box) {
      return NextResponse.json(
        { success: false, error: { message: "Tasting box not found" } },
        { status: 404 }
      );
    }

    // Check slug uniqueness (if changed)
    if (box.slug !== boxData.slug) {
      const existing = await prisma.tastingBox.findUnique({
        where: { slug: boxData.slug },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: { message: "A tasting box with this slug already exists." } },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      await tx.tastingBox.update({
        where: { id },
        data: {
          name: boxData.name,
          slug: boxData.slug,
          description: boxData.description,
          itemCount: boxData.itemCount,
          price: boxData.price,
          heroImageUrl: boxData.heroImageUrl,
          isActive: boxData.isActive,
        },
      });

      // 2. Refresh items (delete old, insert new)
      await tx.tastingBoxItem.deleteMany({
        where: { boxId: id },
      });

      for (const item of boxData.contents) {
        await tx.tastingBoxItem.create({
          data: {
            boxId: id,
            name: item.name,
            thumbnailUrl: item.thumbnailUrl,
            isSwappable: item.isSwappable,
          },
        });
      }
    });

    const updatedBox = await prisma.tastingBox.findUnique({
      where: { id },
      include: { contents: true },
    });

    return NextResponse.json({ success: true, data: updatedBox });
  } catch (error: any) {
    console.error("Admin tasting box update error:", error);
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

    const box = await prisma.tastingBox.findUnique({
      where: { id },
    });

    if (!box) {
      return NextResponse.json(
        { success: false, error: { message: "Tasting box not found" } },
        { status: 404 }
      );
    }

    await prisma.tastingBox.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: { message: "Tasting box deleted successfully" } });
  } catch (error: any) {
    console.error("Admin tasting box delete error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
