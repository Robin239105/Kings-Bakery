import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
