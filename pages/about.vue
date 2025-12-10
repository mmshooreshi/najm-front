<script setup>
import { ref, onMounted, computed } from 'vue'
import SolutionsSection from '~/components/about/SolutionsSectionGPinned.vue'
import { scrollDirection } from '~/composables/useScrollStore'

const sections = [
  { id: 'vision', label: 'چشم‌انداز و اهداف ما' },
  { id: 'story', label: 'داستان ما' },
  { id: 'values', label: 'ارزش‌ها' },
  { id: 'solutions', label: 'راهکارها و ویژگی‌ها' },
  { id: 'facility', label: 'مجموعه و تجهیزات ‌ما' },
  { id: 'aboutus', label: 'درباره ما' }
]

const activeSection = ref('')

// Determine subnav position based on scroll
const subnavAtTop = computed(() => scrollDirection.value === 'down')

// Smooth scroll-spy highlight
// --- SAFEST IMPLEMENTATION ---
onMounted(() => {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                // The element is "active" if it crosses the margin boundary
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id;
                }
            });
        },
        // Root Margin: Defines a single 1px "line" near the top center of the viewport.
        // -100px 0px -90% 0px: Creates a trigger area only at the top 10% of the screen.
        { rootMargin: '-10% 0px -89% 0px' } 
    );

    sections.forEach(s => {
        const el = document.getElementById(s.id)
        if (el) observer.observe(el)
    })
    activeSection.value = sections[0].id // Default to first section
});
</script>

<template>
  <!-- Sticky Sub Navigation -->
  <nav
    dir="rtl"
    class="fixed w-full overflow-auto px-2 z-40   backdrop-blur transition-all duration-400 navcont"
    :class="subnavAtTop
      ? 'top-0'     // header hidden → nav at top, larger
      : 'top-16'    // header visible → nav below header
    "
  >
    <ul class="flex gap-1.5 overflow-x-auto whitespace-nowrap mx-auto w-max py-2" > 
      <li class="group border border-1 border-najmbordergrey hover:border-transparent  hover:bg-najmgreen transition-all  cursor-pointer rounded-full" v-for="item in sections" :key="item.id" :class="[activeSection === item.id ? 'bg-najmgreen':'bg-transparent', subnavAtTop? 'text-[10px] py-3 px-4': 'text-[8px] px-3 py-2']" >
        <a
          :href="'#' + item.id"
          class="group-hover:text-white transition-colors"
          :class="activeSection === item.id ? 'text-white font-semibold' : 'text-gray-600'"
        >
          {{ item.label }}
       
        </a>
      </li>
    </ul>
  </nav>

  <!-- Sections -->
  <section id="vision" class="min-h-screen py-20 px-6 bg-gray-50">
    <h2>چشم‌انداز و اهداف ما</h2>
  </section>

  <section id="story" class="min-h-screen py-20 px-6">
    <h2>داستان ما</h2>
  </section>

  <section id="values" class="min-h-screen py-20 px-6 bg-gray-50">
    <h2>ارزش‌ها</h2>
  </section>

  <section id="solutions" class="min-h-screen py-0 px-0"  
>
    <!-- <h2>راهکارها و ویژگی‌ها</h2> -->
    <SolutionsSection class="transition-all duration-1000" :class="subnavAtTop
      ? 'top-0'     // header hidden → nav at top, larger
      : 'translate-y-12'    // header visible → nav below header
    "/>
  </section>

  <section id="facility" class="min-h-screen py-20 px-6 bg-gray-50">
    <h2>مجموعه و تجهیزات ‌ما</h2>
  </section>

  <section id="aboutus" class="min-h-screen py-20 px-6">
    <h2>درباره ما</h2>
  </section>
</template>


<style scoped>
.navcont {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox, Safari 18.2+, Chromium 121+ */
}
.navcont::-webkit-scrollbar { 
    display: none;  /* Older Safari and Chromium */
}
</style>