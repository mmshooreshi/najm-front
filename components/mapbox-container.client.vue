<!-- components/mapbox-container.client.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface LocationItem {
  id: string
  label: string
  sublabel: string
  coords: [number, number] // [lng, lat]
  svg: string
  address: string
  phone: string
  phoneHref: string
}

// Map Style Configuration (Free Open-Source vector maps, NO accounts or API keys needed)
const config = useRuntimeConfig()
const MAP_STYLE = config.public?.mapbox?.style?.startsWith('http')
  ? config.public.mapbox.style
  : 'https://tiles.openfreemap.org/styles/bright'

// Universal OSM Raster fallback style in case vector CDN is unreachable
const OSM_FALLBACK_STYLE = {
  version: 8 as const,
  sources: {
    'osm-tiles': {
      type: 'raster' as const,
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster' as const,
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
}

// Najm Locations
const LOCATIONS: LocationItem[] = [
  {
    id: 'print',
    label: 'چاپخانه و کارخانه',
    sublabel: 'مجتمع چاپ و بسته‌بندی نجم',
    coords: [51.30858329680908, 35.67359353958164],
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="4" height="6" x="10" y="16"/></svg>`,
    address: 'تهران، بزرگراه فتح، زیر پل شیر پاستوریزه، ابتدای ۴۵ متری زرند، کوچه تلفن‌خانه، پلاک ۱۶۶',
    phone: '۰۲۱-۶۶۷۹۷۹۱۱ الی ۳',
    phoneHref: 'tel:02166797911'
  },
  {
    id: 'office',
    label: 'دفتر مرکزی',
    sublabel: 'دفتر هماهنگی و پذیرش سفارشات',
    coords: [51.392610, 35.699967],
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    address: 'تهران، میدان انقلاب، خیابان کارگر جنوبی، خیابان شهدای ژاندارمری، پلاک ۱۱۷، طبقه ۳',
    phone: '۰۹۳۶۱۴۱۵۴۱۳',
    phoneHref: 'tel:09361415413'
  }
]

const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null
const markers: maplibregl.Marker[] = []
const activeLocationId = ref<string>('print')
const isMapLoaded = ref(false)

function createPopupHtml(loc: LocationItem): string {
  const [lng, lat] = loc.coords
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
  const neshanUrl = `https://neshan.org/maps/@${lat},${lng},17z`
  const baladUrl = `https://balad.ir/location?latitude=${lat}&longitude=${lng}`

  return `
    <div class="najm-popup-card" dir="rtl">
      <div class="najm-popup-header">
        <span class="najm-popup-icon">${loc.svg}</span>
        <div>
          <h4 class="najm-popup-title">${loc.label}</h4>
          <span class="najm-popup-sub">${loc.sublabel}</span>
        </div>
      </div>

      <div class="najm-popup-body">
        <div class="najm-popup-row">
          <span class="najm-popup-label">📍 نشانی:</span>
          <span class="najm-popup-text">${loc.address}</span>
        </div>
        <div class="najm-popup-row">
          <span class="najm-popup-label">📞 تماس:</span>
          <a href="${loc.phoneHref}" class="najm-popup-phone" dir="ltr">${loc.phone}</a>
        </div>
      </div>

      <div class="najm-popup-routing">
        <span class="najm-routing-title">مسیریابی با اپلیکیشن:</span>
        <div class="najm-routing-buttons">
          <a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="najm-route-btn google" title="گوگل مپ">
            Google Maps
          </a>
          <a href="${neshanUrl}" target="_blank" rel="noopener noreferrer" class="najm-route-btn neshan" title="نشان">
            نشان
          </a>
          <a href="${baladUrl}" target="_blank" rel="noopener noreferrer" class="najm-route-btn balad" title="بلد">
            بلد
          </a>
          <a href="${wazeUrl}" target="_blank" rel="noopener noreferrer" class="najm-route-btn waze" title="ویز">
            Waze
          </a>
        </div>
      </div>
    </div>
  `
}

function createMarkerElement(loc: LocationItem): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'najm-marker-wrapper'

  // Label badge above pin
  const labelEl = document.createElement('div')
  labelEl.className = 'najm-marker-label'
  labelEl.textContent = loc.label
  wrapper.appendChild(labelEl)

  // Pin element
  const pinEl = document.createElement('div')
  pinEl.className = 'najm-marker-pin'
  pinEl.innerHTML = `
    <span class="najm-pin-radar"></span>
    <span class="najm-pin-inner">${loc.svg}</span>
  `
  wrapper.appendChild(pinEl)

  return wrapper
}

function flyToLocation(loc: LocationItem, zoom = 16.5) {
  if (!map) return
  activeLocationId.value = loc.id
  map.flyTo({
    center: loc.coords,
    zoom,
    pitch: 45,
    bearing: -10,
    speed: 1.4,
    curve: 1.4,
    essential: true
  })
}

function fitAllLocations() {
  if (!map) return
  activeLocationId.value = 'all'
  const bounds = new maplibregl.LngLatBounds()
  LOCATIONS.forEach(loc => bounds.extend(loc.coords))
  map.fitBounds(bounds, {
    padding: { top: 90, bottom: 90, left: 70, right: 70 },
    pitch: 25,
    bearing: 0,
    speed: 1.2,
    curve: 1.4,
    essential: true
  })
}

onMounted(() => {
  if (!mapContainer.value) return

  // Enable Persian / Arabic RTL text rendering plugin locally
  try {
    if (maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      maplibregl.setRTLTextPlugin('/js/mapbox-gl-rtl-text.js', null, true)
    }
  } catch {
    // Already set or unsupported environment
  }

  // Initialize MapLibre GL JS map with zero accounts or tokens
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: MAP_STYLE,
    center: LOCATIONS[0].coords,
    zoom: 12,
    pitch: 35,
    bearing: 0,
    antialias: true
  })

  // Add navigation and geolocate controls
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-left')
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }),
    'bottom-left'
  )
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right')

  map.on('load', () => {
    isMapLoaded.value = true

    // Add markers and popups for Najm locations
    LOCATIONS.forEach(loc => {
      const el = createMarkerElement(loc)
      const popup = new maplibregl.Popup({
        offset: 35,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '340px'
      }).setHTML(createPopupHtml(loc))

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(loc.coords)
        .setPopup(popup)
        .addTo(map!)

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        flyToLocation(loc)
        popup.addTo(map!)
      })

      markers.push(marker)
    })

    // Initially open popup for the print facility
    if (markers[0]) {
      markers[0].togglePopup()
    }
  })

  // Double-click resets to overview
  map.on('dblclick', () => {
    fitAllLocations()
  })

  // Automatic robust fallback if external vector CDN fails to load
  let fallbackAttempted = false
  map.on('error', (e) => {
    if (!fallbackAttempted && (e.error?.message?.includes('style') || e.error?.message?.includes('Failed to fetch') || (e as any)?.status === 401 || (e as any)?.status === 403)) {
      fallbackAttempted = true
      console.warn('Map style fallback triggered:', e.error?.message)
      if (map) {
        map.setStyle(OSM_FALLBACK_STYLE)
      }
    }
  })
})

onBeforeUnmount(() => {
  if (map) {
    markers.forEach(m => m.remove())
    markers.length = 0
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="relative w-full h-full bg-[#0a1815] text-white overflow-hidden select-none">
    <!-- Map Canvas Container -->
    <div ref="mapContainer" class="w-full h-full" />

    <!-- Loading Indicator -->
    <div
      v-if="!isMapLoaded"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-none transition-opacity duration-300"
    >
      <div class="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3"></div>
      <span class="text-sm font-semibold text-emerald-300">در حال بارگذاری نقشه مپ‌باکس...</span>
    </div>

    <!-- Floating Top Navigation Pill Bar -->
    <div
      class="absolute top-4 inset-x-0 z-20 flex justify-center px-4 pointer-events-none"
      dir="rtl"
    >
      <div class="bg-zinc-950/85 backdrop-blur-xl border border-white/15 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1.5 pointer-events-auto">
        <button
          v-for="loc in LOCATIONS"
          :key="loc.id"
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          :class="activeLocationId === loc.id
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 scale-102'
            : 'text-zinc-300 hover:text-white hover:bg-white/10'"
          @click="flyToLocation(loc)"
        >
          <span class="w-2 h-2 rounded-full" :class="activeLocationId === loc.id ? 'bg-emerald-200' : 'bg-zinc-500'"></span>
          <span>{{ loc.label }}</span>
        </button>

        <div class="w-px h-4 bg-white/20 mx-0.5"></div>

        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
          :class="activeLocationId === 'all'
            ? 'bg-zinc-700 text-white shadow-sm'
            : 'text-zinc-400 hover:text-white hover:bg-white/10'"
          @click="fitAllLocations"
          title="مشاهده هر دو موقعیت روی نقشه"
        >
          <span>نمای کلی</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Marker Styles */
.najm-marker-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  transform: translate3d(0, 0, 0);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.najm-marker-wrapper:hover {
  transform: scale(1.12) translateY(-4px);
  z-index: 50;
}

.najm-marker-label {
  background: rgba(1, 68, 57, 0.95);
  color: #ffffff;
  border: 1px solid rgba(16, 185, 129, 0.4);
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 6px;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  letter-spacing: -0.2px;
}

.najm-marker-pin {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981 0%, #014439 100%);
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
  color: #ffffff;
}

.najm-pin-radar {
  position: absolute;
  inset: -6px;
  border-radius: 18px;
  border: 2px solid #10b981;
  opacity: 0.8;
  animation: najmRadarPulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  pointer-events: none;
}

@keyframes najmRadarPulse {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

/* Glassmorphism Popup Window */
.maplibregl-popup,
.mapboxgl-popup {
  font-family: inherit;
  z-index: 40;
}

.maplibregl-popup-content,
.mapboxgl-popup-content {
  background: rgba(8, 28, 23, 0.95) !important;
  color: #f4fbf7 !important;
  border: 1px solid rgba(16, 185, 129, 0.35) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 1.25rem !important;
  padding: 1.25rem 1.25rem 1rem !important;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6) !important;
  animation: popupFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}

@keyframes popupFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.maplibregl-popup-tip,
.mapboxgl-popup-tip {
  border-top-color: rgba(8, 28, 23, 0.95) !important;
  border-bottom-color: rgba(8, 28, 23, 0.95) !important;
  border-left-color: rgba(8, 28, 23, 0.95) !important;
  border-right-color: rgba(8, 28, 23, 0.95) !important;
}

.maplibregl-popup-close-button,
.mapboxgl-popup-close-button {
  width: 26px;
  height: 26px;
  top: 10px;
  left: 10px;
  right: auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
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

.maplibregl-popup-close-button:hover,
.mapboxgl-popup-close-button:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #ffffff;
  transform: rotate(90deg);
}

/* Card Content Structure */
.najm-popup-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 12px;
}

.najm-popup-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.65rem;
}

.najm-popup-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  display: flex;
  align-items: center;
  justify-content: center;
  shrink: 0;
}

.najm-popup-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.najm-popup-sub {
  font-size: 11px;
  color: #9ca3af;
  display: block;
}

.najm-popup-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.najm-popup-row {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  line-height: 1.5;
}

.najm-popup-label {
  color: #10b981;
  font-weight: 600;
  shrink: 0;
}

.najm-popup-text {
  color: #e5e7eb;
  font-size: 11.5px;
}

.najm-popup-phone {
  color: #34d399;
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.15s ease;
}

.najm-popup-phone:hover {
  color: #6ee7b7;
  text-decoration: underline;
}

.najm-popup-routing {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.65rem;
}

.najm-routing-title {
  display: block;
  font-size: 10.5px;
  color: #9ca3af;
  margin-bottom: 0.45rem;
}

.najm-routing-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
}

.najm-route-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 600;
  text-decoration: none;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s ease;
}

.najm-route-btn:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.5);
  color: #ffffff;
  transform: translateY(-1px);
}

.najm-route-btn.google:hover {
  background: rgba(66, 133, 244, 0.25);
  border-color: rgba(66, 133, 244, 0.5);
}

.najm-route-btn.waze:hover {
  background: rgba(51, 204, 255, 0.25);
  border-color: rgba(51, 204, 255, 0.5);
}
</style>
