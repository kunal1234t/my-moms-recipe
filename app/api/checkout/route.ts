import { NextResponse } from "next/server"
import { firestoreService } from "@/lib/firebase"

export async function POST(req: Request) {
  try {
    const orderData = await req.json()

    if (!orderData.user || !orderData.items || !orderData.totalAmount || !orderData.shippingAddress) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 }
      )
    }

    // Ensure all required fields are present for OrderData interface
    const completeOrderData = {
      user: {
        uid: orderData.user.uid || '',
        email: orderData.user.email || '',
        name: orderData.user.name || 'Customer',
        phone: orderData.user.phone || ''
      },
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      subtotal: orderData.subtotal || orderData.totalAmount || 0, // Fallback to totalAmount if subtotal missing
      shipping: orderData.shipping || 0,
      shippingAddress: orderData.shippingAddress || '',
      paymentMethod: orderData.paymentMethod || 'cash',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const orderId = await firestoreService.orders.create(completeOrderData)

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: "Order created successfully"
    })

  } catch (error: unknown) {
    console.error("Checkout error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create order"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}