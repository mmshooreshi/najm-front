import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    selectedCategory: 'صنعت،تکنولوژی و اکوسیستم'
  }),
  actions: {
    setCategory(category: string) {
      this.selectedCategory = category;
    }
  }
});
