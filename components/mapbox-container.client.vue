<!-- components/mapbox-container.client.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useLocale } from '~/composables/useLocale'

const { currentLangCode, isRTL } = useLocale()

interface LocalizedItem {
  id: string
  enabled: boolean
  coords: [number, number] // [lng, lat]
  phone: string
  phoneHref: string
  googlePlaceUrl: string
  googleNavUrl: string
  neshanUrl: string
  baladUrl: string
  wazeUrl: string
  title: Record<'fa' | 'en' | 'ar', string>
  sublabel: Record<'fa' | 'en' | 'ar', string>
  address: Record<'fa' | 'en' | 'ar', string>
  iconSvg: string
}

// ────────────────  Permanent Detailed Liberty Map Style  ────────────────
const LIBERTY_STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const FALLBACK_STYLE = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 20
    }
  ]
}

// ────────────────  Locations Data  ────────────────
const LOCATIONS: LocalizedItem[] = [
  {
    id: 'print',
    enabled: true, // PRIMARY active location
    coords: [51.3085833, 35.6735935], // [lng, lat]
    phone: '۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳',
    phoneHref: 'tel:+982166797911',
    googlePlaceUrl: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA',
    googleNavUrl: 'https://www.google.com/maps/dir/?api=1&destination=35.6735935,51.3085833',
    neshanUrl: 'https://neshan.org/maps/@35.673594,51.308583,17.5z,0p/places',
    baladUrl: 'https://balad.ir/location?latitude=35.673594&longitude=51.308583',
    wazeUrl: 'https://waze.com/ul?ll=35.673594,51.308583&navigate=yes',
    title: {
      fa: 'مجتمع چاپ و بسته‌بندی نجم',
      en: 'Najm Printing & Packaging Complex',
      ar: 'مجمع نجم للطباعة والتغليف'
    },
    sublabel: {
      fa: 'طراحی ساختاری، چاپ افست تجاری و جعبه‌سازی',
      en: 'Structural Design, Commercial Offset & Box Manufacturing',
      ar: 'تصميم هيكلي، طباعة أوفست تجارية وتصنيع العلب'
    },
    address: {
      fa: 'تهران، بزرگراه فتح (جاده قدیم کرج)، زیر پل شیر پاستوریزه، ابتدای ۴۵ متری زرند، نبش کوچه تلفن‌خانه، پلاک ۱۶۶',
      en: 'Tehran, Fath Highway (Old Karaj Rd), Under Pasteurised Milk Bridge, 45m Zarand Blvd, Corner of Telefonkhaneh Alley, No. 166',
      ar: 'طهران، طريق فتح السريع (طريق كرج القديم)، تحت جسر حليب بستره، بداية جادة ٤٥ متري زرند، ناصية زقاق تلفن خانة، رقم ١٦٦'
    },
    // Exact warehouse SVG matching user screenshot (mdi:warehouse)
    iconSvg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h2v2H6zm6-16L2 8v13h2v-8h16v8h2V8zm-4 8H4V9h4zm6 0h-4V9h4zm6 0h-4V9h4zM6 15h2v2H6zm4 0h2v2h-2zm0 4h2v2h-2zm4 0h2v2h-2z"/></svg>`
  },
  {
    id: 'office',
    enabled: false, // Disabled for now per user request; set to true to enable anytime
    coords: [51.392610, 35.699967],
    phone: '۰۹۳۶۱۴۱۵۴۱۳',
    phoneHref: 'tel:09361415413',
    googlePlaceUrl: 'https://www.google.com/maps/search/?api=1&query=35.699967,51.392610',
    googleNavUrl: 'https://www.google.com/maps/dir/?api=1&destination=35.699967,51.392610',
    neshanUrl: 'https://neshan.org/maps/@35.699967,51.392610,17.5z',
    baladUrl: 'https://balad.ir/location?latitude=35.699967&longitude=51.392610',
    wazeUrl: 'https://waze.com/ul?ll=35.699967,51.392610&navigate=yes',
    title: {
      fa: 'دفتر مرکزی و پذیرش سفارشات',
      en: 'Head Office & Orders Center',
      ar: 'المكتب الرئيسي واستقبال الطلبات'
    },
    sublabel: {
      fa: 'دفتر هماهنگی، مشاوره و عقد قرارداد',
      en: 'Coordination, Consultation & Contracts',
      ar: 'مكتب التنسيق والاستشارات والعقود'
    },
    address: {
      fa: 'تهران، میدان انقلاب، خیابان کارگر جنوبی، خیابان شهدای ژاندارمری، پلاک ۱۱۷، طبقه ۳',
      en: 'No. 117, 3rd Floor, Shohada-ye Zhandarmeri St., South Kargar St., Enqelab Sq., Tehran',
      ar: 'ساحة انقلاب، شارع كاركر الجنوبي، شارع شهداء الجندرمة، رقم ۱۱۷، الطابق الثالث، طهران'
    },
    iconSvg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18 15H16V17H18M18 11H16V13H18M18 7H16V9H18M14 7H12V9H14M14 11H12V13H14M14 15H12V17H14M10 7H8V9H10M10 11H8V13H10M10 15H8V17H10M20 3H4C2.89 3 2 3.89 2 5V21H22V5C22 3.89 21.1 3 20 3M20 19H4V5H20V19Z"/></svg>`
  }
]

// ────────────────  i18n UI Strings  ────────────────
const ui = computed(() => {
  const lang = currentLangCode.value
  if (lang === 'en') {
    return {
      navTitle: 'Navigate with app:',
      copyAddress: 'Copy Address',
      copied: 'Copied!',
      directCall: 'Direct Call',
      recenter: 'Recenter on Plant',
      loading: 'Loading map...',
      overview: 'Overview'
    }
  }
  if (lang === 'ar') {
    return {
      navTitle: 'الملاحة عبر التطبيقات:',
      copyAddress: 'نسخ العنوان',
      copied: 'تم النسخ!',
      directCall: 'الاتصال المباشر',
      recenter: 'موقع المصنع',
      loading: 'جاري تحميل الخريطة...',
      overview: 'نظرة عامة'
    }
  }
  return {
    navTitle: 'مسیریابی با اپلیکیشن:',
    copyAddress: 'کپی آدرس',
    copied: 'کپی شد!',
    directCall: 'تماس مستقیم',
    recenter: 'موقعیت کارخانه',
    loading: 'در حال لود نقشه...',
    overview: 'نمای کلی'
  }
})

const activeLocations = computed(() => LOCATIONS.filter(loc => loc.enabled))
const primaryLocation = computed(() => activeLocations.value[0] || LOCATIONS[0])

const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null
const markers: maplibregl.Marker[] = []

const isMapLoaded = ref(false)
const isCloudOpen = ref(false)
const isCopied = ref(false)
const cloudCardRef = ref<HTMLDivElement | null>(null)
const cloudPos = ref<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false })

let resizeTimer: ReturnType<typeof setTimeout> | null = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

// ────────────────  One-Click Address Copy  ────────────────
async function copyAddress() {
  const addr = primaryLocation.value.address[currentLangCode.value] || primaryLocation.value.address.fa
  try {
    await navigator.clipboard.writeText(addr)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch {
    isCopied.value = true
  }
}

// ────────────────  Dynamic, Fluid Viewport Positioning Engine  ────────────────
function updateCloudPosition() {
  if (!map || !isCloudOpen.value) return
  const loc = primaryLocation.value
  const container = mapContainer.value
  if (!container) return

  const pt = map.project(loc.coords)
  const W = container.clientWidth
  const H = container.clientHeight

  // Hide if marker has moved far off the screen
  if (pt.x < -160 || pt.x > W + 160 || pt.y < -160 || pt.y > H + 160) {
    cloudPos.value = { ...cloudPos.value, visible: false }
    return
  }

  const cardEl = cloudCardRef.value
  const cardW = cardEl && cardEl.offsetWidth > 50 ? cardEl.offsetWidth : Math.min(320, W - 28)
  const cardH = cardEl && cardEl.offsetHeight > 50 ? cardEl.offsetHeight : 195

  // Continuously slide horizontally, safely clamped inside viewport bounds
  let x = pt.x - cardW / 2
  x = Math.max(12, Math.min(x, W - cardW - 12))

  // Continuously position vertically: prefer floating comfortably above marker
  const safeTop = 60 // space for top floating recenter bar
  const markerRadius = 26
  const clearance = 14

  let y = pt.y - cardH - clearance
  if (y < safeTop) {
    // If not enough room above, smoothly position below marker
    y = pt.y + markerRadius + clearance
  }
  // Clamp to bottom safe margin
  y = Math.min(y, H - cardH - 12)
  y = Math.max(safeTop, y)

  cloudPos.value = { x, y, visible: true }
}

// ────────────────  Pin Element Builder  ────────────────
function createMarkerElement(loc: LocalizedItem): HTMLDivElement {
  const pinEl = document.createElement('div')
  pinEl.className = 'najm-marker-pin'

  const squircle = document.createElement('div')
  squircle.className = 'najm-marker-squircle'
  squircle.innerHTML = loc.iconSvg

  pinEl.appendChild(squircle)
  return pinEl
}

function initMarkers() {
  if (!map || markers.length > 0) return

  activeLocations.value.forEach(loc => {
    const el = createMarkerElement(loc)

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(loc.coords)
      .addTo(map!)

    // Clicking marker toggles the cloud popover smoothly
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      isCloudOpen.value = !isCloudOpen.value
      if (isCloudOpen.value) {
        nextTick(() => updateCloudPosition())
      }
    })

    markers.push(marker)
  })
}

// ────────────────  Smooth Zoom & Fly-in Animation  ────────────────
function focusFactory(openCloud = true) {
  if (!map) return
  const loc = primaryLocation.value

  map.flyTo({
    center: loc.coords,
    zoom: 16.3,
    pitch: 35,
    bearing: 0,
    speed: 0.82,
    curve: 1.42,
    essential: true
  })

  if (openCloud) {
    let opened = false
    const openIt = () => {
      if (!opened) {
        opened = true
        isCloudOpen.value = true
        nextTick(() => updateCloudPosition())
      }
    }
    map.once('moveend', openIt)
    setTimeout(openIt, 1800)
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  maplibregl.setWorkerUrl('/js/maplibre-gl-worker.mjs')

  try {
    if (maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      maplibregl.setRTLTextPlugin('/js/mapbox-gl-rtl-text.js', null, true)
    }
  } catch {}

  // 1. Initialize MapLibre GL JS at LOW ZOOM showing FULL TEHRAN
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: LIBERTY_STYLE,
    center: [51.35, 35.70], // Full Tehran overview center
    zoom: 10.3,             // Low zoom showing full Tehran (Tajrish to Rey, West to East)
    pitch: 0,
    bearing: 0,
    antialias: true
  })

  // Navigation and controls
  const navPosition = isRTL.value ? 'bottom-left' : 'bottom-right'
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), navPosition)
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }),
    navPosition
  )
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), isRTL.value ? 'bottom-right' : 'bottom-left')

  requestAnimationFrame(() => map?.resize())
  resizeTimer = setTimeout(() => map?.resize(), 350)

  // Fluid 60fps tracking on EVERY render frame (pan, zoom, pitch, bearing)
  map.on('render', () => {
    if (isCloudOpen.value) {
      updateCloudPosition()
    }
  })

  // Clicking map canvas closes the cloud popover
  map.on('click', () => {
    isCloudOpen.value = false
  })

  window.addEventListener('resize', updateCloudPosition)

  map.on('load', () => {
    isMapLoaded.value = true
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    initMarkers()

    // 2. Smooth cinematic fly-in from Tehran overview to factory
    setTimeout(() => {
      focusFactory(true)
    }, 280)
  })

  fallbackTimer = setTimeout(() => {
    if (!isMapLoaded.value && map) {
      map.setStyle(FALLBACK_STYLE as any)
      isMapLoaded.value = true
      initMarkers()
      setTimeout(() => focusFactory(true), 280)
    }
  }, 4000)

  map.on('error', (e) => {
    if (e.error?.message?.includes('style') || e.error?.message?.includes('Failed to fetch')) {
      if (map) map.setStyle(FALLBACK_STYLE as any)
      isMapLoaded.value = true
      initMarkers()
      setTimeout(() => focusFactory(true), 280)
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCloudPosition)
  if (resizeTimer) clearTimeout(resizeTimer)
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (map) {
    markers.forEach(m => m.remove())
    markers.length = 0
    map.remove()
    map = null
  }
})
</script>

<template>
  <div
    class="najm-map-root relative w-full h-full bg-[#0a1815] text-white overflow-hidden select-none"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- Map Canvas Container -->
    <div ref="mapContainer" class="w-full h-full" />

    <!-- Loading Indicator -->
    <div
      v-if="!isMapLoaded"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md pointer-events-none transition-opacity duration-300"
    >
      <div class="w-11 h-11 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mb-3"></div>
      <span class="text-sm font-bold text-emerald-300">{{ ui.loading }}</span>
    </div>

    <!-- ────────────────  Smart Dynamic Floating Cloud Card  ──────────────── -->
    <div
      class="najm-dynamic-cloud-wrapper absolute top-0 left-0 z-30 pointer-events-none will-change-transform"
      :style="{
        transform: `translate3d(${cloudPos.x}px, ${cloudPos.y}px, 0)`,
        opacity: cloudPos.visible ? 1 : 0,
        transition: 'opacity 0.15s ease'
      }"
    >
      <Transition name="cloud-pop">
        <div
          v-if="isCloudOpen"
          ref="cloudCardRef"
          class="najm-cloud-card bg-[#014439]/95 text-[#f4fbf7] border border-emerald-400/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl w-[calc(100vw-28px)] max-w-[320px] pointer-events-auto select-text"
          :dir="isRTL ? 'rtl' : 'ltr'"
          @click.stop
        >
          <!-- Header with warehouse icon, brand title & Centered X Close Button -->
          <div class="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div class="flex items-center gap-2 min-w-0">
              <div
                class="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white"
                v-html="primaryLocation.iconSvg"
              />
              <div class="min-w-0">
                <h3 class="text-xs sm:text-[12.5px] font-bold text-white truncate leading-tight">
                  {{ primaryLocation.title[currentLangCode] || primaryLocation.title.fa }}
                </h3>
                <p class="text-[9.5px] sm:text-[10px] text-emerald-300/80 truncate">
                  {{ primaryLocation.sublabel[currentLangCode] || primaryLocation.sublabel.fa }}
                </p>
              </div>
            </div>

            <!-- Perfectly Centered X Close Button -->
            <button
              type="button"
              class="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/80 hover:text-white text-zinc-300 transition-all cursor-pointer shrink-0"
              @click="isCloudOpen = false"
              title="Close"
              aria-label="Close"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Full Factory Address with One-Click Copy -->
          <div class="py-1.5 flex items-start justify-between gap-1.5 border-b border-white/10">
            <div class="flex items-start gap-1 text-[10.5px] leading-relaxed text-zinc-200 min-w-0">
              <span class="shrink-0 text-xs">📍</span>
              <span class="line-clamp-2">{{ primaryLocation.address[currentLangCode] || primaryLocation.address.fa }}</span>
            </div>
            <button
              type="button"
              class="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[9.5px] font-medium text-emerald-200 transition-all cursor-pointer"
              :class="{ 'bg-emerald-600 text-white': isCopied }"
              @click="copyAddress"
            >
              <svg v-if="!isCopied" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <svg v-else class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ isCopied ? ui.copied : ui.copyAddress }}</span>
            </button>
          </div>

          <!-- Direct Phone Call Row with correct RTL typography -->
          <div class="py-1.5 flex items-center justify-between border-b border-white/10 text-xs">
            <div class="flex items-center gap-1 text-zinc-300 text-[11px]">
              <span>📞</span>
              <span>{{ ui.directCall }}:</span>
            </div>
            <a
              :href="primaryLocation.phoneHref"
              class="font-bold text-emerald-300 hover:text-emerald-200 hover:underline transition-colors dir-ltr font-mono text-[11.5px]"
            >
              <template v-if="currentLangCode === 'en'">
                +98 21 6679 7911 to 13
              </template>
              <template v-else-if="currentLangCode === 'ar'">
                <div dir="rtl" class="inline-flex items-center gap-1">
                  <bdi>۰۲۱-۶۶۷۹۷۹۱۱</bdi> <span>إلى</span> <bdi>۱۳</bdi>
                </div>
              </template>
              <template v-else>
                <div dir="rtl" class="inline-flex items-center gap-1">
                  <bdi>۰۲۱-۶۶۷۹۷۹۱۱</bdi> <span>الی</span> <bdi>۱۳</bdi>
                </div>
              </template>
            </a>
          </div>

          <!-- Verified 4-App Navigation Routing Buttons -->
          <div class="pt-1.5">
            <span class="block text-[9.5px] text-zinc-400 mb-1">{{ ui.navTitle }}</span>
            <div class="grid grid-cols-4 gap-1">
              <a
                :href="primaryLocation.googlePlaceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1 py-1 rounded-lg bg-white/10 hover:bg-[#4285F4]/30 hover:border-[#4285F4]/50 border border-white/10 text-[9.5px] font-semibold text-white transition-all"
                title="Google Maps"
              >
                <svg class="w-3 h-3 text-[#4285F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                <span>Google</span>
              </a>
              <a
                :href="primaryLocation.neshanUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/30 hover:border-emerald-500/50 border border-white/10 text-[9.5px] font-semibold text-white transition-all"
                title="نشان"
              >
                <svg class="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4"/></svg>
                <span>نشان</span>
              </a>
              <a
                :href="primaryLocation.baladUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1 py-1 rounded-lg bg-white/10 hover:bg-teal-500/30 hover:border-teal-500/50 border border-white/10 text-[9.5px] font-semibold text-white transition-all"
                title="بلد"
              >
                <svg class="w-3 h-3 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>بلد</span>
              </a>
              <a
                :href="primaryLocation.wazeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1 py-1 rounded-lg bg-white/10 hover:bg-[#33CCFF]/30 hover:border-[#33CCFF]/50 border border-white/10 text-[9.5px] font-semibold text-white transition-all"
                title="Waze"
              >
                <svg class="w-3 h-3 text-[#33CCFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                <span>Waze</span>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ────────────────  Top Floating Control Pill  ──────────────── -->
    <div
      class="absolute top-4 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-6 pointer-events-none"
    >
      <!-- Recenter Button on Factory -->
      <button
        type="button"
        class="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#014439]/90 hover:bg-[#014439] text-white text-xs font-bold border border-emerald-400/40 shadow-2xl backdrop-blur-xl transition-all cursor-pointer hover:scale-103 active:scale-97"
        @click="focusFactory(true)"
        :title="ui.recenter"
      >
        <svg class="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="7" />
          <polyline points="12 2 12 5" />
          <polyline points="12 19 12 22" />
          <polyline points="2 12 5 12" />
          <polyline points="19 12 22 12" />
        </svg>
        <span>{{ ui.recenter }}</span>
      </button>

      <!-- Multi-location Pill (Auto-appears if secondary location is re-enabled) -->
      <div
        v-if="activeLocations.length > 1"
        class="bg-black/75 backdrop-blur-xl border border-white/15 p-1 rounded-2xl shadow-2xl flex items-center gap-1 pointer-events-auto"
      >
        <button
          v-for="loc in activeLocations"
          :key="loc.id"
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-emerald-600 text-white shadow-md"
        >
          <span>{{ loc.title[currentLangCode] || loc.title.fa }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* ────────────────  Universal Najm Font Integration  ──────────────── */
.najm-map-root,
.najm-map-root *,
.maplibregl-ctrl,
.maplibregl-ctrl-attrib,
.maplibregl-ctrl-scale {
  font-family: 'IRANSansX-d4', 'IRANSansX', sans-serif !important;
}

/* ────────────────  Exact Najm Green Warehouse Squircle Marker  ──────────────── */
.najm-marker-pin {
  position: absolute !important;
  width: 48px !important;
  height: 48px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  cursor: pointer !important;
  user-select: none !important;
  pointer-events: auto !important;
  /* CRITICAL: Zero transition so MapLibre transforms update synchronously with zero lag or drift on zoom */
  transition: none !important;
  will-change: transform;
}

/* Ensure MapLibre marker transforms are never transitioned by global CSS */
.maplibregl-marker {
  transition: none !important;
}

/* Inner Visual Squircle - Isolated from MapLibre coordinates */
.najm-marker-squircle {
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background-color: #014439 !important; /* Official Najm Green */
  border: none !important; /* NO white border */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  color: #ffffff;
  transform-origin: center center;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.najm-marker-squircle:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.6);
}

.najm-marker-squircle svg {
  display: block;
  width: 26px;
  height: 26px;
  pointer-events: none;
}

/* ────────────────  Dynamic Cloud Transition  ──────────────── */
.cloud-pop-enter-active,
.cloud-pop-leave-active {
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.cloud-pop-enter-from,
.cloud-pop-leave-to {
  opacity: 0;
  transform: scale(0.94);
}
</style>
