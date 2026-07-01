import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: { message: "Order not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Error fetching order by orderNumber:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
