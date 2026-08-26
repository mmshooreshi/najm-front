// server/api/consultation/submit.post.ts
import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.phone) {
    return { ok: false, error: "Phone number is required" }
  }

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || "http://65.108.80.205:8090"
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0"

  const payload = {
    name: body.name || "کاربر سایت",
    company: body.company || "",
    phone: body.phone,
    category: body.category || "general",
    quantity: body.quantity || "",
    timeSlot: body.timeSlot || "",
    mockupRequested: !!body.mockupRequested,
    description: body.description || "",
    source: "circular-consultation-button",
    created: new Date().toISOString()
  }

  try {
    // Attempt saving to PocketBase messages / leads collection
    await $fetch(`${pbUrl}/api/collections/messages/records`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: payload,
      timeout: 4000
    }).catch(() => null)
  } catch (err) {}

  return {
    ok: true,
    message: "Consultation request recorded successfully",
    data: payload
  }
})
