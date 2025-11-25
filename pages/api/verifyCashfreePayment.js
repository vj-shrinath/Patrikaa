<<<<<<< HEAD

import { config } from 'dotenv';
config();

export default async function handler(req, res) {
  const orderId = req.query.order_id;
  if (!orderId) return res.status(400).json({ error: "Missing order_id" });

  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

  try {
    const response = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error verifying Cashfree order:", error);
    res.status(500).json({ error: true, message: "Server Error" });
  }
}
=======
export default async function handler(req, res) {
  const orderId = req.query.order_id;
  if (!orderId) return res.status(400).json({ error: "Missing order_id" });

  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

  try {
    const response = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error verifying Cashfree order:", error);
    res.status(500).json({ error: true, message: "Server Error" });
  }
}

>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
