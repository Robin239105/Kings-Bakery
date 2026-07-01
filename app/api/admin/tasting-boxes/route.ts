import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { tastingBoxInputSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const boxes = await prisma.tastingBox.findMany({
      include: {
        contents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: boxes });
  } catch (error: any) {
    console.error("Admin tasting boxes fetch error:", error);
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
    const result = tastingBoxInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const boxData = result.data;

    // Check slug uniqueness
    const existing = await prisma.tastingBox.findUnique({
      where: { slug: boxData.slug },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: "A tasting box with this slug already exists." } },
        { status: 400 }
      );
    }

    const createdBox = await prisma.$transaction(async (tx) => {
      const box = await tx.tastingBox.create({
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

      for (const item of boxData.contents) {
        await tx.tastingBoxItem.create({
          data: {
            boxId: box.id,
            name: item.name,
            thumbnailUrl: item.thumbnailUrl,
            isSwappable: item.isSwappable,
          },
        });
      }

      return box;
    });

    const fullBox = await prisma.tastingBox.findUnique({
      where: { id: createdBox.id },
      include: { contents: true },
    });

    return NextResponse.json({ success: true, data: fullBox });
  } catch (error: any) {
    console.error("Admin tasting box create error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
