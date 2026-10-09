<template>
  <section class="container py-4 weather-page">
    <h1 class="text-center">WEATHER APP</h1>
    <form class="d-flex flex-wrap gap-2 mt-4" @submit.prevent="searchByCity">
      <label for="city" class="visually-hidden">City</label>
      <input id="city" v-model="city" type="text" placeholder="Enter city name" class="form-control city-input" autocomplete="off" />
      <button type="submit" class="btn btn-primary">Search</button>
      <button type="button" class="btn btn-outline-secondary" :disabled="locating" @click="fetchCurrentLocationWeather">Use My Location</button>
    </form>
    <p v-if="locating" class="mt-3" role="status">Waiting for location permission...</p>
    <p v-if="loading" class="mt-3" role="status">Loading weather...</p>
    <p v-if="error" class="text-danger mt-3" role="alert">{{ error }}</p>
    <div v-if="weatherData" class="text-center border rounded p-4 mt-4" aria-live="polite">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <img :src="iconUrl" :alt="weatherData.weather[0].description" width="100" height="100" />
      <p class="display-6">{{ temperature }} °C</p>
      <p class="mb-0 text-capitalize">{{ weatherData.weather[0].description }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

const apikey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const city = ref('')
const weatherData = ref(null)
const error = ref('')
const loading = ref(false)
const locating = ref(false)
let latestRequest = 0
let controller = null

const temperature = computed(() => weatherData.value ? weatherData.value.main.temp.toFixed(2) : null)
const iconUrl = computed(() => weatherData.value
  ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png`
  : null)

const beginRequest = () => {
  controller?.abort()
  controller = null
  latestRequest += 1
  weatherData.value = null
  error.value = ''
  loading.value = false
  locating.value = false
  return latestRequest
}

const fetchWeatherData = async (params, requestId) => {
  if (requestId !== latestRequest) return
  locating.value = false
  if (!apikey) {
    error.value = 'Set VITE_OPENWEATHER_API_KEY in .env.local and restart the app.'
    return
  }
  loading.value = true
  controller = new AbortController()
  try {
    const response = await axios.get(weatherUrl, {
      params: { ...params, appid: apikey, units: 'metric' },
      timeout: 15000,
      signal: controller.signal
    })
    if (requestId !== latestRequest) return
    const data = response.data
    if (!Number.isFinite(data?.main?.temp) || !data?.name || !data?.sys?.country || !data?.weather?.[0]?.icon) {
      throw new Error('Invalid weather response')
    }
    weatherData.value = data
  } catch (err) {
    if (requestId !== latestRequest || axios.isCancel(err)) return
    weatherData.value = null
    const status = err.response?.status
    if (status === 401) error.value = 'The API key is invalid, inactive, or not authorised for current weather.'
    else if (status === 404) error.value = 'City not found. Try a city and country code, such as Melbourne,AU.'
    else if (status === 429) error.value = 'The weather API request limit has been reached. Please try again later.'
    else error.value = 'Unable to load weather. Check your internet connection and try again.'
  } finally {
    if (requestId === latestRequest) loading.value = false
  }
}

const searchByCity = async () => {
  const requestId = beginRequest()
  const query = city.value.trim()
  if (!query) {
    error.value = 'Please enter a city name.'
    return
  }
  await fetchWeatherData({ q: query }, requestId)
}

const fetchCurrentLocationWeather = () => {
  const requestId = beginRequest()
  if (!navigator.geolocation) {
    error.value = 'Location is not supported by this browser. Search by city instead.'
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      if (requestId !== latestRequest) return
      const { latitude, longitude } = position.coords
      await fetchWeatherData({ lat: latitude, lon: longitude }, requestId)
    },
    (err) => {
      if (requestId !== latestRequest) return
      locating.value = false
      error.value = err.code === 1
        ? 'Location access was denied. Search by city instead.'
        : 'Unable to determine your location. Search by city instead.'
    },
    { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
  )
}

onMounted(fetchCurrentLocationWeather)
onBeforeUnmount(() => {
  latestRequest += 1
  controller?.abort()
})
</script>

<style scoped>
.weather-page { max-width: 760px; }
.city-input { flex: 1 1 220px; min-width: 0; }
</style>
