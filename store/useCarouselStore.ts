// store/useCarouselStore.ts
// stores/useCarouselStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCarouselStore = defineStore("carousel", () => {
    const currentStep = ref<number>(0);
    const steps = ref<number>(5); // Total steps in the carousel

    function nextStep(): void {
        currentStep.value = (currentStep.value + 1) % steps.value; // Loop back to 0
    }

    return { currentStep, steps, nextStep };
});
