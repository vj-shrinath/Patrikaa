export const config = {
  api: {
    bodyParser: false, // Cashfree sends raw body
  },
};


import { buffer } from "micro";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const rawBody = (await buffer(req)).toString();
    const event = JSON.parse(rawBody);

    console.log("🔔 Cashfree Webhook Received:", event);

    // Must respond with 200 OK
    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ status: "error" });
  }
}
