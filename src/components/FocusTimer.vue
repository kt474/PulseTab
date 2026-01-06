<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";

// Constants
const WORK_TIME = 25 * 60;
const BREAK = 5 * 60;

// State
const isOpen = ref(false);
const timerState = ref<"idle" | "running" | "paused">("idle");
const timeLeft = ref(WORK_TIME);
const currentMode = ref<"work" | "break">("work");

let intervalId: number | null = null;

// Derived
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
});

// Update document title when timer is running
watch(timeLeft, (newValue) => {
  if (timerState.value === "running") {
    document.title = `${formattedTime.value} - Focus`;
  } else if (timerState.value === "idle" && newValue !== WORK_TIME) {
    document.title = "Browser Tab";
  }
});
// Reset title on unmount or idle
watch(timerState, (newState) => {
  if (newState === "idle") {
    document.title = "Browser Tab";
  }
});

function toggleTimer() {
  if (timerState.value === "running") {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  timerState.value = "running";
  intervalId = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      // Timer finished
      pauseTimer();
      timerState.value = "idle";
      // Auto-reset for next session? keeping it simple for now, maybe just stop at 0
      // Actually standard behavior is to stop.
    }
  }, 1000);
}

function pauseTimer() {
  timerState.value = "paused";
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetTimer() {
  pauseTimer();
  timerState.value = "idle";
  setMode(currentMode.value);
}

function setMode(mode: "work" | "break") {
  currentMode.value = mode;
  pauseTimer();
  timerState.value = "idle";
  switch (mode) {
    case "work":
      timeLeft.value = WORK_TIME;
      break;
    case "break":
      timeLeft.value = BREAK;
      break;
  }
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  document.title = "Browser Tab"; // Restore title
});
</script>

<template>
  <div class="relative font-inter">
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="relative w-10 h-10 rounded-full bg-black/30 backdrop-blur-lg border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/50 hover:scale-105"
    >
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 30 30"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 ml-0.5 transition-transform duration-500"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
          sketch:type="MSPage"
        >
          <g
            id="Icon-Set"
            sketch:type="MSLayerGroup"
            transform="translate(-519.000000, -360.000000)"
            fill="#fff"
          >
            <path
              d="M533,374.184 L533,369 C533,368.448 532.553,368 532,368 C531.447,368 531,368.448 531,369 L531,374.184 C529.838,374.597 529,375.695 529,377 C529,378.657 530.343,380 532,380 C533.657,380 535,378.657 535,377 C535,375.695 534.162,374.597 533,374.184 L533,374.184 Z M532,388 C525.925,388 521,383.075 521,377 C521,370.925 525.925,366 532,366 C538.075,366 543,370.925 543,377 C543,383.075 538.075,388 532,388 L532,388 Z M532.99,364.05 C532.991,364.032 533,364.018 533,364 L533,362 L537,362 C537.553,362 538,361.553 538,361 C538,360.447 537.553,360 537,360 L527,360 C526.447,360 526,360.447 526,361 C526,361.553 526.447,362 527,362 L531,362 L531,364 C531,364.018 531.009,364.032 531.01,364.05 C524.295,364.558 519,370.154 519,377 C519,384.18 524.82,390 532,390 C539.18,390 545,384.18 545,377 C545,370.154 539.705,364.558 532.99,364.05 L532.99,364.05 Z"
              id="timer"
              sketch:type="MSShapeGroup"
            ></path>
          </g>
        </g>
      </svg>
      <!-- Mini Timer Badge -->
      <span
        v-if="timerState === 'running' || timerState === 'paused'"
        class="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap"
      >
        {{ formattedTime }}
      </span>
    </button>

    <!-- Timer Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute top-16 right-0 w-72 bg-black/60 backdrop-blur-xl rounded-2xl p-4 shadow-2xl origin-top-right"
      >
        <!-- Mode Toggles -->
        <div
          class="flex justify-center gap-1.5 mb-6 bg-white/10 p-1 rounded-xl"
        >
          <button
            @click="setMode('work')"
            class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="
              currentMode === 'work'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            "
          >
            Work
          </button>
          <button
            @click="setMode('break')"
            class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="
              currentMode === 'break'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            "
          >
            Break
          </button>
        </div>

        <!-- Timer Display -->
        <div class="text-center mb-6 relative group">
          <!-- Circular Progress (Simple CSS for now, maybe SVG later if needed) -->
          <div
            class="text-6xl text-white font-bold tracking-wider drop-shadow-lg tabular-nums"
          >
            {{ formattedTime }}
          </div>
          <div
            class="text-sm text-white/50 mt-1 uppercase tracking-widest font-medium"
          >
            {{
              timerState === "running"
                ? "Focusing"
                : timerState === "paused"
                ? "Paused"
                : "Ready"
            }}
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-4">
          <button
            @click="toggleTimer"
            class="group w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg active:scale-95 cursor-pointer"
            :class="
              timerState === 'running'
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-white text-black hover:bg-white/90'
            "
          >
            <span v-if="timerState === 'running'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-else class="ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>

          <button
            @click="resetTimer"
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center cursor-pointer text-lg transition-all active:scale-95"
            title="Reset Timer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.919z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
