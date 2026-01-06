<script setup lang="ts">
import { ref } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import { useClickOutside } from "../composables/useClickOutside";

const isOpen = ref(false);
const note = useLocalStorage("note", "");
const containerRef = ref<HTMLElement | null>(null);

useClickOutside(containerRef, () => {
  isOpen.value = false;
});
</script>

<template>
  <div class="relative" ref="containerRef">
    <!-- Toggle Button -->
    <button
      class="relative w-10 h-10 rounded-full bg-black/30 backdrop-blur-lg border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/50 hover:scale-105"
      @click="isOpen = !isOpen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>

    <!-- Notes Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 w-80 h-96 bg-black/60 backdrop-blur-xl rounded-2xl p-5"
      >
        <h3 class="text-lg font-semibold text-white mb-4 font-inter">Notes</h3>

        <textarea
          v-model="note"
          class="w-full h-full resize-none bg-transparent border-none text-white text-sm font-inter placeholder:text-white/50 focus:outline-none"
          placeholder="Jot down some thoughts..."
          spellcheck="false"
        ></textarea>
      </div>
    </Transition>
  </div>
</template>
