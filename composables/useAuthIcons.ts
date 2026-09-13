// composables/useAuthIcons.ts
const svgModules = import.meta.glob('@/assets/icons/Auth/*.svg', { query: '?url', import: 'default', eager: true })

const iconMap: Record<string, string> = {}
for (const path in svgModules) {
  const m = path.match(/\/([\w-]+)\.svg$/)
  if (m) iconMap[m[1]] = svgModules[path] as string
}

export function useAuthIcon(name: string) {
  const isCustom = Boolean(iconMap[name])
  const src = iconMap[name]
  return { isCustom, src }
}
