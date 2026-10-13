// utils/nuxt-paths.mjs
import { joinRelativeURL } from 'ufo'

function getRuntimeConfig() {
  try {
    if (typeof useRuntimeConfig === 'function') {
      return useRuntimeConfig()
    }
  } catch {}
  return { app: { baseURL: '/', buildAssetsDir: '/_nuxt/', cdnURL: '' } }
}

export function baseURL() {
  return getRuntimeConfig().app?.baseURL || '/'
}

export function buildAssetsDir() {
  return getRuntimeConfig().app?.buildAssetsDir || '/_nuxt/'
}

export function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path)
}

export function publicAssetsURL(...path) {
  const app = getRuntimeConfig().app || {}
  const publicBase = app.cdnURL || app.baseURL || '/'
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase
}

export default {
  baseURL,
  buildAssetsDir,
  buildAssetsURL,
  publicAssetsURL
}
