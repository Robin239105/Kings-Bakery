import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { blogPostInputSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Admin session required." } },
        { status: 401 }
      );
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    console.error("Admin blog posts fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

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
    const result = blogPostInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const postData = result.data;

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug: postData.slug },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: "A blog post with this slug already exists." } },
        { status: 400 }
      );
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        bodyHtml: postData.bodyHtml,
        category: postData.category,
        heroImageUrl: postData.heroImageUrl,
        authorName: postData.authorName,
        authorAvatarUrl: postData.authorAvatarUrl,
        readTimeMins: postData.readTimeMins,
        isFeatured: postData.isFeatured,
      },
    });

    return NextResponse.json({ success: true, data: newPost });
  } catch (error: any) {
    console.error("Admin blog post create error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
