<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { format } from "date-fns";
import { useLocalStorage } from "../composables/useLocalStorage";
import { getDailyBackground } from "../data/backgrounds";
// import Weather from "./Weather.vue";
// import TodoList from "./TodoList.vue";

// Time
const currentTime = ref(new Date());
let timeInterval: number;

const time = computed(() => format(currentTime.value, "h:mm"));
const ampm = computed(() => format(currentTime.value, "a"));
const date = computed(() => format(currentTime.value, "EEEE, MMMM d"));

// Greeting based on time of day
const greeting = computed(() => {
  const hour = currentTime.value.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
});

// User name (persisted)
const userName = useLocalStorage("name", "");
const isEditingName = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);

function startEditingName() {
  isEditingName.value = true;
  setTimeout(() => nameInput.value?.focus(), 0);
}

function saveName() {
  isEditingName.value = false;
}

// Daily focus (persisted)
const focus = useLocalStorage("focus", "");
const focusDate = useLocalStorage("date", "");

// Reset focus if it's a new day
const today = format(new Date(), "yyyy-MM-dd");
if (focusDate.value !== today) {
  focus.value = "";
  focusDate.value = today;
}

// Background image
const backgroundUrl = ref(getDailyBackground());

onMounted(() => {
  timeInterval = window.setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<template>
  <div
    class="relative w-screen h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center font-inter"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <!-- Overlay for better text readability -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 pointer-events-none"
    ></div>

    <!-- Weather Widget - Top Left -->
    <!-- <div class="absolute top-6 left-6 z-10">
      <Weather />
    </div> -->

    <!-- Main Content - Center -->
    <div class="relative z-10 text-center text-white">
      <!-- Time Display -->
      <div class="flex items-baseline justify-center gap-2">
        <span
          class="text-[9.5rem] font-semibold leading-none drop-shadow-2xl"
          >{{ time }}</span
        >
        <span class="text-3xl font-semibold uppercase">{{ ampm }}</span>
      </div>

      <!-- Date -->
      <p class="text-2xl mb-8 drop-shadow-md font-medium">
        {{ date }}
      </p>

      <!-- Greeting -->
      <h2 class="text-4xl font-medium mb-8 drop-shadow-md">
        {{ greeting }}<template v-if="userName">, </template>
        <span
          v-if="!isEditingName && userName"
          class="cursor-pointer border-b-2 border-dashed border-white/40 hover:border-white/80 transition-colors"
          @click="startEditingName"
        >
          {{ userName }}.
        </span>
        <input
          v-if="isEditingName || !userName"
          ref="nameInput"
          v-model="userName"
          type="text"
          class="bg-transparent border-none border-b-2 border-solid border-white/60 text-white text-inherit font-inherit font-normal text-center outline-none min-w-[150px] placeholder:text-white/50 max-w-96"
          @focus="isEditingName = true"
          @blur="saveName"
          @keyup.enter="saveName"
        />
      </h2>
    </div>

    <!-- Todo List - Bottom Right -->
    <!-- <div class="absolute bottom-6 right-6 z-10">
      <TodoList />
    </div> -->
  </div>
</template>
