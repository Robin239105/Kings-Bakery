import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";

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
    const { date, isFullyBooked, capacity } = body;

    if (!date || isNaN(Date.parse(date))) {
      return NextResponse.json(
        { success: false, error: { message: "Valid date is required." } },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const dateQueryStart = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));

    const slot = await prisma.deliverySlot.upsert({
      where: { date: dateQueryStart },
      update: {
        isFullyBooked: isFullyBooked ?? false,
        capacity: capacity ?? 20,
      },
      create: {
        date: dateQueryStart,
        isFullyBooked: isFullyBooked ?? false,
        capacity: capacity ?? 20,
        bookedCount: 0,
      },
    });

    return NextResponse.json({ success: true, data: slot });
  } catch (error: any) {
    console.error("Admin delivery slot update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
