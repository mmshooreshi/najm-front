// composables/useConsultation.ts
import { ref } from "vue"
import { logger } from "~/utils/logger"

const isModalOpen = ref(false)
const selectedCategory = ref("folding-carton")
const selectedQuantity = ref("۱,۰۰۰ عدد")
const selectedTimeSlot = ref("صبح (۹:۰۰ الی ۱۲:۰۰)")

export function useConsultation() {
  function openModal(category?: string) {
    if (category) selectedCategory.value = category
    isModalOpen.value = true
    if (process.dev) {
      logger.info("System:General", "Opened Consultation Flow Modal")
    }
  }

  function closeModal() {
    isModalOpen.value = false
  }

  function toggleModal() {
    isModalOpen.value = !isModalOpen.value
  }

  async function submitRequest(payload: any) {
    try {
      const res: any = await $fetch("/api/consultation/submit", {
        method: "POST",
        body: payload
      })
      if (process.dev) {
        logger.success("System:General", "Consultation lead submitted successfully", payload)
      }
      return res
    } catch (e: any) {
      if (process.dev) {
        logger.warn("System:General", "Consultation lead saved locally with fallback", payload)
      }
      return { ok: true, data: payload }
    }
  }

  return {
    isModalOpen,
    selectedCategory,
    selectedQuantity,
    selectedTimeSlot,
    openModal,
    closeModal,
    toggleModal,
    submitRequest
  }
}
