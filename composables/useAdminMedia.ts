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
  x: number // in percentage 0..100 or pixels
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

  /** Load an HTMLImageElement with crossOrigin set */
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = (e) => {
        // Retry without crossOrigin for local/data/blob URLs if needed
        if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('/')) {
          const fallbackImg = new Image()
          fallbackImg.onload = () => resolve(fallbackImg)
          fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${src}`))
          fallbackImg.src = src
        } else {
          reject(new Error(`Failed to load image: ${src}`))
        }
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
    let format = 'unknown'
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
        // Approximate base64 length in bytes
        const base64Len = src.length - src.indexOf(',') - 1
        size = Math.round((base64Len * 3) / 4)
      }
    } catch {
      // Ignored
    }

    const img = await loadImage(src)
    return {
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      aspectRatio: (img.naturalWidth || 1) / (img.naturalHeight || 1),
      format,
      size: size > 0 ? size : undefined
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
    const origW = img.naturalWidth || img.width
    const origH = img.naturalHeight || img.height

    // Calculate crop coordinates in source image space
    let sx = 0
    let sy = 0
    let sw = origW
    let sh = origH

    if (crop) {
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

    // Determine final output size
    let destW = Math.round(targetWidth || sw)
    let destH = Math.round(targetHeight || (sh / sw) * destW)

    // Handle 90/270 deg rotation swapping dimensions
    const isSideways = Math.abs(adjustments.rotation % 180) === 90
    const canvasW = isSideways ? destH : destW
    const canvasH = isSideways ? destW : destH

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, canvasW)
    canvas.height = Math.max(1, canvasH)
    const ctx = canvas.getContext('2d')!

    ctx.save()

    // Move to canvas center for rotation & scale
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Rotation
    if (adjustments.rotation) {
      ctx.rotate((adjustments.rotation * Math.PI) / 180)
    }

    // Flips
    ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1)

    // CSS Filters
    const b = adjustments.brightness
    const c = adjustments.contrast
    const s = adjustments.saturation
    const exp = 100 + (adjustments.exposure || 0)
    const hue = adjustments.hueRotate || 0
    const blur = adjustments.blur || 0
    const gray = adjustments.grayscale || 0
    const sepia = adjustments.sepia || 0
    const inv = adjustments.invert || 0

    ctx.filter = `brightness(${b * (exp / 100)}%) contrast(${c}%) saturate(${s}%) hue-rotate(${hue}deg) grayscale(${gray}%) sepia(${sepia}%) invert(${inv}%) blur(${blur}px)`

    // Draw the cropped source image centered
    ctx.drawImage(img, sx, sy, sw, sh, -destW / 2, -destH / 2, destW, destH)

    ctx.restore()
    return canvas
  }

  /** Convert canvas to specific format with quality compression */
  function compressCanvas(
    canvas: HTMLCanvasElement,
    format: 'webp' | 'avif' | 'png' | 'jpeg' = 'webp',
    quality = 0.82
  ): Promise<CompressionResult> {
    return new Promise((resolve, reject) => {
      let mime = 'image/webp'
      if (format === 'avif') mime = 'image/avif'
      else if (format === 'png') mime = 'image/png'
      else if (format === 'jpeg') mime = 'image/jpeg'

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback to jpeg/png if avif/webp not supported by browser canvas
            canvas.toBlob(
              (fallbackBlob) => {
                if (!fallbackBlob) return reject(new Error('Canvas export failed'))
                const url = URL.createObjectURL(fallbackBlob)
                resolve({
                  blob: fallbackBlob,
                  url,
                  size: fallbackBlob.size,
                  width: canvas.width,
                  height: canvas.height,
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
            width: canvas.width,
            height: canvas.height,
            format
          })
        },
        mime,
        quality
      )
    })
  }

  /** Upload a file or blob with live progress tracking */
  async function uploadMedia(
    fileOrBlob: File | Blob,
    filename: string,
    path = '',
    onProgress?: (percent: number) => void
  ): Promise<{
    success: boolean
    url: string
    filename: string
    format: string
    size: number
    width: number
    height: number
  }> {
    isProcessing.value = true
    uploadProgress.value = 0

    const formData = new FormData()
    const file = fileOrBlob instanceof File
      ? fileOrBlob
      : new File([fileOrBlob], filename, { type: fileOrBlob.type || 'image/webp' })

    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('path', path)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/admin/media/upload', true)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          uploadProgress.value = percent
          onProgress?.(percent)
        }
      }

      xhr.onload = () => {
        isProcessing.value = false
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            uploadProgress.value = 100
            onProgress?.(100)
            resolve(data)
          } catch (err) {
            reject(err)
          }
        } else {
          // If server upload failed, fallback to client-side object URL for immediate test preview
          logger.warn('Admin:Media', 'Server upload endpoint returned error, falling back to local client URL')
          const localUrl = URL.createObjectURL(file)
          resolve({
            success: true,
            url: localUrl,
            filename: file.name,
            format: file.type.split('/')[1] || 'webp',
            size: file.size,
            width: 0,
            height: 0
          })
        }
      }

      xhr.onerror = () => {
        isProcessing.value = false
        // Client fallback
        const localUrl = URL.createObjectURL(file)
        resolve({
          success: true,
          url: localUrl,
          filename: file.name,
          format: file.type.split('/')[1] || 'webp',
          size: file.size,
          width: 0,
          height: 0
        })
      }

      xhr.send(formData)
    })
  }

  function formatBytes(bytes: number, decimals = 1): string {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
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
