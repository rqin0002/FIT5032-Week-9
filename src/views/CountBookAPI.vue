<template>
  <p v-if="loading" class="p-3" role="status">Loading book count...</p>
  <p v-if="error" class="p-3 text-danger" role="alert">{{ error }}</p>
  <pre v-if="jsondata !== null" class="p-3 m-0">{{ jsondata }}</pre>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/init.js'
import { countBooksUrl } from '../config.js'

const jsondata = ref(null)
const error = ref(null)
const loading = ref(false)

const getBookCountAPI = async () => {
  loading.value = true
  jsondata.value = null
  error.value = null
  try {
    let responseData
    if (countBooksUrl) {
      const response = await axios.get(countBooksUrl, { timeout: 15000 })
      responseData = response.data
    } else {
      const snapshot = await getCountFromServer(collection(db, 'books'))
      responseData = { count: snapshot.data().count }
    }

    if (!Number.isSafeInteger(responseData?.count) || responseData.count < 0) {
      throw new Error('Invalid book count response')
    }

    jsondata.value = JSON.stringify(responseData, null, 2)
  } catch {
    error.value = countBooksUrl
      ? 'Error fetching book count. Check the deployed countBooks function URL and its logs.'
      : 'Error fetching book count from Firestore. Check that efolio exists and its books rules permit reads.'
  } finally {
    loading.value = false
  }
}

onMounted(getBookCountAPI)
</script>
