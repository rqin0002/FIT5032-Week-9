<template>
  <section class="container py-4 auth-page">
    <h1>Create an Account</h1>
    <form class="mt-4" @submit.prevent="register">
      <label for="register-email" class="form-label">Email</label>
      <input id="register-email" v-model.trim="email" type="email" autocomplete="email" class="form-control mb-3" required />
      <label for="register-password" class="form-label">Password</label>
      <input id="register-password" v-model="password" type="password" autocomplete="new-password" minlength="6" class="form-control mb-3" required />
      <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Creating account...' : 'Save to Firebase' }}</button>
    </form>
    <p v-if="error" class="text-danger mt-3" role="alert">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/init.js'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const register = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    await router.push('/addbook')
  } catch (err) {
    error.value = `Unable to create account (${err.code || 'connection error'}).`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { max-width: 560px; }
</style>
