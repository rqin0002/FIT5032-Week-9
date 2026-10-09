import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { initializeApp } from "firebase/app";

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
const firebaseConfig = {
  apiKey: "AIzaSyB02b9MveXGa_3m4E2VgJKGF76bz4gN0dI",
  authDomain: "fit5032-7b50f.firebaseapp.com",
  projectId: "fit5032-7b50f",
  storageBucket: "fit5032-7b50f.firebasestorage.app",
  messagingSenderId: "308362338146",
  appId: "1:308362338146:web:e52f8593e4ab0ae76cd63b"
};
initializeApp(firebaseConfig);