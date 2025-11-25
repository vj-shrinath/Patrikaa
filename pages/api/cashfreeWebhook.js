export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🔥 Webhook Hit:", req.method);

  if (req.method !== "POST") {
    return res.status(200).json({ message: "Webhook OK (GET ignored)" });
  }

  try {
    const rawBody = await getRawBody(req);
    const event = JSON.parse(rawBody.toString());

    console.log("📩 Cashfree Webhook Event:", event);

    // ALWAYS respond 200 so Cashfree accepts test ping
    return res.status(200).json({ status: "received" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    // STILL return 200 so Cashfree test will succeed
    return res.status(200).json({ status: "received_with_error" });
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
