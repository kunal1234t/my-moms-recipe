// /app/api/checkout/route.js
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import sendWhatsapp from "@/utils/sendWhatsapp";
import sendNotification from "@/utils/sendNotification";

export async function POST(req) {
  const data = await req.json(); // includes user, location, cart
  await dbConnect();
  const order = await Order.create(data);

  // Send WhatsApp to business number
  await sendWhatsapp(order);

  // Notify user (optional email or frontend)
  await sendNotification(order.user.email);

  return Response.json({ success: true });
}
