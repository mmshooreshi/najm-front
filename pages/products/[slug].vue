<template>
  <div class="mt-28 px-4 rtl lg:px-20">
    <section v-if="pending" class="text-center py-8">
      در حال بارگذاری...
    </section>
    <section v-else-if="error" class="text-red-600 text-center py-8">
      خطا: {{ error.message }}
    </section>

    <section v-else-if="product" class="max-w-4xl mx-auto gap-0">
      <!-- Header -->
      <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
      <div class="text-sm text-gray-500 mb-4">
        شناسه: {{ product.id }} | اسلاگ: {{ product.slug }}
      </div>

      <!-- Categories & Tags -->
      <div class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="cat in product.categories || []"
          :key="cat"
          class="px-2 py-1 bg-blue-100 text-blue-800 rounded"
        >
          دسته‌بندی #{{ cat }}
        </span>
        <span
          v-for="tag in product.tags || []"
          :key="tag"
          class="px-2 py-1 bg-green-100 text-green-800 rounded"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Price & Inventory -->
      <div class="flex items-center mb-6 space-x-4">
        <div class="text-2xl font-semibold text-green-700">
          {{ product.price }} {{ product.currency }}
        </div>
        <div class="text-gray-600">
          حداقل سفارش: {{ product.inventory?.minOrderQty }} |
          موجودی: {{ product.inventory?.stockQuantity }}
        </div>
      </div>

      <!-- Media Carousel -->
      <div v-if="gallery" class="mb-6">
        <h2 class="text-xl font-semibold mb-2">گالری تصاویر</h2>
        <div class="flex overflow-x-auto gap-4 py-2">
          <div
            v-for="imgUrl in gallery.content.images"
            :key="imgUrl"
            class="flex-shrink-0 w-64 h-40 bg-gray-100 rounded overflow-hidden"
          >
            <img :src="imgUrl" alt="" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Full Description -->
      <div class="prose mb-6" v-html="product.description"></div>

      <!-- Variants Table -->
      <div v-if="product.variants?.length" class="mb-6">
        <h2 class="text-xl font-semibold mb-2">ورژن‌ها (Variants)</h2>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="border px-2 py-1">SKU</th>
              <th class="border px-2 py-1">قیمت</th>
              <th class="border px-2 py-1">موجودی</th>
              <th class="border px-2 py-1">ویژگی‌ها</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in product.variants" :key="v.sku">
              <td class="border px-2 py-1">{{ v.sku }}</td>
              <td class="border px-2 py-1">{{ v.price }}</td>
              <td class="border px-2 py-1">
                {{ v.inventory?.stockQuantity }}
                ({{ v.inventory?.inStock ? '✔' : '✖' }})
              </td>
              <td class="border px-2 py-1">
                <div v-for="attr in v.attributes" :key="attr.name">
                  <strong>{{ attr.name }}:</strong> {{ attr.value }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Other Sections -->
      <div
        v-for="section in otherSections"
        :key="section.title"
        class="mb-2"
      >
        <h2 v-if="section.type != 'options'" class="text-2xl font-semibold mb-2">{{ section.title }}</h2>

        <!-- Specs -->
        <dl
          v-if="section.type === 'specs'"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div
            v-for="field in section.content.fields"
            :key="field.label"
            class="border p-4 rounded"
          >
            <dt class="font-medium">{{ field.label }}</dt>
            <dd class="mt-1">{{ field.value }} {{ field.unit }}</dd>
            <div v-if="field.media?.length" class="flex gap-2 mt-2">
              <img
                v-for="m in field.media"
                :key="m.url"
                :src="m.url"
                :alt="m.alt"
                class="w-16 h-16 object-cover rounded"
              />
            </div>
          </div>
        </dl>

        <!-- Options via Accordion -->
        <div v-else-if="section.type === 'options'">
          <Accordion
            :title="section.title"
            :groups="section.content.groups"
          />
        </div>

        <!-- Rich Text -->
        <div
          v-else-if="section.type === 'richText'"
          class="prose max-w-none"
          v-html="section.content.html"
        ></div>
      </div>

      <!-- Metadata -->
      <div class="text-sm text-gray-400">
        ایجاد شده: {{ product.created }} | بروزرسانی: {{ product.updated }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductUI } from '@/composables/ui/productUI'
import Accordion from '@/components/atom/ProductAccord.vue'
import { computed } from 'vue'

const route = useRoute()
const slug = route.params.slug as string
const { product, pending, error } = useProductUI(slug)

const gallery = computed(() => product.value?.sections?.find(s => s.type === 'gallery'))
const otherSections = computed(
  () => product.value?.sections?.filter(s => s.type !== 'gallery') || []
)
</script>

<style scoped>
.prose ul { margin: 0; }
</style>
