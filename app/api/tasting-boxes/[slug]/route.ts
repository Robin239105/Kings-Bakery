import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const box = await prisma.tastingBox.findUnique({
      where: { slug },
      include: {
        contents: true,
      },
    });

    if (!box || !box.isActive) {
      return NextResponse.json(
        { success: false, error: { message: "Tasting box not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: box });
  } catch (error: any) {
    console.error("Error fetching tasting box by slug:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
