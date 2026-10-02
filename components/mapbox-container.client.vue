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

interface MapStyleOption {
  id: string
  badge: string
  label: Record<'fa' | 'en' | 'ar', string>
  style: any
}

// ────────────────  Styles Library  ────────────────
const MAP_STYLES: MapStyleOption[] = [
  {
    id: 'bright',
    badge: 'Vector',
    label: {
      fa: 'روشن وکتور (اصلی)',
      en: 'Vector Bright (Main)',
      ar: 'وکتور مشرق (رئيسي)'
    },
    style: 'https://tiles.openfreemap.org/styles/bright'
  },
  {
    id: 'liberty',
    badge: 'Vector',
    label: {
      fa: 'لیبرتی با جزئیات',
      en: 'Detailed Liberty',
      ar: 'ليبرتي بالتفاصيل'
    },
    style: 'https://tiles.openfreemap.org/styles/liberty'
  },
  {
    id: 'positron',
    badge: 'Vector',
    label: {
      fa: 'مینیمال روشن',
      en: 'Minimal Positron',
      ar: 'نمط بسيط هادئ'
    },
    style: 'https://tiles.openfreemap.org/styles/positron'
  },
  {
    id: 'carto-voyager',
    badge: 'Raster HD',
    label: {
      fa: 'کارتو وویجر پرسرعت',
      en: 'Carto Voyager (Fast)',
      ar: 'فواياجر عالي السرعة'
    },
    style: {
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
  },
  {
    id: 'carto-positron',
    badge: 'Raster',
    label: {
      fa: 'کارتو روشن مات',
      en: 'Carto Clean Light',
      ar: 'كارتو أبيض خفيف'
    },
    style: {
      version: 8,
      sources: {
        'carto-positron': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors, © CARTO'
        }
      },
      layers: [
        {
          id: 'carto-positron-layer',
          type: 'raster',
          source: 'carto-positron',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    }
  },
  {
    id: 'carto-dark',
    badge: 'Dark',
    label: {
      fa: 'حالت تاریک نایت',
      en: 'Dark Matter',
      ar: 'الوضع الداكن'
    },
    style: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors, © CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    }
  }
]

// ────────────────  Locations Data  ────────────────
const LOCATIONS: LocalizedItem[] = [
  {
    id: 'print',
    enabled: true, // PRIMARY location (active)
    coords: [51.3085833, 35.6735935], // [lng, lat]
    phone: '۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳',
    phoneHref: 'tel:+982166797911',
    // Verified Google Maps Place & directions deep links
    googlePlaceUrl: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA',
    googleNavUrl: 'https://www.google.com/maps/dir/?api=1&destination=35.6735935,51.3085833',
    neshanUrl: 'https://neshan.org/maps/@35.673594,51.308583,17.5z,0p/places',
    baladUrl: 'https://balad.ir/location?latitude=35.673594&longitude=51.308583',
    wazeUrl: 'https://waze.com/ul?ll=35.673594,51.308583&navigate=yes',
    title: {
      fa: 'چاپخانه و مجتمع کارخانجات نجم',
      en: 'Najm Printing & Packaging Complex',
      ar: 'مجمع نجم للطباعة والتغليف'
    },
    sublabel: {
      fa: 'چاپ افست ۵ رنگ، جعبه‌سازی و هاردباکس صنعتی',
      en: '5-Color Offset Printing & Industrial Box Packaging',
      ar: 'طباعة أوفست ٥ ألوان وصناعة العلب الفاخرة'
    },
    address: {
      fa: 'تهران، بزرگراه فتح، نبش کوچه تلفن‌خانه، پلاک ۱۶۶',
      en: 'Fath Highway, Corner of Telefonkhaneh Alley, No. 166, Tehran',
      ar: 'طريق فتح السريع، ناصية زقاق تلفن خانة، رقم ١٦٦، طهران'
    },
    // Legacy Warehouse SVG
    iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 19H8V21H6V19M12 3L2 8V21H4V10H20V21H22V8L12 3M8 11H4V13H8V11M8 15H4V17H8V15M14 11H10V13H14V11M14 15H10V17H14V15M14 19H10V21H14V19M20 11H16V13H20V11M20 15H16V17H20V15M20 19H16V21H20V19Z"/></svg>`
  },
  {
    id: 'office',
    enabled: false, // Disabled for now per user request; set to true anytime to re-enable
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
    iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18 15H16V17H18M18 11H16V13H18M18 7H16V9H18M14 7H12V9H14M14 11H12V13H14M14 15H12V17H14M10 7H8V9H10M10 11H8V13H10M10 15H8V17H10M20 3H4C2.89 3 2 3.89 2 5V21H22V5C22 3.89 21.1 3 20 3M20 19H4V5H20V19Z"/></svg>`
  }
]

// ────────────────  i18n UI Content  ────────────────
const ui = computed(() => {
  const lang = currentLangCode.value
  if (lang === 'en') {
    return {
      navTitle: 'Navigate with app:',
      copyAddress: 'Copy Address',
      copied: 'Address copied!',
      directCall: 'Direct Call',
      recenter: 'Recenter on Plant',
      stylesTitle: 'Map Style (Theme)',
      stylesSubtitle: 'Switch visual look anytime',
      loading: 'Loading map...',
      overview: 'Overview',
      details: 'Plant Details & Directions',
      hide: 'Minimize',
      show: 'Expand details'
    }
  }
  if (lang === 'ar') {
    return {
      navTitle: 'الملاحة عبر التطبيقات:',
      copyAddress: 'نسخ العنوان',
      copied: 'تم نسخ العنوان!',
      directCall: 'اتصال مباشر',
      recenter: 'توسيط على المصنع',
      stylesTitle: 'نمط الخريطة (معاينة)',
      stylesSubtitle: 'تغيير المظهر بحرية',
      loading: 'جاري تحميل الخريطة...',
      overview: 'نظرة عامة',
      details: 'تفاصيل المصنع والملاحة',
      hide: 'تصغير',
      show: 'عرض التفاصيل'
    }
  }
  return {
    navTitle: 'مسیریابی با اپلیکیشن:',
    copyAddress: 'کپی نشانی',
    copied: 'نشانی کپی شد!',
    directCall: 'تماس مستقیم',
    recenter: 'مرکز روی کارخانه',
    stylesTitle: 'پوسته نقشه (پیش‌نمایش)',
    stylesSubtitle: 'تغییر موقت استایل گرافیکی نقشه',
    loading: 'در حال بارگذاری نقشه...',
    overview: 'نمای کلی',
    details: 'مشخصات و مسیریابی کارخانه',
    hide: 'بستن پنل',
    show: 'مشخصات و مسیریابی'
  }
})

const activeLocations = computed(() => LOCATIONS.filter(l => l.enabled))
const activeLocationId = ref<string>('print')
const activeLocation = computed(() => {
  return activeLocations.value.find(l => l.id === activeLocationId.value) || activeLocations.value[0]
})

const mapContainer = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null
const markers: maplibregl.Marker[] = []
const isMapLoaded = ref(false)
const isCardExpanded = ref(true)
const isStyleMenuOpen = ref(false)
const currentStyleId = ref<string>('bright')

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

function copyAddress() {
  if (!activeLocation.value) return
  const addr = activeLocation.value.address[currentLangCode.value] || activeLocation.value.address.fa
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(addr)
  }
  isCopied.value = true
  if (copyTimeout) clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => {
    isCopied.value = false
  }, 2200)
}

function selectStyle(styleId: string) {
  currentStyleId.value = styleId
  const found = MAP_STYLES.find(s => s.id === styleId)
  if (found && map) {
    map.setStyle(found.style)
    try {
      localStorage.setItem('najm_preferred_map_style', styleId)
    } catch {}
  }
  isStyleMenuOpen.value = false
}

function createMarkerElement(loc: LocalizedItem): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'najm-marker-wrapper'

  // Label badge above pin (IRANSansX-d4 font, crisp white background)
  const labelEl = document.createElement('div')
  labelEl.className = 'najm-marker-label'
  const lang = currentLangCode.value
  labelEl.textContent = loc.title[lang] || loc.title.fa
  wrapper.appendChild(labelEl)

  // Pin element: Authentic Najm Green #014439 rounded square with warehouse icon
  const pinEl = document.createElement('div')
  pinEl.className = 'najm-marker-pin'
  pinEl.innerHTML = `
    <span class="najm-pin-radar"></span>
    <span class="najm-pin-inner">${loc.iconSvg}</span>
    <span class="najm-pin-pointer"></span>
  `
  wrapper.appendChild(pinEl)

  return wrapper
}

function focusLocation(loc: LocalizedItem, zoom = 16.5) {
  if (!map) return
  activeLocationId.value = loc.id
  isCardExpanded.value = true

  // Adjust bottom padding so that the marker and label badge stay prominently
  // in the upper/middle open canvas area and never overlap with the bottom card
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const bottomPadding = isCardExpanded.value ? (isMobile ? 320 : 260) : 90

  map.flyTo({
    center: loc.coords,
    zoom,
    pitch: 35,
    bearing: 0,
    speed: 1.4,
    curve: 1.4,
    padding: { bottom: bottomPadding, top: 60, left: 20, right: 20 },
    essential: true
  })
}

function toggleCard() {
  isCardExpanded.value = !isCardExpanded.value
  if (activeLocation.value) {
    focusLocation(activeLocation.value)
  }
}

function initMarkers() {
  if (!map || markers.length > 0) return

  activeLocations.value.forEach(loc => {
    const el = createMarkerElement(loc)

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coords)
      .addTo(map!)

    el.addEventListener('click', (e) => {
      e.stopPropagation()
      focusLocation(loc)
    })

    markers.push(marker)
  })
}

function updateMarkerLabels() {
  // Update marker label text if language changes dynamically
  const lang = currentLangCode.value
  markers.forEach((marker, i) => {
    const loc = activeLocations.value[i]
    if (loc) {
      const el = marker.getElement()
      const label = el.querySelector('.najm-marker-label')
      if (label) {
        label.textContent = loc.title[lang] || loc.title.fa
      }
    }
  })
}

watch(currentLangCode, () => {
  updateMarkerLabels()
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

  // Check saved style preference or default to bright
  let initialStyleId = 'bright'
  try {
    const saved = localStorage.getItem('najm_preferred_map_style')
    if (saved && MAP_STYLES.some(s => s.id === saved)) {
      initialStyleId = saved
    }
  } catch {}
  currentStyleId.value = initialStyleId

  const chosen = MAP_STYLES.find(s => s.id === initialStyleId) || MAP_STYLES[0]

  // Initialize MapLibre GL JS map
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: chosen.style,
    center: activeLocations.value[0].coords,
    zoom: 15.5,
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

  // Trigger resize and optimal camera focus once layout settles
  requestAnimationFrame(() => {
    map?.resize()
  })
  resizeTimer = setTimeout(() => {
    map?.resize()
    if (activeLocation.value) {
      focusLocation(activeLocation.value)
    }
  }, 350)

  map.on('load', () => {
    isMapLoaded.value = true
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    initMarkers()
    if (activeLocation.value) {
      focusLocation(activeLocation.value)
    }
  })

  // If vector tiles take longer than 3.5s, switch to high-speed raster fallback
  fallbackTimer = setTimeout(() => {
    if (!isMapLoaded.value && map) {
      console.warn('Vector map style timed out, switching to high-speed raster fallback')
      const voyager = MAP_STYLES.find(s => s.id === 'carto-voyager')!
      map.setStyle(voyager.style)
      currentStyleId.value = 'carto-voyager'
      isMapLoaded.value = true
      initMarkers()
      if (activeLocation.value) {
        focusLocation(activeLocation.value)
      }
    }
  }, 3500)

  // Re-attach markers if style changes
  map.on('style.load', () => {
    initMarkers()
  })

  // Automatic fallback on style error
  let fallbackAttempted = false
  map.on('error', (e) => {
    if (!fallbackAttempted && (e.error?.message?.includes('style') || e.error?.message?.includes('Failed to fetch') || (e as any)?.status === 401 || (e as any)?.status === 403)) {
      fallbackAttempted = true
      console.warn('Map style fallback triggered:', e.error?.message)
      const voyager = MAP_STYLES.find(s => s.id === 'carto-voyager')!
      if (map) {
        map.setStyle(voyager.style)
        currentStyleId.value = 'carto-voyager'
      }
      isMapLoaded.value = true
      initMarkers()
      if (activeLocation.value) {
        focusLocation(activeLocation.value)
      }
    }
  })
})

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (copyTimeout) clearTimeout(copyTimeout)
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

    <!-- ────────────────  Top Floating Header Controls  ──────────────── -->
    <div
      class="absolute top-4 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-6 pointer-events-none"
    >
      <!-- Style Picker Switcher (User requested for testing) -->
      <div class="relative pointer-events-auto">
        <button
          type="button"
          class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/75 hover:bg-black/90 text-white text-xs font-bold border border-white/20 shadow-xl backdrop-blur-xl transition-all cursor-pointer hover:border-emerald-400/60 hover:scale-102 active:scale-98"
          @click="isStyleMenuOpen = !isStyleMenuOpen"
          :title="ui.stylesTitle"
        >
          <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span class="hidden sm:inline">{{ ui.stylesTitle }}</span>
          <span class="px-1.5 py-0.5 rounded-md bg-emerald-900/80 text-emerald-200 text-[10px] font-mono">
            {{ MAP_STYLES.find(s => s.id === currentStyleId)?.badge }}
          </span>
          <svg class="w-3.5 h-3.5 opacity-70 transition-transform duration-200" :class="isStyleMenuOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <!-- Style Dropdown Popover -->
        <Transition name="fade-slide">
          <div
            v-if="isStyleMenuOpen"
            class="absolute top-full mt-2 start-0 w-64 p-2 rounded-2xl bg-[#014439]/95 text-white border border-emerald-500/30 shadow-2xl backdrop-blur-2xl z-40 space-y-1"
          >
            <div class="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
              <span class="text-[11px] font-bold text-emerald-300">{{ ui.stylesSubtitle }}</span>
              <span class="text-[9px] text-white/50 font-mono">۶ پوسته</span>
            </div>
            <button
              v-for="st in MAP_STYLES"
              :key="st.id"
              type="button"
              class="w-full text-start px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer"
              :class="currentStyleId === st.id
                ? 'bg-emerald-600/90 text-white font-bold shadow-sm'
                : 'text-zinc-200 hover:bg-white/10 hover:text-white'"
              @click="selectStyle(st.id)"
            >
              <span>{{ st.label[currentLangCode] || st.label.fa }}</span>
              <span
                class="text-[9px] px-1.5 py-0.5 rounded font-mono"
                :class="currentStyleId === st.id ? 'bg-white/20 text-white' : 'bg-black/30 text-emerald-300'"
              >
                {{ st.badge }}
              </span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Multiple Locations Switcher (Shows only if multiple locations enabled) -->
      <div
        v-if="activeLocations.length > 1"
        class="bg-black/75 backdrop-blur-xl border border-white/15 p-1 rounded-2xl shadow-2xl flex items-center gap-1 pointer-events-auto"
      >
        <button
          v-for="loc in activeLocations"
          :key="loc.id"
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          :class="activeLocationId === loc.id
            ? 'bg-emerald-600 text-white shadow-md'
            : 'text-zinc-300 hover:text-white hover:bg-white/10'"
          @click="focusLocation(loc)"
        >
          <span class="w-2 h-2 rounded-full" :class="activeLocationId === loc.id ? 'bg-emerald-200' : 'bg-zinc-500'"></span>
          <span>{{ loc.title[currentLangCode] || loc.title.fa }}</span>
        </button>
      </div>

      <!-- Recenter Button -->
      <button
        type="button"
        class="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/75 hover:bg-black/90 text-white text-xs font-bold border border-white/20 shadow-xl backdrop-blur-xl transition-all cursor-pointer hover:border-emerald-400/60 active:scale-95"
        @click="focusLocation(activeLocation)"
        :title="ui.recenter"
      >
        <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="7" />
          <polyline points="12 2 12 5" />
          <polyline points="12 19 12 22" />
          <polyline points="2 12 5 12" />
          <polyline points="19 12 22 12" />
        </svg>
        <span class="hidden md:inline">{{ ui.recenter }}</span>
      </button>
    </div>

    <!-- ────────────────  Floating Bottom Detail Card (Does NOT cover pin)  ──────────────── -->
    <div
      class="absolute bottom-5 inset-x-3 sm:inset-x-auto sm:end-6 sm:w-[410px] z-30 pointer-events-auto transition-all duration-300"
    >
      <!-- Expanded State Card -->
      <div
        v-if="isCardExpanded"
        class="bg-[#014439]/95 text-white border border-emerald-400/30 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-3.5 animate-fadeIn"
      >
        <!-- Card Header with Legacy Icon & Title -->
        <div class="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
              <span v-html="activeLocation.iconSvg" class="w-5 h-5 flex items-center justify-center text-emerald-200"></span>
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-white leading-tight">
                {{ activeLocation.title[currentLangCode] || activeLocation.title.fa }}
              </h3>
              <p class="text-[11px] text-emerald-200/80 mt-0.5">
                {{ activeLocation.sublabel[currentLangCode] || activeLocation.sublabel.fa }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            @click="toggleCard"
            :title="ui.hide"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <!-- Address & Copy -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-start justify-between gap-2 text-xs leading-relaxed text-zinc-100 bg-black/20 p-2.5 rounded-xl border border-white/5">
            <div class="flex items-start gap-1.5 flex-1">
              <span class="text-emerald-400 text-sm shrink-0 mt-0.5">📍</span>
              <span class="text-[12px] select-text">{{ activeLocation.address[currentLangCode] || activeLocation.address.fa }}</span>
            </div>
            <button
              type="button"
              class="px-2.5 py-1 rounded-lg text-[10.5px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer"
              :class="isCopied
                ? 'bg-emerald-500 text-white'
                : 'bg-white/15 hover:bg-white/25 text-emerald-200 hover:text-white'"
              @click="copyAddress"
              :title="ui.copyAddress"
            >
              <svg v-if="!isCopied" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ isCopied ? ui.copied : ui.copyAddress }}</span>
            </button>
          </div>

          <!-- Phone Direct Call -->
          <div class="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/20 border border-white/5 text-xs">
            <div class="flex items-center gap-1.5 text-emerald-300 font-bold">
              <span>📞</span>
              <span>{{ ui.directCall }}:</span>
            </div>
            <a
              :href="activeLocation.phoneHref"
              class="font-mono text-emerald-300 hover:text-emerald-100 font-bold text-xs tracking-wider transition-colors underline flex items-center gap-1"
              dir="ltr"
            >
              <span>{{ activeLocation.phone }}</span>
            </a>
          </div>
        </div>

        <!-- ────────────────  Routing / Navigation Deep Links  ──────────────── -->
        <div class="border-t border-white/10 pt-2.5">
          <span class="block text-[11px] font-bold text-emerald-200 mb-2">
            {{ ui.navTitle }}
          </span>
          <div class="grid grid-cols-4 gap-2">
            <!-- Google Maps -->
            <a
              :href="activeLocation.googlePlaceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-emerald-600/40 border border-white/15 hover:border-emerald-400 transition-all text-center group cursor-pointer"
              title="Google Maps"
            >
              <svg class="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span class="text-[10px] font-bold text-white leading-tight">Google</span>
            </a>

            <!-- Neshan -->
            <a
              :href="activeLocation.neshanUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-blue-600/40 border border-white/15 hover:border-blue-400 transition-all text-center group cursor-pointer"
              title="نشان"
            >
              <svg class="w-5 h-5 text-blue-300 group-hover:scale-110 transition-transform mb-1" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <span class="text-[10px] font-bold text-white leading-tight">نشان</span>
            </a>

            <!-- Balad -->
            <a
              :href="activeLocation.baladUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-emerald-700/50 border border-white/15 hover:border-emerald-400 transition-all text-center group cursor-pointer"
              title="بلد"
            >
              <svg class="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span class="text-[10px] font-bold text-white leading-tight">بلد</span>
            </a>

            <!-- Waze -->
            <a
              :href="activeLocation.wazeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-cyan-600/40 border border-white/15 hover:border-cyan-400 transition-all text-center group cursor-pointer"
              title="Waze"
            >
              <svg class="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
              <span class="text-[10px] font-bold text-white leading-tight">Waze</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Collapsed State Pill (Super clean, reveals 100% of map) -->
      <button
        v-else
        type="button"
        class="w-full bg-[#014439]/95 text-white border border-emerald-400/40 rounded-2xl shadow-2xl backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#014439] hover:border-emerald-300 transition-all group"
        @click="toggleCard"
      >
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-bold text-white">
            {{ activeLocation.title[currentLangCode] || activeLocation.title.fa }}
          </span>
          <span class="text-[11px] text-emerald-300/80 hidden sm:inline">
            — {{ ui.details }}
          </span>
        </div>
        <div class="flex items-center gap-1 text-emerald-300 text-xs font-bold group-hover:text-white">
          <span>{{ ui.show }}</span>
          <svg class="w-4 h-4 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
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
.maplibregl-ctrl-scale,
.najm-marker-wrapper,
.najm-marker-label {
  font-family: 'IRANSansX-d4', 'IRANSansX', sans-serif !important;
}

/* ────────────────  Legacy Rounded-Square Marker  ──────────────── */
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
  transform: scale(1.1) translateY(-4px);
  z-index: 50;
}

/* Pill badge above pin with Najm Green text */
.najm-marker-label {
  background: #ffffff;
  color: #014439;
  border: 1.5px solid rgba(1, 68, 57, 0.25);
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 800;
  margin-bottom: 5px;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  letter-spacing: -0.2px;
  pointer-events: none;
}

/* Authentic Najm Green Rounded Square Pin */
.najm-marker-pin {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 0.85rem; /* The classic smooth rounded square */
  background-color: #014439; /* Official Najm Green */
  border: 2.5px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(1, 68, 57, 0.5);
  color: #ffffff;
}

.najm-pin-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

/* Subtle downwards triangular pointer anchor */
.najm-pin-pointer {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #014439;
}

/* Radar pulse animation */
.najm-pin-radar {
  position: absolute;
  inset: -6px;
  border-radius: 1.1rem;
  border: 2px solid #10b981;
  opacity: 0.75;
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

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
