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

    const today = new Date();
    
    // Start dates
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Orders count queries
    const todayOrdersCount = await prisma.order.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    const weekOrdersCount = await prisma.order.count({
      where: {
        createdAt: { gte: startOfWeek },
      },
    });

    const pendingOrdersCount = await prisma.order.count({
      where: {
        status: "PENDING",
      },
    });

    // 2. Revenue query this month
    const monthlyOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: "CANCELLED" },
      },
      select: { total: true },
    });
    
    const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + Number(order.total), 0);

    // 3. Low stock items
    const lowStockItems = await prisma.product.findMany({
      where: {
        stockStatus: { in: ["LOW_STOCK", "OUT_OF_STOCK"] },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        stockStatus: true,
        price: true,
      },
    });

    // 4. Top 5 best selling products (simple aggregate by quantity in OrderItem)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId: { not: null },
      },
      select: {
        productId: true,
        name: true,
        quantity: true,
      },
    });

    const salesMap: Record<string, { name: string; sales: number }> = {};
    for (const item of orderItems) {
      const pId = item.productId!;
      if (!salesMap[pId]) {
        salesMap[pId] = { name: item.name, sales: 0 };
      }
      salesMap[pId].sales += item.quantity;
    }

    const topProducts = Object.values(salesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // 5. Orders over time (last 7 days for the Recharts line chart)
    const ordersOverTime = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 23, 59, 59, 999);
      
      const count = await prisma.order.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const dayName = dayStart.toLocaleDateString("en-US", { weekday: "short" });
      ordersOverTime.push({
        date: dayName,
        orders: count,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          todayOrders: todayOrdersCount,
          weekOrders: weekOrdersCount,
          pendingOrders: pendingOrdersCount,
          monthlyRevenue,
        },
        lowStock: lowStockItems,
        topProducts,
        ordersOverTime,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
