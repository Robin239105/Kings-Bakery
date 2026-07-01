import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { orderCreationSchema } from "@/lib/zod-schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = orderCreationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: "Validation error", details: result.error.format() } },
        { status: 400 }
      );
    }

    const orderData = result.data;

    // 1. Verify and Increment Delivery Slot Availability
    const deliveryDateObj = new Date(orderData.deliveryDate);
    const dateQueryStart = new Date(Date.UTC(deliveryDateObj.getFullYear(), deliveryDateObj.getMonth(), deliveryDateObj.getDate()));
    
    // Find or create delivery slot
    let slot = await prisma.deliverySlot.findUnique({
      where: { date: dateQueryStart },
    });

    if (!slot) {
      // create default slot if not exists
      slot = await prisma.deliverySlot.create({
        data: {
          date: dateQueryStart,
          isFullyBooked: false,
          capacity: 20,
          bookedCount: 0,
        },
      });
    }

    if (slot.isFullyBooked || slot.bookedCount >= slot.capacity) {
      return NextResponse.json(
        { success: false, error: { message: "Selected delivery date is fully booked. Please choose another date." } },
        { status: 400 }
      );
    }

    // 2. Calculate Totals Server-Side
    let calculatedSubtotal = 0;
    const orderItemsToCreate: {
      productId: string | null;
      tastingBoxId: string | null;
      name: string;
      unitPrice: number;
      quantity: number;
    }[] = [];

    for (const item of orderData.items) {
      let unitPrice = 0;

      if (item.productId) {
        const dbProduct = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!dbProduct || !dbProduct.isActive) {
          return NextResponse.json(
            { success: false, error: { message: `Product ${item.name} not found or inactive` } },
            { status: 404 }
          );
        }
        unitPrice = Number(dbProduct.price);
      } else if (item.tastingBoxId) {
        const dbBox = await prisma.tastingBox.findUnique({
          where: { id: item.tastingBoxId },
        });
        if (!dbBox || !dbBox.isActive) {
          return NextResponse.json(
            { success: false, error: { message: `Tasting box ${item.name} not found or inactive` } },
            { status: 404 }
          );
        }
        unitPrice = Number(dbBox.price);
      } else {
        return NextResponse.json(
          { success: false, error: { message: `Item ${item.name} has no valid product or box reference` } },
          { status: 400 }
        );
      }

      calculatedSubtotal += unitPrice * item.quantity;
      orderItemsToCreate.push({
        productId: item.productId || null,
        tastingBoxId: item.tastingBoxId || null,
        name: item.name,
        unitPrice: unitPrice,
        quantity: item.quantity,
      });
    }

    // 3. Discount Calculations (KINGS10 gives 10%)
    let discountAmount = 0;
    if (orderData.promoCode?.trim().toUpperCase() === "KINGS10") {
      discountAmount = calculatedSubtotal * 0.1;
    }

    const finalSubtotalAfterDiscount = calculatedSubtotal - discountAmount;
    
    // Free delivery threshold: $75
    const deliveryFee = finalSubtotalAfterDiscount >= 75.00 ? 0.00 : 8.00;
    const calculatedTotal = finalSubtotalAfterDiscount + deliveryFee;

    // 4. Generate unique orderNumber KB-YYYY-RANDOM
    const currentYear = new Date().getFullYear();
    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KB-${currentYear}-${randomSerial}`;

    // 5. Database transaction: create order and update delivery slot
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Increment booked count
      const updatedSlot = await tx.deliverySlot.update({
        where: { id: slot.id },
        data: {
          bookedCount: { increment: 1 },
        },
      });

      // If bookedCount meets capacity, set fully booked to true
      if (updatedSlot.bookedCount >= updatedSlot.capacity) {
        await tx.deliverySlot.update({
          where: { id: slot.id },
          data: { isFullyBooked: true },
        });
      }

      // Create order
      return tx.order.create({
        data: {
          orderNumber,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail || "guest@kingsbakery.com",
          customerPhone: orderData.customerPhone,
          deliveryAddress: orderData.deliveryAddress,
          deliveryNotes: orderData.deliveryNotes,
          isGift: orderData.isGift,
          giftMessage: orderData.giftMessage,
          deliveryDate: dateQueryStart,
          deliveryWindow: orderData.deliveryWindow,
          subtotal: calculatedSubtotal,
          deliveryFee: deliveryFee,
          total: calculatedTotal,
          promoCode: orderData.promoCode,
          status: "PENDING",
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json({ success: true, data: createdOrder });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
