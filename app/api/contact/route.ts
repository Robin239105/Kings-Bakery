import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSubmissionSchema } from "@/lib/zod-schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error("Error creating contact submission:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
