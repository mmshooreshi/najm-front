<!-- components/mapbox-container.client.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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
    iconSvg: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h2v2H6zm6-16L2 8v13h2v-8h16v8h2V8zm-4 8H4V9h4zm6 0h-4V9h4zm6 0h-4V9h4zM6 15h2v2H6zm4 0h2v2h-2zm0 4h2v2h-2zm4 0h2v2h-2z"/></svg>`
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
    iconSvg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M18 15H16V17H18M18 11H16V13H18M18 7H16V9H18M14 7H12V9H14M14 11H12V13H14M14 15H12V17H14M10 7H8V9H10M10 11H8V13H10M10 15H8V17H10M20 3H4C2.89 3 2 3.89 2 5V21H22V5C22 3.89 21.1 3 20 3M20 19H4V5H20V19Z"/></svg>`
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
      loading: 'Loading Liberty map...',
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
    loading: 'در حال بارگذاری نقشه لیبرتی...',
    overview: 'نمای کلی'
  }
})

const activeLocations = computed(() => LOCATIONS.filter(loc => loc.enabled))
const primaryLocation = computed(() => activeLocations.value[0] || LOCATIONS[0])

const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null
const markers: maplibregl.Marker[] = []
let activePopup: maplibregl.Popup | null = null

const isMapLoaded = ref(false)
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

// ────────────────  HTML Builder for Smart Cloud Popover  ────────────────
function buildPopupHtml(loc: LocalizedItem): string {
  const lang = currentLangCode.value
  const title = loc.title[lang] || loc.title.fa
  const sublabel = loc.sublabel[lang] || loc.sublabel.fa
  const address = loc.address[lang] || loc.address.fa
  const dir = isRTL.value ? 'rtl' : 'ltr'

  // Correct Persian phone typography with separate bdi spans so "الی" sits naturally in the middle
  const phoneMarkup = lang === 'en'
    ? `<span class="najm-phone-digits">+98 21 6679 7911 to 13</span>`
    : (lang === 'ar'
      ? `<div dir="rtl" class="najm-phone-persian"><bdi>۰۲۱-۶۶۷۹۷۹۱۱</bdi> <span class="phone-ali">إلى</span> <bdi>۱۳</bdi></div>`
      : `<div dir="rtl" class="najm-phone-persian"><bdi>۰۲۱-۶۶۷۹۷۹۱۱</bdi> <span class="phone-ali">الی</span> <bdi>۱۳</bdi></div>`)

  return `
    <div class="najm-cloud-card" dir="${dir}">
      <!-- Header with warehouse icon and exact brand title -->
      <div class="najm-cloud-header">
        <div class="najm-cloud-icon">${loc.iconSvg}</div>
        <div class="najm-cloud-title-group">
          <h3 class="najm-cloud-title">${title}</h3>
          <p class="najm-cloud-sub">${sublabel}</p>
        </div>
      </div>

      <!-- Full Factory Address with One-Click Copy -->
      <div class="najm-cloud-address-row">
        <div class="najm-cloud-address-text">
          <span class="najm-geo-pin">📍</span>
          <span class="najm-address-content">${address}</span>
        </div>
        <button type="button" class="najm-cloud-copy-btn" id="najm-copy-trigger" data-address="${address.replace(/"/g, '&quot;')}">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span id="najm-copy-label">${ui.value.copyAddress}</span>
        </button>
      </div>

      <!-- Direct Phone Call Row with correct RTL alignment -->
      <div class="najm-cloud-phone-row">
        <div class="najm-phone-label-group">
          <span>📞</span>
          <span>${ui.value.directCall}:</span>
        </div>
        <a href="${loc.phoneHref}" class="najm-cloud-phone-link">
          ${phoneMarkup}
        </a>
      </div>

      <!-- Verified 4-App Navigation Routing Buttons -->
      <div class="najm-cloud-routing">
        <span class="najm-cloud-routing-title">${ui.value.navTitle}</span>
        <div class="najm-cloud-routing-grid">
          <a href="${loc.googlePlaceUrl}" target="_blank" rel="noopener noreferrer" class="najm-cloud-route-btn google" title="Google Maps">
            <svg class="route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            <span>Google</span>
          </a>
          <a href="${loc.neshanUrl}" target="_blank" rel="noopener noreferrer" class="najm-cloud-route-btn neshan" title="نشان">
            <svg class="route-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4"/></svg>
            <span>نشان</span>
          </a>
          <a href="${loc.baladUrl}" target="_blank" rel="noopener noreferrer" class="najm-cloud-route-btn balad" title="بلد">
            <svg class="route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>بلد</span>
          </a>
          <a href="${loc.wazeUrl}" target="_blank" rel="noopener noreferrer" class="najm-cloud-route-btn waze" title="Waze">
            <svg class="route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            <span>Waze</span>
          </a>
        </div>
      </div>
    </div>
  `
}

// ────────────────  Pin Element Builder (NO white border, NO text label, exact squircle)  ────────────────
function createMarkerElement(loc: LocalizedItem): HTMLDivElement {
  const pinEl = document.createElement('div')
  pinEl.className = 'najm-marker-pin'
  pinEl.innerHTML = loc.iconSvg
  return pinEl
}

function attachPopupEvents(popup: maplibregl.Popup) {
  popup.on('open', () => {
    const copyBtn = document.getElementById('najm-copy-trigger')
    const copyLabel = document.getElementById('najm-copy-label')
    if (copyBtn && copyLabel) {
      copyBtn.onclick = async (e) => {
        e.stopPropagation()
        const addr = copyBtn.getAttribute('data-address') || ''
        try {
          await navigator.clipboard.writeText(addr)
          copyLabel.textContent = ui.value.copied
          copyBtn.classList.add('copied')
          setTimeout(() => {
            copyLabel.textContent = ui.value.copyAddress
            copyBtn.classList.remove('copied')
          }, 2200)
        } catch {
          copyLabel.textContent = ui.value.copied
        }
      }
    }
  })
}

function initMarkers() {
  if (!map || markers.length > 0) return

  activeLocations.value.forEach(loc => {
    const el = createMarkerElement(loc)

    // Smart cloud popup anchored to the icon with intelligent directional offset
    const popup = new maplibregl.Popup({
      offset: 18,
      closeButton: true,
      closeOnClick: true,
      closeOnMove: false,
      className: 'najm-cloud-popup',
      maxWidth: 'min(380px, calc(100vw - 28px))'
    })

    popup.setHTML(buildPopupHtml(loc))
    attachPopupEvents(popup)

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(loc.coords)
      .setPopup(popup)
      .addTo(map!)

    // Open smart cloud popup automatically on initial load
    if (loc.id === 'print') {
      activePopup = popup
      setTimeout(() => {
        if (map && !popup.isOpen()) {
          marker.togglePopup()
        }
      }, 300)
    }

    markers.push(marker)
  })
}

function focusFactory(openCloud = true) {
  if (!map) return
  const loc = primaryLocation.value
  map.flyTo({
    center: loc.coords,
    zoom: 16.2,
    pitch: 35,
    bearing: 0,
    speed: 1.3,
    curve: 1.3,
    essential: true
  })

  if (openCloud && activePopup && !activePopup.isOpen() && markers[0]) {
    markers[0].togglePopup()
  }
}

watch(currentLangCode, () => {
  // Update popup HTML dynamically when language changes
  if (activePopup && markers[0]) {
    const loc = primaryLocation.value
    activePopup.setHTML(buildPopupHtml(loc))
    attachPopupEvents(activePopup)
  }
})

onMounted(() => {
  if (!mapContainer.value) return

  // Configure local Web Worker for MapLibre GL
  maplibregl.setWorkerUrl('/js/maplibre-gl-worker.mjs')

  // Enable Persian / Arabic RTL text rendering plugin locally
  try {
    if (maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      maplibregl.setRTLTextPlugin('/js/mapbox-gl-rtl-text.js', null, true)
    }
  } catch {}

  // Initialize MapLibre GL JS with Detailed Liberty style
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: LIBERTY_STYLE,
    center: primaryLocation.value.coords,
    zoom: 16,
    pitch: 35,
    bearing: 0,
    antialias: true
  })

  // Add navigation and geolocate controls
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

  // Trigger resize once layout settles
  requestAnimationFrame(() => {
    map?.resize()
  })
  resizeTimer = setTimeout(() => {
    map?.resize()
  }, 350)

  map.on('load', () => {
    isMapLoaded.value = true
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    initMarkers()
    focusFactory(true)
  })

  // Fallback to fast raster if Liberty takes over 4 seconds
  fallbackTimer = setTimeout(() => {
    if (!isMapLoaded.value && map) {
      console.warn('Liberty style timed out, using fallback raster')
      map.setStyle(FALLBACK_STYLE as any)
      isMapLoaded.value = true
      initMarkers()
      focusFactory(true)
    }
  }, 4000)

  map.on('error', (e) => {
    if (e.error?.message?.includes('style') || e.error?.message?.includes('Failed to fetch')) {
      console.warn('Liberty style fallback triggered:', e.error?.message)
      if (map) {
        map.setStyle(FALLBACK_STYLE as any)
      }
      isMapLoaded.value = true
      initMarkers()
      focusFactory(true)
    }
  })
})

onBeforeUnmount(() => {
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

    <!-- ────────────────  Top Floating Control Pill  ──────────────── -->
    <div
      class="absolute top-4 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-6 pointer-events-none"
    >
      <!-- Recenter Button on Factory -->
      <button
        type="button"
        class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#014439]/90 hover:bg-[#014439] text-white text-xs font-bold border border-emerald-400/40 shadow-2xl backdrop-blur-xl transition-all cursor-pointer hover:scale-103 active:scale-97"
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
.maplibregl-popup,
.maplibregl-popup-content,
.maplibregl-ctrl,
.maplibregl-ctrl-attrib,
.maplibregl-ctrl-scale {
  font-family: 'IRANSansX-d4', 'IRANSansX', sans-serif !important;
}

/* ────────────────  Exact Najm Green Warehouse Squircle Marker  ──────────────── */
.najm-marker-pin {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background-color: #014439 !important; /* Official Najm Green */
  border: none !important; /* NO white border */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  color: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
}

.najm-marker-pin:hover {
  transform: scale(1.12) translateY(-2px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.6);
}

.najm-marker-pin svg {
  display: block;
  width: 28px;
  height: 28px;
}

/* ────────────────  Smart Cloud Popover (MapLibre Popup)  ──────────────── */
.maplibregl-popup {
  font-family: inherit;
  z-index: 50;
}

.maplibregl-popup-content {
  background: rgba(1, 68, 57, 0.96) !important;
  color: #f4fbf7 !important;
  border: 1.5px solid rgba(16, 185, 129, 0.4) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 1.25rem !important;
  padding: 1.15rem 1.15rem 1rem !important;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.65) !important;
  animation: cloudFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

@keyframes cloudFadeIn {
  0% {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Directional Arrow Pointer (Tip) styled to match cloud */
.maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-top-left .maplibregl-popup-tip {
  border-bottom-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-top-right .maplibregl-popup-tip {
  border-bottom-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip {
  border-top-color: rgba(1, 68, 57, 0.96) !important;
}
.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip {
  border-top-color: rgba(1, 68, 57, 0.96) !important;
}

/* Close Button (X) */
.maplibregl-popup-close-button {
  width: 26px;
  height: 26px;
  top: 10px;
  inset-inline-end: 10px;
  inset-inline-start: auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.maplibregl-popup-close-button:hover {
  background: rgba(239, 68, 68, 0.4);
  color: #ffffff;
  transform: rotate(90deg);
}

/* ────────────────  Cloud Card Inner Content Structure  ──────────────── */
.najm-cloud-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-size: 12px;
}

.najm-cloud-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 0.6rem;
  padding-inline-end: 1.5rem;
}

.najm-cloud-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.najm-cloud-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.najm-cloud-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.3;
}

.najm-cloud-sub {
  margin: 0;
  font-size: 10.5px;
  color: #a7f3d0;
  line-height: 1.25;
}

.najm-cloud-address-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.22);
  padding: 0.55rem 0.65rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.najm-cloud-address-text {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  line-height: 1.5;
  flex: 1;
}

.najm-geo-pin {
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 1px;
}

.najm-address-content {
  font-size: 11.5px;
  color: #f1f5f9;
  user-select: text;
}

.najm-cloud-copy-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.12);
  color: #a7f3d0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}

.najm-cloud-copy-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

.najm-cloud-copy-btn.copied {
  background: #10b981;
  color: #ffffff;
  border-color: #10b981;
}

.najm-cloud-phone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.65rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 11.5px;
}

.najm-phone-label-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #a7f3d0;
  font-weight: 700;
}

.najm-cloud-phone-link {
  text-decoration: none;
  transition: opacity 0.2s;
}

.najm-cloud-phone-link:hover {
  opacity: 0.85;
}

.najm-phone-persian {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 800;
  color: #6ee7b7;
  font-size: 12px;
}

.phone-ali {
  color: #d1fae5;
  font-weight: 600;
  font-size: 11px;
}

.najm-cloud-routing {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 0.55rem;
}

.najm-cloud-routing-title {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #a7f3d0;
  margin-bottom: 0.45rem;
}

.najm-cloud-routing-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
}

.najm-cloud-route-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.35rem;
  border-radius: 0.65rem;
  font-size: 10.5px;
  font-weight: 700;
  text-decoration: none;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  cursor: pointer;
}

.najm-cloud-route-btn:hover {
  transform: translateY(-2px);
  color: #ffffff;
}

.najm-cloud-route-btn.google:hover {
  background: rgba(66, 133, 244, 0.4);
  border-color: #4285f4;
}

.najm-cloud-route-btn.neshan:hover {
  background: rgba(24, 119, 242, 0.4);
  border-color: #1877f2;
}

.najm-cloud-route-btn.balad:hover {
  background: rgba(16, 185, 129, 0.4);
  border-color: #10b981;
}

.najm-cloud-route-btn.waze:hover {
  background: rgba(51, 204, 255, 0.4);
  border-color: #33ccff;
}

.route-icon {
  width: 18px;
  height: 18px;
  margin-bottom: 0.15rem;
}
</style>
