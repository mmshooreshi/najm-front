<template>
    <!-- note the ref="wrapper" here -->
    <div ref="wrapper" class="overflow-visible pt-8">
        <!-- Outer Swiper: one slide per package -->
        <!-- Toggle button -->

        <!-- {{ selectedBgColor }}
                {{ activeSlideIndex }}
                {{ activeItemRef }}
 -->
        <Swiper slides-per-view="1" space-between="20"
            :autoplay="{ delay: 50000, disableOnInteraction: false, pauseOnMouseEnter: true }"
            @slideChange="onSlideChange"
            @swiper="(swiper) => onOuterSwiper(swiper)" class="h-[500px] w-full !px-2 mb-8 outer-swiper">

            <SwiperSlide v-for="(pkg, pkgIdx) in packages" :key="pkgIdx" @click.prevent="toggle(pkgIdx)"
                class="border flex flex-col p-2 rounded-3xl overflow-hidden content-end cont-slide"
                :style="outerSwiperSlideStyle(pkgIdx)"
                :class="[editMode ? 'border-red-600':'border-transparent' ]">


                <!-- Inner Swiper -->
                <Swiper slides-per-view="auto" space-between="8"
                    :autoplay="{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }"
                    class="w-full !h-42 !overflow-visible" @swiper="(swiper) => onInnerSwiper(swiper, pkgIdx)">

                    <SwiperSlide
                        v-for="(prod, idx) in pkg"
                        :key="prod.id"
                        class="product-card w-max h-max max-h-42 max-w-42 p-2 rounded-2xl flex items-center justify-center overflow-visible"
                        :style="cardStyle(pkgIdx, idx)"
                        :class="[isFree[pkgIdx] ? 'bg-transparent' : 'bg-white']" 
                        @pointerdown.prevent="() => selectTarget(pkgIdx, idx)">

                        


                        <div class="card-content w-full h-full flex items-center justify-center pointer-events-none">
                            <img :src="prod.image" :alt="`Product ${prod.id}`" class="object-contain max-h-[120px] max-w-[150px] mx-auto my-auto" />
                        </div>

                        <div v-if="editMode && editingTarget?.pkgIdx === pkgIdx && editingTarget?.idx === idx" class="resize-handles">
                            <div class="handle top-left"></div>
                            <div class="handle top-right"></div>
                            <div class="handle bottom-left"></div>
                            <div class="handle bottom-right"></div>
                            <div class="rotate-handle"></div>
                            <div class="center-marker text-xl ">
                                <span class="bg-teal/50 p-1 px-2 rotate-0 rounded-lg">
                                {{freeTargets[pkgIdx][idx].z}}
                        </span>
                            </div>

                              <!-- New Z-Index buttons -->
                            <div class="z-up" @click.stop="bringToFront(pkgIdx, idx)">⬆️</div>
                            <div class="z-down" @click.stop="sendToBack(pkgIdx, idx)">⬇️</div>

                            </div>

                    </SwiperSlide>

                </Swiper>
            </SwiperSlide>

        </Swiper>


    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore from 'swiper'
import { FreeMode, Autoplay } from 'swiper/modules'
import 'swiper/css'
import interact from 'interactjs'

SwiperCore.use([FreeMode, Autoplay])
interface Product { id: number; image: string, bgColor: string }
// Track the active slide and active item references
const activeSlideRef = ref<SwiperSlide | null>(null)
const activeSlideIndex = ref<number>(0)
const activeItemRef = ref<Product | null>(null)
const selectedBgColor = ref("#F6EC9E")

// your data
const packages: Product[][] = [
    [
        { id: 1, image: '/images/main/1.png', bgColor: '#F6EC9E' },
        { id: 2, image: '/images/main/2.png', bgColor: '#F6EC9E' },
        { id: 3, image: '/images/main/3.png', bgColor: '#F6EC9E' },
        { id: 4, image: '/images/main/4.png', bgColor: '#F6EC9E' },
        { id: 5, image: '/images/main/5.png', bgColor: '#F6EC9E' }
    ],
    [
        { id: 6, image: '/images/main/6.png',  bgColor: '#A8A5F9' },
        { id: 7, image: '/images/main/7.png',  bgColor: '#A8A5F9' },
        { id: 8, image: '/images/main/8.png',  bgColor: '#A8A5F9' },
        { id: 9, image: '/images/main/9.png',  bgColor: '#A8A5F9' },
        { id: 10, image: '/images/main/10.png', bgColor: '#A8A5F9' }
    ],
    [
        { id: 11, image: '/images/main/1.png',  bgColor: '#A5D0F9' },
        { id: 12, image: '/images/main/2.png',  bgColor: '#A5D0F9' },
        { id: 13, image: '/images/main/3.png',  bgColor: '#A5D0F9' },
        { id: 14, image: '/images/main/4.png',  bgColor: '#A5D0F9' },
        { id: 15, image: '/images/main/5.png',  bgColor: '#A5D0F9' }
    ],
    [
        { id: 6, image: '/images/main/6.png',  bgColor: '#A8A5F9' },
        { id: 7, image: '/images/main/7.png',  bgColor: '#A8A5F9' },
        { id: 8, image: '/images/main/8.png',  bgColor: '#A8A5F9' },
        { id: 9, image: '/images/main/9.png',  bgColor: '#A8A5F9' },
        { id: 10, image: '/images/main/10.png', bgColor: '#A8A5F9' }
    ],
    [
        { id: 11, image: '/images/main/1.png',  bgColor: '#A5F9D5' },
        { id: 12, image: '/images/main/2.png',  bgColor: '#A5F9D5' },
        { id: 13, image: '/images/main/3.png',  bgColor: '#A5F9D5' },
        { id: 14, image: '/images/main/4.png',  bgColor: '#A5F9D5' },
        { id: 15, image: '/images/main/5.png',  bgColor: '#A5F9D5' }
    ],
    [
        { id: 6, image: '/images/main/6.png',  bgColor: '#F9D6A5' },
        { id: 7, image: '/images/main/7.png',  bgColor: '#F9D6A5' },
        { id: 8, image: '/images/main/8.png',  bgColor: '#F9D6A5' },
        { id: 9, image: '/images/main/9.png',  bgColor: '#F9D6A5' },
        { id: 10, image: '/images/main/10.png', bgColor: '#F9D6A5' }
    ],
    [
        { id: 11, image: '/images/main/1.png',  bgColor: '#F9A5A9' },
        { id: 12, image: '/images/main/2.png',  bgColor: '#F9A5A9' },
        { id: 13, image: '/images/main/3.png',  bgColor: '#F9A5A9' },
        { id: 14, image: '/images/main/4.png',  bgColor: '#F9A5A9' },
        { id: 15, image: '/images/main/5.png',  bgColor: '#F9A5A9' }
    ],
    [
        { id: 6, image: '/images/main/6.png',  bgColor: '#E5F9A5' },
        { id: 7, image: '/images/main/7.png',  bgColor: '#E5F9A5' },
        { id: 8, image: '/images/main/8.png',  bgColor: '#E5F9A5' },
        { id: 9, image: '/images/main/9.png',  bgColor: '#E5F9A5' },
        { id: 10, image: '/images/main/10.png', bgColor: '#E5F9A5' }
    ]
]

const innerSwipers = ref<(SwiperCore | null)[]>(packages.map(() => null))
const outerSwiper = ref<(SwiperCore | null)>(null)

const isFree = ref<boolean[]>(packages.map(() => false))
const freeTargets = ref(packages.map(pkg => pkg.map(() => ({ x: 0, y: 0, r: 0 }))))
const wrapper = ref<HTMLElement | null>(null)

// Dragging state
const dragging = ref<{
    pkgIdx: number
    idx: number
    startX: number
    startY: number
    origX: number
    origY: number
} | null>(null)

// Capture inner swiper
function onInnerSwiper(swiper: SwiperCore, pkgIdx: number) {
    innerSwipers.value[pkgIdx] = swiper
}
// Capture inner swiper
function onOuterSwiper(swiper: SwiperCore) {
    outerSwiper.value = swiper
}

function bringToFront(pkgIdx: number, idx: number) {
  freeTargets.value[pkgIdx][idx].z += 1
}

function sendToBack(pkgIdx: number, idx: number) {
  freeTargets.value[pkgIdx][idx].z -= 1
}

const editingTarget = ref<{ pkgIdx: number, idx: number } | null>(null)

function selectTarget(pkgIdx: number, idx: number) {
  if (!isFree.value[pkgIdx]) return

  // If clicking on already selected, do nothing
  if (editingTarget.value?.pkgIdx === pkgIdx && editingTarget.value?.idx === idx) return

  // Update currently editing target
  editingTarget.value = { pkgIdx, idx }

  // 🛠 Now enable editing on that card
  nextTick(() => {
    // ✅ Correct way
    const activeSlide = wrapper.value.querySelectorAll('.swiper-slide-active:not(.product-card)')[0]
    const innerCards = activeSlide?.querySelectorAll('.product-card')

    const card = activeSlide.querySelectorAll('.product-card')[idx] as HTMLElement

    console.log(card)
    if (card) {
      enableEditMode(pkgIdx, idx, card)
    }

    activeItemRef.value = packages[pkgIdx][idx]

    // Update selected background color
    selectedBgColor.value = activeItemRef.value.bgColor

  })
}

onMounted(() => {
  document.addEventListener('pointerdown', handleGlobalClick)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', handleGlobalClick)
})

function handleGlobalClick(e: PointerEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.product-card')) {
    editingTarget.value = null
  }
}

const editMode = ref(false)
function editModeToggle(pkgIdx: number) {
  if (editMode.value) {
    outerSwiper.value.allowTouchMove = true
    editMode.value = false

    // Remove interactjs from all product cards
    document.querySelectorAll('.product-card').forEach(el => {
      interact(el).unset()
    })
  } else {
    outerSwiper.value.allowTouchMove = false
    editMode.value = true
  }
}

function enableEditMode(pkgIdx: number, idx: number, card: HTMLElement) {
  if (!isFree.value[pkgIdx]) return
//   const card = (e.currentTarget as HTMLElement)

  interact(card)
    .draggable({
      listeners: {
        move(event) {
          freeTargets.value[pkgIdx][idx].x += event.dx
          freeTargets.value[pkgIdx][idx].y += event.dy
        }
      }
    })

    let startRotation = 0
let prevAngle = 0

interact(card.querySelector('.rotate-handle') as HTMLElement)
  .draggable({
    listeners: {
      start(event) {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = event.clientX - centerX
        const dy = event.clientY - centerY

        prevAngle = Math.atan2(dy, dx) * (180 / Math.PI)
        startRotation = freeTargets.value[pkgIdx][idx].r
      },
      move(event) {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = event.clientX - centerX
        const dy = event.clientY - centerY

        const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI)
        let delta = currentAngle - prevAngle

        // 🔥🔥 Keep delta small: (-180, 180)
        if (delta > 180) delta -= 360
        if (delta < -180) delta += 360

        prevAngle = currentAngle

        freeTargets.value[pkgIdx][idx].r += delta
      }
    }
  })

  let startDistance = 0
let startScale = 1

card.querySelectorAll('.handle').forEach(handle => {
  interact(handle as HTMLElement).draggable({
    listeners: {
      start(event) {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = event.clientX - centerX
        const dy = event.clientY - centerY

        startDistance = Math.sqrt(dx * dx + dy * dy)
        startScale = freeTargets.value[pkgIdx][idx].s
      },
      move(event) {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = event.clientX - centerX
        const dy = event.clientY - centerY

        const currentDistance = Math.sqrt(dx * dx + dy * dy)
        const scaleFactor = currentDistance / startDistance

        freeTargets.value[pkgIdx][idx].s = Math.max(startScale * scaleFactor, 0.2)
      }
    }
  })
})

}


async function toggle(pkgIdx: number) {
    if(editMode.value){
        return
    }
    console.log("TOGGGGGLED")
    const swiper = innerSwipers.value[pkgIdx]
    // console.log(swiper)
    // console.log(outerSwiper)


    if (!swiper) return

    isFree.value[pkgIdx] = !isFree.value[pkgIdx]

    if (isFree.value[pkgIdx]) {
        swiper.slideTo(0, 200)
        swiper.autoplay.stop()

        if (swiper.animating) {
            await new Promise(resolve => swiper.once('transitionEnd', resolve))
            await nextTick()
        }

        if (wrapper.value) {
            const { clientWidth, clientHeight } = wrapper.value
            console.log(clientWidth, clientHeight

            )
            const centerX = clientWidth / 2
            const centerY = clientHeight / 3

            const activeSlide = wrapper.value.querySelectorAll('.swiper-slide-active:not(.product-card)')[0]
            const innerCards = activeSlide?.querySelectorAll('.product-card')

            if (!innerCards) return

            const numCards = packages[pkgIdx].length
            const usedAngles: number[] = []

            function getRandomAngle() {
                let angle
                let tries = 0
                do {
                    angle = Math.random() * 180 
                    // Check that it's not too close to any existing angle
                    const tooClose = usedAngles.some(a => Math.abs(a - angle) < 30 || Math.abs(a - angle) > 330)
                    if (!tooClose) break
                    tries++
                } while (tries < 100)
                console.log(angle)

                usedAngles.push(angle)
                return angle
            }

            freeTargets.value[pkgIdx] = packages[pkgIdx].map((_, idx) => {
                const cardEl = innerCards[idx] as HTMLElement
                if (!cardEl) return { x: 0, y: 0, r: 0 }

                // Get the card center
                const cardRect = cardEl.getBoundingClientRect()
                const cardCenterX = cardRect.left + cardRect.width / 2
                const cardCenterY = cardRect.top + cardRect.height / 2

                // Offset to center
                const offsetX = centerX - cardCenterX
                const offsetY = centerY - cardCenterY

                // Pick a clean angle
                const angleDeg = getRandomAngle()
                const angleRad = (angleDeg * Math.PI) / 180

                // Fixed radius = 100px
                
                const scatterX = Math.cos(angleRad) * clientWidth/3 + 50
                const scatterY = Math.sin(angleRad) * clientHeight/3+100

                const finalX = offsetX + scatterX
                const finalY = offsetY + scatterY+100

                const randomRotation = (Math.random() - 0.5) * 60

                return {
                    x: finalX,
                    y: finalY,
                    r: randomRotation,
                    s: 1.5,
                    z: 1
                }
            })
        }
        swiper.allowTouchMove = false


    } else {
        swiper.allowTouchMove = true

        swiper.autoplay.start()


        freeTargets.value[pkgIdx] = packages[pkgIdx].map(() => ({
            x: 0,
            y: 0,
            r: 0,
            s: 1, 
            z: 1
        }))
    }
}

// Toggle between modes
async function toggleRelative(pkgIdx: number) {
    const swiper = innerSwipers.value[pkgIdx]
    if (!swiper) return

    isFree.value[pkgIdx] = !isFree.value[pkgIdx]

    if (isFree.value[pkgIdx]) {
        swiper.slideTo(0, 200)
        swiper.autoplay.stop()

        if (swiper.animating) {
            await new Promise(resolve => swiper.once('transitionEnd', resolve))
            await nextTick()
        }

        // Scatter around center, 100px radius
        freeTargets.value[pkgIdx] = packages[pkgIdx].map(() => {
            const angle = Math.random() * Math.PI * 2
            return {
                x: Math.cos(angle) * 10,
                y: Math.sin(angle) * 10,
                r: (Math.random() - 0.5) * 60,
                z: 1
            }
        })

    } else {
        swiper.autoplay.start()
        freeTargets.value[pkgIdx] = packages[pkgIdx].map(() => ({ x: 0, y: 0, r: 0 }))
    }
}

// Start dragging
function startDrag(e: PointerEvent, pkgIdx: number, idx: number) {
    if (!isFree.value[pkgIdx]) return
    e.preventDefault()
    dragging.value = {
        pkgIdx,
        idx,
        startX: e.clientX,
        startY: e.clientY,
        origX: freeTargets.value[pkgIdx][idx].x,
        origY: freeTargets.value[pkgIdx][idx].y,
    }
    window.addEventListener('pointermove', onDrag)
    window.addEventListener('pointerup', endDrag)
}

// During dragging
function onDrag(e: PointerEvent) {
    const d = dragging.value
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    freeTargets.value[d.pkgIdx][d.idx].x = d.origX + dx
    freeTargets.value[d.pkgIdx][d.idx].y = d.origY + dy
}

// End dragging
function endDrag() {
    window.removeEventListener('pointermove', onDrag)
    window.removeEventListener('pointerup', endDrag)
    dragging.value = null
}

function onSlideChange(swiper: SwiperCore) {
  // Update activeSlideRef when the slide changes
  activeSlideRef.value = swiper.slides[swiper.activeIndex] as SwiperSlide

  activeSlideIndex.value = swiper.activeIndex
  console.log('Updated activeSlideIndex:', activeSlideIndex.value)
  console.log('Updated activeSlideRef:', activeSlideRef.value)
  activeItemRef.value = packages[activeSlideIndex.value][0]
  selectedBgColor.value = activeItemRef.value.bgColor

}

// Card styles
function cardStyle(pkgIdx: number, idx: number) {
  const { x, y, r, s, z } = isFree.value[pkgIdx]
    ? freeTargets.value[pkgIdx][idx]
    : { x: 0, y: 0, r: 0, s: 1, z: 1 }

  return {
    transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`,
    transition: 'transform 0.3s ease-out',
    zIndex: z
  }
}

// Export positions
function exportPositions() {
    const data = JSON.stringify(freeTargets.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'positions.json'
    a.click()
    URL.revokeObjectURL(url)
}

// Import positions
function importPositions(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        try {
            const json = JSON.parse(reader.result as string)
            if (
                Array.isArray(json) &&
                json.length === packages.length &&
                json.every((arr: any, i: number) =>
                    Array.isArray(arr) &&
                    arr.length === packages[i].length
                )
            ) {
                freeTargets.value = json
            } else {
                throw new Error('Invalid format')
            }
        } catch {
            alert('Failed to load positions.json')
        }
    }
    reader.readAsText(file)
}


// Computed property for dynamic background color of outer swiper
const outerSwiperSlideStyle = (pkgIdx) => {
  console.log(selectedBgColor.value);
  console.log(pkgIdx);
  return {
    backgroundColor: packages[pkgIdx][0].bgColor || 'transparent',
  };
};


definePageMeta({
  name: 'd',
  layout: 'd',
})
</script>

<style scoped>
.swiper {
    width: 100%;
    height: 500px;
}

.swiper .swiper-wrapper {
    align-items: center;
}


.handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid black;
  border-radius: 50%;
  z-index: 10;
}

.top-left {
  top: -6px;
  left: -6px;
  cursor: nwse-resize !important;
}

.top-right {
  top: -6px;
  right: -6px;
  cursor: nesw-resize !important;
}

.bottom-left {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize !important;
}

.bottom-right {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize !important;
}

/* New rotation handle */
.rotate-handle {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  background: red;
  border-radius: 50%;
  border: 2px solid black;
  cursor: grab;
  z-index: 20;
}

.center-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: green;
  border-radius: 50%;
  z-index: 20;
}

.handle, .rotate-handle {
  transition: transform 0.2s ease, background 0.2s ease;
}

.handle:active, .rotate-handle:active {
  transform: scale(1.5);
  background: limegreen;
}

.z-up, .z-down {
  position: absolute;
  right: 50px;
  /* background: #ffffff; */
  /* border: 1px solid #333; */
  /* border-radius: 50%; */
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  z-index: 30;
}

.z-up {
  top: 40px;
}

.z-down {
  top: 110px;
}

</style>



