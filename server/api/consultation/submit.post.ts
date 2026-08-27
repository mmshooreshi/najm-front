// server/api/consultation/submit.post.ts
import { defineEventHandler, readBody } from "h3"
import { createLead } from "~/server/utils/leadsStore"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.phone) {
    return { ok: false, error: "شماره تماس الزامی است" }
  }

  const payload = {
    name: body.name || "کاربر سایت",
    company: body.company || "",
    phone: body.phone,
    category: body.category || "هاردباکس لوکس",
    quantity: body.quantity || "۱,۰۰۰ عدد",
    timeSlot: body.timeSlot || "صبح (۹:۰۰ الی ۱۲:۰۰)",
    mockupRequested: Boolean(body.mockupRequested),
    description: body.description || "",
    sourcePage: body.sourcePage || body.path || "/",
    referer: body.referer || "ورود مستقیم",
    device: body.device || "Mobile",
    timeOnSite: body.timeOnSite || "۱ دقیقه",
    journey: Array.isArray(body.journey) ? body.journey.join(" ← ") : (body.journey || "صفحه اصلی"),
    productContext: body.productContext || body.category || "جعبه هاردباکس"
  }

  const savedLead = await createLead(payload)

  return {
    ok: true,
    message: "درخواست مشاوره با موفقیت ثبت شد",
    data: savedLead
  }
})
