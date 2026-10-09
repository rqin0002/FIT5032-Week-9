<template>
  <nav class="container py-3" aria-label="Main navigation">
    <ul class="nav nav-pills justify-content-center gap-1">
      <li class="nav-item"><router-link to="/" class="nav-link" exact-active-class="active">Home</router-link></li>
      <li class="nav-item"><router-link to="/about" class="nav-link" active-class="active">About</router-link></li>
      <li class="nav-item"><router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link></li>
      <li class="nav-item"><router-link to="/GetBookCount" class="nav-link" active-class="active">Get Book Count</router-link></li>
      <li class="nav-item"><router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link></li>
      <li class="nav-item"><router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link></li>
      <li v-if="!isFirebaseUser" class="nav-item"><router-link to="/FireLogin" class="nav-link" active-class="active">Firebase Login</router-link></li>
      <li v-if="!isFirebaseUser" class="nav-item"><router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link></li>
      <li v-if="isFirebaseUser" class="nav-item"><button type="button" class="nav-link" @click="logout">Logout</button></li>
    </ul>
    <p v-if="error" class="text-danger mt-2" role="alert">{{ error }}</p>
  </nav>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/init.js'

const router = useRouter()
const isFirebaseUser = ref(false)
const error = ref('')
const unsubscribe = onAuthStateChanged(auth, (user) => {
  isFirebaseUser.value = Boolean(user)
})
onUnmounted(unsubscribe)

const logout = async () => {
  error.value = ''
  try {
    await signOut(auth)
    await router.push('/FireLogin')
  } catch {
    error.value = 'Unable to sign out. Please try again.'
  }
}
</script>
