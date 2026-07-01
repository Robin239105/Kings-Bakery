import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/zod-schemas";
import { signAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = adminLoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    // Verify password hash
    const isPasswordValid = bcrypt.compareSync(password, admin.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Set cookie and return success
    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });

    response.headers.set(
      "Set-Cookie",
      `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
