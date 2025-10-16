import { NextResponse } from "next/server"
import twilio from 'twilio'

// Define TypeScript interfaces
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  weight?: string
}

interface WhatsAppOrderData {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  deliveryAddress: string
}

export async function POST(req: Request) {
  try {
    const orderData: WhatsAppOrderData = await req.json()

    // Validate environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const adminWhatsAppNumber = process.env.ADMIN_WHATSAPP_NUMBER
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!accountSid || !authToken) {
      return NextResponse.json({ error: "Twilio credentials not configured" }, { status: 500 })
    }

    if (!adminWhatsAppNumber || !twilioWhatsAppNumber) {
      return NextResponse.json({ error: "WhatsApp numbers not configured" }, { status: 500 })
    }

    // Format the message (regular text)
    const itemsList = orderData.items.map((item: OrderItem) => 
      `• ${item.name} (${item.weight || 'N/A'}) - ${item.quantity || 1} × ₹${item.price} = ₹${item.price * (item.quantity || 1)}`
    ).join('\n')

    const message = `🛒 NEW ORDER - My Mom&rsquo;s Recipe

Order ID: ${orderData.orderId}
Customer: ${orderData.customerName}
Phone: ${orderData.customerPhone}
Email: ${orderData.customerEmail || 'Not provided'}
Date: ${new Date().toLocaleDateString('en-IN')}

ORDER ITEMS:
${itemsList}

TOTAL: ₹${orderData.total}
Shipping: ${orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping}`}

DELIVERY ADDRESS:
${orderData.deliveryAddress}

Payment: Cash on Delivery

Please contact customer to confirm order.`

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Send regular WhatsApp message (without template)
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${adminWhatsAppNumber}`
    })

    console.log('WhatsApp message sent to admin:', result.sid)

    return NextResponse.json({ 
      success: true, 
      message: "WhatsApp notification sent to admin",
      messageId: result.sid
    })

  } catch (error: unknown) {
    console.error("WhatsApp notification error:", error)
    
    // Handle specific Twilio errors
    const twilioError = error as { code?: number; message: string }
    
    if (twilioError.code === 21211) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    } else if (twilioError.code === 21608) {
      return NextResponse.json({ error: "Twilio WhatsApp not enabled" }, { status: 500 })
    }
    
    const errorMessage = twilioError.message || "Failed to send WhatsApp notification"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}