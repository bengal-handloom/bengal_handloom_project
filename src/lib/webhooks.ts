// src/lib/webhooks.ts
const START_URL = "https://login.bizgrowww.com/api/automations/69d50463b0900/execute"!;
const STOP_URL = process.env.WEBHOOK_EMAIL_STOP_URL!;


const REGISTRATION_APPROVED_ID = "69db9fd967ebe"
const REGISTRATION_SUCCESSFUL_ID = "69d50463b0900"


export enum WEBHOOK_ID {
  REGISTRATION_APPROVED = REGISTRATION_APPROVED_ID,
  REGISTRATION_SUCCESSFUL = REGISTRATION_SUCCESSFUL_ID
} 

function getWebhookUrl(id:WEBHOOK_ID){
  return `https://login.bizgrowww.com/api/automations/${id}/execute`
}

export async function postWebhook(id: WEBHOOK_ID, payload: any) {
  const res = await fetch(getWebhookUrl(id), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      api_token:'9e64ee50a4dbd79796b63e6ff405a90b',
      ...payload,
      contact_email: payload.email,
      contact_name: payload.fullName,

    }),
  });
  console.log(payload, res)

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Webhook failed: ${res.status} ${text}`);
  }
}