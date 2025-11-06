// utils/devlog.ts
const onceKeys = new Set<string>()

export function logOnce(key: string, ...args: any[]) {
  if (!process.dev) return
  if (onceKeys.has(key)) return
  onceKeys.add(key)
  // eslint-disable-next-line no-console
  console.log(...args)
}

export function groupOnce(key: string, title: string, lines: string[]) {
  if (!process.dev) return
  if (onceKeys.has(key)) return
  onceKeys.add(key)
  // eslint-disable-next-line no-console
  console.groupCollapsed(title)
  for (const l of lines) console.log(l)
  console.groupEnd()
}
