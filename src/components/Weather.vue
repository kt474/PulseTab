<script setup lang="ts">
import { ref, onMounted } from "vue";

interface WeatherData {
  temp: string;
  feelsLike: string;
  humidity: string;
  condition: string;
  icon: string;
  location: string;
  query: string;
}

const weather = ref<WeatherData | null>(null);
const loading = ref(true);
const error = ref(false);

const weatherIcons: Record<string, string> = {
  Clear: "☀️",
  Sunny: "☀️",
  "Partly cloudy": "⛅",
  Cloudy: "☁️",
  Overcast: "☁️",
  Mist: "🌫️",
  Fog: "🌫️",
  Rain: "🌧️",
  "Light rain": "🌦️",
  "Heavy rain": "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  "Light snow": "🌨️",
  Sleet: "🌨️",
};

function isEvening(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

function getWeatherIcon(condition: string): string {
  const evening = isEvening();
  const lowerCondition = condition.toLowerCase();

  // Show moon for clear weather at night
  if (
    evening &&
    (lowerCondition.includes("clear") || lowerCondition.includes("sunny"))
  ) {
    return "🌙";
  }

  for (const [key, icon] of Object.entries(weatherIcons)) {
    if (lowerCondition.includes(key.toLowerCase())) {
      return icon;
    }
  }
  return evening ? "🌙" : "🌤️";
}

async function fetchWeather() {
  try {
    // Check cache first
    const cached = localStorage.getItem("weather-cache-v3");
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache valid for 30 minutes
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        weather.value = data;
        loading.value = false;
        return;
      }
    }

    // Get user's location using browser geolocation
    let locationQuery = "";
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 30 * 60 * 1000, // Use cached position if less than 30 min old
          });
        }
      );
      locationQuery = `${position.coords.latitude},${position.coords.longitude}`;
    } catch (geoError) {
      // Fall back to IP-based location if geolocation fails
      console.log("Geolocation unavailable, using IP-based location");
    }

    // Use wttr.in for free weather (no API key needed)
    const response = await fetch(`https://wttr.in/${locationQuery}?format=j1`);
    const data = await response.json();

    const current = data.current_condition[0];
    const location = data.nearest_area[0];

    // reliably get coordinates from the response regardless of source
    const lat = location.latitude;
    const lon = location.longitude;

    weather.value = {
      temp: current.temp_F,
      feelsLike: current.FeelsLikeF,
      humidity: current.humidity,
      condition: current.weatherDesc[0].value,
      icon: "", // Keep for interface compatibility, but we use the function in template
      location: location.areaName[0].value,
      query: `${lat},${lon}`, // Use coordinates for weather.com
    };

    // Cache the result
    localStorage.setItem(
      "weather-cache-v3",
      JSON.stringify({
        data: weather.value,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchWeather();
});
</script>

<template>
  <component
    :is="weather ? 'a' : 'div'"
    :href="
      weather
        ? `https://weather.com/weather/today/l/${weather.query}`
        : undefined
    "
    :target="weather ? '_blank' : undefined"
    class="group flex items-center gap-3 px-4 py-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-inter"
    :class="{
      'hover:bg-black/50 hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-105':
        weather,
    }"
  >
    <template v-if="loading">
      <div class="flex items-center gap-2">
        <div
          class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"
        ></div>
        <span class="text-xs font-medium opacity-70">Loading...</span>
      </div>
    </template>
    <template v-else-if="error">
      <span class="text-sm opacity-70">Weather unavailable</span>
    </template>
    <template v-else-if="weather">
      <span
        class="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
        >{{ getWeatherIcon(weather.condition) }}</span
      >
      <div class="flex flex-col">
        <span class="text-xl font-bold leading-none">{{ weather.temp }}°</span>
        <span
          class="text-[10px] font-medium opacity-60 uppercase tracking-tight mt-1"
          >{{ weather.condition }}</span
        >
      </div>

      <!-- Detailed info on hover -->
      <div
        class="flex items-center gap-4 overflow-hidden w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-in-out border-l border-white/20 ml-2 pl-4"
      >
        <div class="flex flex-col">
          <span class="text-[10px] opacity-60 uppercase">Feels</span>
          <span class="text-xs font-semibold">{{ weather.feelsLike }}°</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] opacity-60 uppercase">Humidity</span>
          <span class="text-xs font-semibold">{{ weather.humidity }}%</span>
        </div>
      </div>
    </template>
  </component>
</template>
