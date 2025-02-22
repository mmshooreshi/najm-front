import { defineStore } from "pinia";

export const useButtonStore = defineStore("button", {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    startLoading() {
      this.isLoading = true;
      setTimeout(() => (this.isLoading = false), 2000); // Example timeout
    },
  },
});
