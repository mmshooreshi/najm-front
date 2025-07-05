<!-- pages/map2.vue -->
<template>
<MapboxMap
  map-id="<MAP_ID>"
  style="position: absolute; top: 0; bottom: 0; left: 250px; width: 500px;"
  :options="{
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [51.306003, 35.6735325], // starting position
    zoom: 16 // starting zoom
  }"
>
  <MapboxSource 
    source-id="<MAP_ID>"
    :source="{
      type: 'geojson',
      data: '/test.geojson'
    }"
  />
  <MapboxLayer
    :layer="{
      source: '<MAP_ID>',
      id: 'geojson-layer',
      type: 'fill'
    }"
  />
  <MapboxGeolocateControl position="top-left" />
</MapboxMap>

</template>

<script setup>
const style = 'https://api.maptiler.com/maps/streets/style.json?key=cQX2iET1gmOW38bedbUh';
const center = [51.306003, 35.6735325];
const zoom = 16;
</script>
