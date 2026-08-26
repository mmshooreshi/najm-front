// server/api/settings/index.get.ts
import { defineEventHandler } from "h3"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || "http://65.108.80.205:8090"
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0"

  try {
    const res: any = await $fetch(`${pbUrl}/api/collections/settings/records`, {
      headers: { Authorization: token },
      query: { perPage: 1 },
      timeout: 4000
    }).catch(() => null)

    const item = res?.items?.[0]
    if (item) {
      return {
        ok: true,
        settings: {
          siteTitle: item.site_title || "مجتمع تخصصی چاپ و بسته‌بندی نجم",
          siteDescription: item.site_description || "",
          phone: item.phone_number || "۰۲۱ - ۶۶۰۰ ۰۰۰۰",
          mobile: "۰۹۱۲ ۰۰۰ ۰۰۰۰",
          email: item.contact_email || "info@chapnajm.com",
          address: item.address || "تهران، شهرک صنعتی، مجتمع چاپ نجم",
          socialLinks: item.social_links || {},
          footerContent: item.footer_content || {}
        }
      }
    }
  } catch (err) {}

  return {
    ok: true,
    settings: {
      siteTitle: "مجتمع تخصصی چاپ و بسته‌بندی نجم",
      phone: "۰۲۱ - ۶۶۰۰ ۰۰۰۰",
      mobile: "۰۹۱۲ ۰۰۰ ۰۰۰۰",
      email: "info@chapnajm.com",
      address: "تهران، دفتر مرکزی و کارخانه چاپ نجم"
    }
  }
})
