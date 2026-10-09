<template>
  <section class="container py-4">
    <h1>Book Counter</h1>
    <button
      type="button"
      class="btn btn-primary mt-3"
      :disabled="loading"
      @click="getBookCount"
    >Get Book Count</button>
    <p v-if="loading" class="mt-3" role="status">Loading book count...</p>
    <p v-if="count !== null" class="mt-3" role="status">Total number of books: {{ count }}</p>
    <p v-if="error" class="mt-3 text-danger" role="alert">{{ error }}</p>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref(null)
const loading = ref(false)

const countBooksUrl =
  import.meta.env.VITE_COUNT_BOOKS_URL?.trim() ||
  (import.meta.env.DEV
    ? 'http://127.0.0.1:5001/demo-fit5032-week9/us-central1/countBooks'
    : '')

const getBookCount = async () => {
  if (loading.value) return

  loading.value = true
  count.value = null
  error.value = null

  try {
    if (!countBooksUrl) {
      throw new Error('Missing countBooks URL')
    }

    const response = await axios.get(countBooksUrl, { timeout: 15000 })

    if (!Number.isSafeInteger(response.data?.count) || response.data.count < 0) {
      throw new Error('Invalid book count response')
    }

    count.value = response.data.count
  } catch {
    error.value = countBooksUrl
      ? 'Error fetching book count'
      : 'Set VITE_COUNT_BOOKS_URL to your deployed countBooks URL.'
  } finally {
    loading.value = false
  }
}
</script>
