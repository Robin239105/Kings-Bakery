import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

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
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid or missing status parameter" } },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: { message: "Order not found" } },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error("Admin order update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
