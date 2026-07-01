import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month"); // expected format: YYYY-MM (e.g. 2026-07)

    if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid or missing month parameter. Format must be YYYY-MM." } },
        { status: 400 }
      );
    }

    const [year, month] = monthParam.split("-").map((v) => parseInt(v, 10));

    // Get start and end dates of the queried month in UTC
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const slots = await prisma.deliverySlot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    console.error("Error fetching delivery slots:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
