// plugins/error-guard.client.ts
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const shouldIgnore = (message?: string, stack?: string, filename?: string) => {
    const text = `${message || ''} ${stack || ''}`
    return (
      text.includes("Cannot read properties of undefined (reading 'startTime')") ||
      text.includes('reportAllChanges') ||
      Boolean(filename && (filename.startsWith('chrome-extension:') || filename.includes('VM')))
    )
  }

  window.addEventListener(
    'error',
    (event: ErrorEvent) => {
      if (shouldIgnore(event.message, event.error?.stack, event.filename)) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    true
  )

  window.addEventListener(
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const msg = typeof reason === 'string' ? reason : reason?.message || ''
      const stack = reason?.stack || ''
      if (shouldIgnore(msg, stack)) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    true
  )
})
