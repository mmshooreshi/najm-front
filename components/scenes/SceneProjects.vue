<!-- components/scenes/SceneProjects.vue -->

 <!-- components/scenes/SceneProjects.vue  -->
 <template>
  <div  class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
    <SceneHeading :data="sceneProjects" :align="isRTL ? 'right' : 'left'"/>
    <!-- <ClientOnly> -->
    <!-- <EmblCards :cards="sceneProjects.cards"/> -->
    <EmblCards :cards="sceneProjects.cards" :stackIds="stackIds" />

    <!-- </ClientOnly> -->
    
  </div>
</template>

<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import EmblCards  from '@/components/cards/EmblCards.vue'
import { useLocale } from '@/composables/useLocale'

defineProps({
  stackIds: Array as PropType<number[]>
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')


const homeUI = inject<any>('homeUI') ?? {}
const sceneProjects = computed(() => homeUI?.value?.sceneProjects ?? {})

</script>

