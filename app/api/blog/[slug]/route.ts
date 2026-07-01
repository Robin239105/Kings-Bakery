import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: { message: "Blog post not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error fetching blog post by slug:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
