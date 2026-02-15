export async function POST(req: Request) {
  const body = await req.json();
  const { title, groupId, groupName } = body;

  // 1. Database mein notice save karo (wo humne pehle kiya tha)
  // ... (insert logic)

  // 2. OneSignal Notification bhejo
  const notificationBody = {
    app_id: process.env.ONESIGNAL_APP_ID,
    included_segments: ["All"], // Sabhi subscribers ko jayega
    headings: { en: `New Notice from ${groupName}` },
    contents: { en: title },
    url: `https://dateup.vercel.app/feed/${groupId}`, // Tap karne par seedha feed khulega
  };

  const response = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify(notificationBody),
  });

  return Response.json({ success: true });
}