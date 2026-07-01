import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
