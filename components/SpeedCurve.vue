<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale,
  annotationPlugin
)

const props = defineProps<{
  points: [number, number][],
  progress: number   // ← value between 0 and 1
}>()

const data = {
  labels: props.points.map(p => p[0]),
  datasets: [{
    label: 'Speed Ramp',
    data: props.points.map(p => ({ x: p[0], y: p[1] })),
    borderColor: 'rgb(14, 165, 233)',
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    tension: 0.4,
    fill: true,
    pointRadius: 5,
    pointHoverRadius: 7
  }]
}

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: {
      type: 'linear',
      min: 0,
      max: 1,
      title: { display: false }
    },
    y: {
      min: 0,
      max: 1.5,
      title: { display: false }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    annotation: {
      annotations: {
        playhead: {
          type: 'line',
          xMin: props.progress,
          xMax: props.progress,
          borderColor: 'red',
          borderWidth: 2,
        }
      }
    }
  }
}))
</script>

<template>
  <Line :data="data" :options="options" />
</template>
