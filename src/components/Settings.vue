<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineProps<{
  showWeather: boolean;
  showTodo: boolean;
  showQuote: boolean;
  showFocusTimer: boolean;
  showQuickLinks: boolean;
}>();

const emit = defineEmits<{
  (e: "update:showWeather", value: boolean): void;
  (e: "update:showTodo", value: boolean): void;
  (e: "update:showQuote", value: boolean): void;
  (e: "update:showFocusTimer", value: boolean): void;
  (e: "update:showQuickLinks", value: boolean): void;
}>();

const isOpen = ref(false);
const settingsRef = ref<HTMLElement | null>(null);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu(event: MouseEvent) {
  if (settingsRef.value && !settingsRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<template>
  <div ref="settingsRef" class="relative">
    <!-- Menu Popover -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-14 left-0 w-56 bg-black/60 backdrop-blur-xl rounded-2xl p-4 shadow-2xl origin-bottom-left"
      >
        <h3
          class="text-white text-sm font-medium mb-3 opacity-60 uppercase tracking-wider"
        >
          Settings
        </h3>

        <div class="space-y-4">
          <!-- Weather Toggle -->
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-white text-sm font-medium">Weather</span>
            <div class="relative">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="showWeather"
                @change="
                  emit(
                    'update:showWeather',
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <div
                class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/80 transition-colors"
              ></div>
            </div>
          </label>

          <!-- Focus Timer Toggle -->
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-white text-sm font-medium">Focus Timer</span>
            <div class="relative">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="showFocusTimer"
                @change="
                  emit(
                    'update:showFocusTimer',
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <div
                class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/80 transition-colors"
              ></div>
            </div>
          </label>

          <!-- Quick Links Toggle -->
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-white text-sm font-medium">Quick Links</span>
            <div class="relative">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="showQuickLinks"
                @change="
                  emit(
                    'update:showQuickLinks',
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <div
                class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/80 transition-colors"
              ></div>
            </div>
          </label>

          <!-- Quote Toggle -->
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-white text-sm font-medium">Daily Quote</span>
            <div class="relative">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="showQuote"
                @change="
                  emit(
                    'update:showQuote',
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <div
                class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/80 transition-colors"
              ></div>
            </div>
          </label>

          <!-- Todo Toggle -->
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-white text-sm font-medium">To-Do List</span>
            <div class="relative">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="showTodo"
                @change="
                  emit(
                    'update:showTodo',
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <div
                class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/80 transition-colors"
              ></div>
            </div>
          </label>
        </div>
      </div>
    </transition>

    <!-- Settings Button -->
    <button
      @click.stop="toggleMenu"
      class="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-lg text-white transition-all cursor-pointer duration-200 hover:bg-black/50 hover:scale-105"
      :class="{ 'bg-black/40 text-white': isOpen }"
      aria-label="Settings"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 transition-transform duration-500"
        :class="{ 'rotate-90': isOpen }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  </div>
</template>
