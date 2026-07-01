import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/auth";
import { blogPostInputSchema } from "@/lib/zod-schemas";

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
    const result = blogPostInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const postData = result.data;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: { message: "Blog post not found" } },
        { status: 404 }
      );
    }

    // Check slug uniqueness (if changed)
    if (post.slug !== postData.slug) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: postData.slug },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: { message: "A blog post with this slug already exists." } },
          { status: 400 }
        );
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error: any) {
    console.error("Admin blog post update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: { message: "Blog post not found" } },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: { message: "Blog post deleted successfully" } });
  } catch (error: any) {
    console.error("Admin blog post delete error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
