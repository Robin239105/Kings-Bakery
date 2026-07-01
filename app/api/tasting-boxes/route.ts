import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tastingBoxes = await prisma.tastingBox.findMany({
      where: { isActive: true },
      include: {
        contents: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: tastingBoxes });
  } catch (error: any) {
    console.error("Error fetching tasting boxes:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
