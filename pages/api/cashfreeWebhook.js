export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const rawBody = await getRawBody(req);
    const event = JSON.parse(rawBody.toString());

    console.log("🔔 Webhook Event:", event);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ status: "error" });
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = [];

    req.on("data", (chunk) => {
      data.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(data));
    });

    req.on("error", reject);
  });
}
