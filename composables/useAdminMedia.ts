// composables/useAdminMedia.ts
import { ref } from 'vue'
import { logger } from '~/utils/logger'

export interface Adjustments {
  brightness: number // 0 to 200 (100 is normal)
  contrast: number // 0 to 200 (100 is normal)
  saturation: number // 0 to 200 (100 is normal)
  exposure: number // -100 to 100 (0 is normal)
  hueRotate: number // 0 to 360 deg
  blur: number // 0 to 20 px
  grayscale: number // 0 to 100%
  sepia: number // 0 to 100%
  invert: number // 0 to 100%
  rotation: number // 0, 90, 180, 270 or free angle
  flipH: boolean
  flipV: boolean
}

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
  unit?: 'pixel' | 'percent'
}

export interface CompressionResult {
  blob: Blob
  url: string
  size: number
  width: number
  height: number
  format: string
}

export function useAdminMedia() {
  const isProcessing = ref(false)
  const uploadProgress = ref(0)

  /** Load an HTMLImageElement safely with fallback */
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const isCrossOrigin = src.startsWith('http://') || src.startsWith('https://')
      if (isCrossOrigin && typeof window !== 'undefined' && !src.startsWith(window.location.origin)) {
        img.crossOrigin = 'anonymous'
      }
      img.onload = () => resolve(img)
      img.onerror = () => {
        // Fallback without crossOrigin
        const fallbackImg = new Image()
        fallbackImg.onload = () => resolve(fallbackImg)
        fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        fallbackImg.src = src
      }
      img.src = src
    })
  }

  /** Extract metadata like dimensions and estimated size from URL */
  async function getImageMetadata(src: string): Promise<{
    width: number
    height: number
    aspectRatio: number
    format: string
    size?: number
  }> {
    let format = 'png'
    const cleanSrc = src.split('?')[0].split('#')[0]
    const extMatch = cleanSrc.match(/\.([a-z0-9]+)$/i)
    if (extMatch) {
      format = extMatch[1].toLowerCase()
    } else if (src.startsWith('data:image/')) {
      const mime = src.slice(11, src.indexOf(';'))
      format = mime.toLowerCase()
    }

    let size = 0
    try {
      if (src.startsWith('http') || src.startsWith('/')) {
        const headRes = await fetch(src, { method: 'HEAD' })
        const len = headRes.headers.get('content-length')
        if (len) size = parseInt(len, 10)
      } else if (src.startsWith('data:')) {
        const base64Len = src.length - src.indexOf(',') - 1
        size = Math.round((base64Len * 3) / 4)
      }
    } catch {}

    try {
      const img = await loadImage(src)
      return {
        width: img.naturalWidth || img.width || 600,
        height: img.naturalHeight || img.height || 600,
        aspectRatio: (img.naturalWidth || 1) / (img.naturalHeight || 1),
        format,
        size: size > 0 ? size : undefined
      }
    } catch {
      return {
        width: 600,
        height: 600,
        aspectRatio: 1,
        format,
        size: size > 0 ? size : undefined
      }
    }
  }

  /** Render adjustments and crop to an HTMLCanvasElement */
  function renderAdjustments(
    img: HTMLImageElement,
    adjustments: Adjustments,
    crop?: CropRect | null,
    targetWidth?: number,
    targetHeight?: number
  ): HTMLCanvasElement {
    const origW = img.naturalWidth || img.width || 600
    const origH = img.naturalHeight || img.height || 600

    let sx = 0
    let sy = 0
    let sw = origW
    let sh = origH

    if (crop && crop.width > 0 && crop.height > 0) {
      if (crop.unit === 'percent') {
        sx = Math.max(0, (crop.x / 100) * origW)
        sy = Math.max(0, (crop.y / 100) * origH)
        sw = Math.min(origW - sx, (crop.width / 100) * origW)
        sh = Math.min(origH - sy, (crop.height / 100) * origH)
      } else {
        sx = Math.max(0, crop.x)
        sy = Math.max(0, crop.y)
        sw = Math.min(origW - sx, crop.width)
        sh = Math.min(origH - sy, crop.height)
      }
    }

    let destW = Math.round(targetWidth || sw)
    let destH = Math.round(targetHeight || (sh / sw) * destW)

    const isSideways = Math.abs((adjustments.rotation || 0) % 180) === 90
    const canvasW = isSideways ? destH : destW
    const canvasH = isSideways ? destW : destH

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, canvasW)
    canvas.height = Math.max(1, canvasH)
    const ctx = canvas.getContext('2d')!

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)

    if (adjustments.rotation) {
      ctx.rotate((adjustments.rotation * Math.PI) / 180)
    }

    ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1)

    const b = adjustments.brightness || 100
    const c = adjustments.contrast || 100
    const s = adjustments.saturation || 100
    const exp = 100 + (adjustments.exposure || 0)
    const hue = adjustments.hueRotate || 0
    const blur = adjustments.blur || 0
    const gray = adjustments.grayscale || 0
    const sepia = adjustments.sepia || 0
    const inv = adjustments.invert || 0

    ctx.filter = `brightness(${b * (exp / 100)}%) contrast(${c}%) saturate(${s}%) hue-rotate(${hue}deg) grayscale(${gray}%) sepia(${sepia}%) invert(${inv}%) blur(${blur}px)`

    ctx.drawImage(img, sx, sy, sw, sh, -destW / 2, -destH / 2, destW, destH)
    ctx.restore()

    return canvas
  }

  /** Convert canvas to specific format with quality compression */
  function compressCanvas(
    canvas: HTMLCanvasElement,
    format: 'webp' | 'avif' | 'png' | 'jpeg' = 'webp',
    quality = 0.85,
    maxDimension = 0
  ): Promise<CompressionResult> {
    return new Promise((resolve, reject) => {
      let finalCanvas = canvas
      if (maxDimension > 0 && (canvas.width > maxDimension || canvas.height > maxDimension)) {
        const ratio = Math.min(maxDimension / canvas.width, maxDimension / canvas.height)
        const resized = document.createElement('canvas')
        resized.width = Math.round(canvas.width * ratio)
        resized.height = Math.round(canvas.height * ratio)
        const rCtx = resized.getContext('2d')!
        rCtx.drawImage(canvas, 0, 0, resized.width, resized.height)
        finalCanvas = resized
      }

      let mime = 'image/webp'
      if (format === 'avif') mime = 'image/avif'
      else if (format === 'png') mime = 'image/png'
      else if (format === 'jpeg') mime = 'image/jpeg'

      finalCanvas.toBlob(
        (blob) => {
          if (!blob) {
            finalCanvas.toBlob(
              (fallbackBlob) => {
                if (!fallbackBlob) return reject(new Error('Canvas export failed'))
                const url = URL.createObjectURL(fallbackBlob)
                resolve({
                  blob: fallbackBlob,
                  url,
                  size: fallbackBlob.size,
                  width: finalCanvas.width,
                  height: finalCanvas.height,
                  format: 'jpeg'
                })
              },
              'image/jpeg',
              quality
            )
            return
          }
          const url = URL.createObjectURL(blob)
          resolve({
            blob,
            url,
            size: blob.size,
            width: finalCanvas.width,
            height: finalCanvas.height,
            format
          })
        },
        mime,
        quality
      )
    })
  }

  /** Upload media via server endpoint with optional target folder path */
  async function uploadMedia(
    file: File,
    onProgress?: (percent: number) => void,
    targetPath = ''
  ): Promise<{ url: string; id?: string }> {
    const formData = new FormData()
    formData.append('file', file)
    if (targetPath) {
      formData.append('path', targetPath)
    }

    onProgress?.(30)
    try {
      const res: any = await $fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      })
      onProgress?.(100)
      return { url: res?.url || res?.item?.url || '', id: res?.id || res?.item?.id }
    } catch (err: any) {
      logger.error('AdminMedia', 'Upload failed', err)
      throw err
    }
  }

  function formatBytes(bytes: number, decimals = 1): string {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return {
    isProcessing,
    uploadProgress,
    loadImage,
    getImageMetadata,
    renderAdjustments,
    compressCanvas,
    uploadMedia,
    formatBytes
  }
}
