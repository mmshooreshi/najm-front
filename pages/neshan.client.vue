<!-- pages/neshan.client.vue -->
<template>
  <div class="w-screen h-screen">
    <MapComponent
      :options="mapOptions"
      class=" !text-d4"
      :map-setter="handleMap"
    />
  </div>
</template>

<script setup>
import { MapComponent, MapTypes } from '@neshan-maps-platform/mapbox-gl-vue'
import '@neshan-maps-platform/mapbox-gl-vue/dist/style.css'
import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl'

const mapRef = ref(null)

const mapOptions = {
  mapKey: 'web.624bf8560ef44688b1b1d971027b361c', // <-- جایگزین کن با کلیدت
  mapType: MapTypes.neshanVector,
  poi: false,
  traffic: false,
  mapTypeControllerStatus: {
    show: true,
    position: 'bottom-left'
  },
  center: [51.392610, 35.699967], // [lng, lat] of your desired map center
  zoom: 16,                       // initial zoom level

}

function handleMap(map) {
  mapRef.value = map

  // دفتر مرکزی
  const officeMarker = new nmp_mapboxgl.Marker({ color: '#1D4ED8' }) // blue
    .setLngLat([51.392610, 35.699967])
    .setPopup(
      new nmp_mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>دفتر مرکزی</strong><br/>
        میدان انقلاب، کارگر جنوبی، شهدای ژاندارمری<br/>
        نرسیده به منیری جاوید، پلاک ۱۱۷ طبقه سوم<br/>
        تلفن: 09361415413
      `)
    )
    .addTo(map)
    .togglePopup()

  // چاپخانه
  const printMarker = new nmp_mapboxgl.Marker({ color: '#10B981' }) // green
    .setLngLat([51.30858329680908, 35.67359353958164])
    .setPopup(
      new nmp_mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>چاپخانه</strong><br/>
        بزرگراه فتح، زیر پل شیر پاستوریزه<br/>
        ابتدای ۴۵ متری زرند، کوچه تلفن خانه، پلاک ۱۶۶<br/>
        تلفن: 66797911-3<br/>
        فکس: 66789577
      `)
    )
    .addTo(map)
}


definePageMeta({
  name: 'neshan',
  layout: 'd',
})

</script>

<style>
/* reset */
html, body {
  margin: 0;
  padding: 0;
}

/* popup wrapper inherits your font */
.mapboxgl-popup {
  font-family: 'IRANSansX-d4', sans-serif !important;
}

/* glassmorphic popup box */
.mapboxgl-popup-content {
  position: relative;
  padding: 2.5rem 1rem 1.25rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  color: #111;
  overflow: hidden;

  /* entry animation setup */
  transform: translateY(1rem) scale(0.95);
  opacity: 0;
  animation: popupIn 0.35s ease-out forwards;
}

/* closing animation */
.mapboxgl-popup-content.closing {
  animation: popupOut 0.25s ease-in forwards;
}

/* animated keyframes */
@keyframes popupIn {
  0%   { opacity: 0; transform: translateY(1rem) scale(0.95); }
  60%  { opacity: 1; transform: translateY(0) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes popupOut {
  to { opacity: 0; transform: translateY(1rem) scale(0.95); }
}


.mapboxgl-popup-anchor-top .mapboxgl-popup-tip{
  border-bottom-color: #ffffff61 !important;
}

.mapboxgl-popup-anchor-left .mapboxgl-popup-tip{
  border-right-color: #ffffff61 !important;
}
.mapboxgl-popup-anchor-right .mapboxgl-popup-tip{
  border-left-color: #ffffff61 !important;
}
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip{
  border-top-color: #ffffff61 !important;
}
/* sleek close button */
.mapboxgl-popup-close-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255 255 255 / 0.2);
  backdrop-filter: blur(6px);
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  color: #111;
  cursor: pointer;
  transform: scale(1);
  transition: 
    transform 200ms cubic-bezier(.4,0,.2,1),
    background 200ms ease;
}

.mapboxgl-popup-anchor-right{
  flex-direction: row;
}

.mapboxgl-popup-anchor-left{
  flex-direction: row-reverse;
}
.mapboxgl-popup-close-button:hover {
  background: rgba(255 255 255 / 0.3);
  transform: scale(1.15);
}

.mapboxgl-popup-close-button:active {
  transform: scale(0.92);
}

.mapboxgl-popup-close-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(29 78 216 / 0.25);
}

</style>
