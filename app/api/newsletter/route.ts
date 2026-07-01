import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { newsletterSchema } from "@/lib/zod-schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Use upsert to handle duplicate subscribers gracefully
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {}, // do nothing if exists
      create: { email },
    });

    return NextResponse.json({ success: true, data: subscriber });
  } catch (error: any) {
    console.error("Error creating newsletter subscription:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
