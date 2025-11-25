
<<<<<<< HEAD
import { config } from 'dotenv';
config();

=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Secure environment variables
  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
<<<<<<< HEAD
  const NEXT_PUBLIC_SITE_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
=======
  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f

  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY || !NEXT_PUBLIC_SITE_URL) {
    console.error("❌ Missing Cashfree credentials or site URL in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const orderId = "order_" + Date.now();
<<<<<<< HEAD

    // 🧩 Create order on Cashfree production
    const response = await fetch("https://api.cashfree.com/pg/orders", {
=======
    const CASHFREE_BASE_URL = "https://api.cashfree.com";
    // 🧩 Create order on Cashfree sandbox
    const response = await fetch(`${CASHFREE_BASE_URL}/pg/orders`, {
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: req.body?.order_amount || 1.0,
        order_currency: "INR",
        customer_details: {
          customer_id: req.body?.customer_id || "cust_001",
          customer_email: req.body?.customer_email || "test@example.com",
          customer_phone: req.body?.customer_phone || "9999999999",
        },
        order_note: req.body?.order_note || "Test order from Vercel",
        order_meta: {
          // ✅ Redirect user back to success page
          return_url: `${NEXT_PUBLIC_SITE_URL}/success?order_id=${orderId}`,
        },
      }),
    });

    const data = await response.json();

    // 🟢 Forward Cashfree API response to frontend
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Error creating Cashfree order:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}
