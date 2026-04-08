// src/lib/webhooks.ts
const START_URL = "https://login.bizgrowww.com/api/automations/69d50463b0900/execute"!;
const STOP_URL = process.env.WEBHOOK_EMAIL_STOP_URL!;

async function postWebhook(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log(res)

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Webhook failed: ${res.status} ${text}`);
  }
}

export async function triggerEmailStartWebhook(payload: unknown) {
  return postWebhook(START_URL, payload);
}

export async function triggerEmailStopWebhook(payload: unknown) {
  return postWebhook(STOP_URL, payload);
}