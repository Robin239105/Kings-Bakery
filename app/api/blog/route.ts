import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }

    const [posts, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
