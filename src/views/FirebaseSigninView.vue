<template>
  <section class="container py-4 auth-page">
    <h1>Sign in</h1>
    <form class="mt-4" @submit.prevent="signin">
      <label for="signin-email" class="form-label">Email</label>
      <input id="signin-email" v-model.trim="email" type="email" autocomplete="email" class="form-control mb-3" required />
      <label for="signin-password" class="form-label">Password</label>
      <input id="signin-password" v-model="password" type="password" autocomplete="current-password" class="form-control mb-3" required />
      <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign in via Firebase' }}</button>
    </form>
    <p v-if="error" class="text-danger mt-3" role="alert">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/init.js'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const signin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    await router.push('/addbook')
  } catch (err) {
    error.value = `Unable to sign in (${err.code || 'connection error'}). Check your email, password and connection.`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { max-width: 560px; }
</style>
