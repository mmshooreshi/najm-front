// utils/generateLqip.ts
export default async function generateLqip(file: File): Promise<string> {
  const bmp = await createImageBitmap(file, { resizeWidth: 64, resizeHeight: 64 })
  const canvas = new OffscreenCanvas(bmp.width, bmp.height)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0)
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.3 })
  const b64 = btoa(String.fromCharCode(...new Uint8Array(await blob.arrayBuffer())))
  return `data:image/jpeg;base64,${b64}`
}
