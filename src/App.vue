<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()
const showHeader = computed(() => route.name !== 'CountBookAPI')
</script>

<template>
  <div class="main-container">
    <header v-if="showHeader">
      <BHeader />
    </header>
    <main class="main-box">
      <router-view />
    </main>
  </div>
</template>
