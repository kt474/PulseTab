<script setup lang="ts">
import { ref, onMounted } from "vue";

interface WeatherData {
  temp: string;
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

function getWeatherIcon(condition: string): string {
  for (const [key, icon] of Object.entries(weatherIcons)) {
    if (condition.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return "🌤️";
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
      condition: current.weatherDesc[0].value,
      icon: getWeatherIcon(current.weatherDesc[0].value),
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
    class="flex items-center gap-2 px-4 py-3 bg-black/30 backdrop-blur-lg rounded-2xl text-white font-inter"
    :class="{ 'hover:bg-black/40 transition-colors cursor-pointer': weather }"
  >
    <template v-if="loading">
      <span class="text-sm opacity-70">Loading...</span>
    </template>
    <template v-else-if="error">
      <span class="text-sm opacity-70">⚠️</span>
    </template>
    <template v-else-if="weather">
      <span class="text-2xl">{{ weather.icon }}</span>
      <span class="text-xl font-semibold">{{ weather.temp }}°F</span>
      <span class="text-sm opacity-80">{{ weather.location }}</span>
    </template>
  </component>
</template>
