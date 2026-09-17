// server/api/admin/requests/sms.post.ts
import { defineEventHandler, readBody } from 'h3'
import { getAllLeads, updateLead } from '~/server/utils/leadsStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { leadId, phone, message, templateTitle } = body || {}

  if (!phone || !message) {
    return {
      success: false,
      error: 'شماره تلفن و متن پیامک الزامی است.'
    }
  }

  const now = new Date()
  const timeStr = new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    month: 'numeric',
    day: 'numeric'
  }).format(now)

  let leadUpdated = false
  if (leadId) {
    const leads = await getAllLeads()
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      const prevCount = typeof lead.smsSentCount === 'number' ? lead.smsSentCount : 0
      const newHistory = Array.isArray(lead.callHistory) ? [...lead.callHistory] : []
      newHistory.push({
        type: 'sms',
        timestamp: Date.now(),
        dateStr: timeStr,
        template: templateTitle || 'پیامک پیگیری',
        preview: message.slice(0, 60) + '...'
      })

      leadUpdated = await updateLead(leadId, {
        smsSentCount: prevCount + 1,
        lastSmsAt: timeStr,
        callHistory: newHistory
      })
    }
  }

  // Check if live SMS gateway credentials are provided (e.g., Kavenegar or FarazSMS)
  const kavenegarKey = process.env.KAVENEGAR_API_KEY || process.env.SMS_API_KEY
  let gatewaySent = false
  let gatewayResponse: any = null

  if (kavenegarKey) {
    try {
      const sanitizedPhone = phone.replace(/^0/, '98').replace(/\s+/g, '')
      const res: any = await $fetch(
        `https://api.kavenegar.com/v1/${kavenegarKey}/sms/send.json`,
        {
          method: 'POST',
          params: {
            receptor: sanitizedPhone,
            message
          },
          timeout: 5000
        }
      )
      gatewaySent = res?.return?.status === 200
      gatewayResponse = res
    } catch (err: any) {
      console.warn('[SMS Gateway Error]', err?.message || err)
    }
  }

  return {
    success: true,
    gatewaySent,
    leadUpdated,
    pendingGateway: !gatewaySent,
    message: gatewaySent
      ? 'پیامک با موفقیت از طریق درگاه پیامکی ارسال شد.'
      : 'پیامک در سوابق لید ثبت شد (ارسال خودکار وب‌سرویس پس از فعال‌سازی اینماد انجام می‌شود).'
  }
})
