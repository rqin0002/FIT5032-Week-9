import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/about', name: 'About', component: () => import('../views/AboutView.vue') },
  { path: '/FireLogin', alias: '/login', name: 'FireLogin', component: () => import('../views/FirebaseSigninView.vue') },
  { path: '/FireRegister', name: 'FireRegister', component: () => import('../views/FirebaseRegisterView.vue') },
  { path: '/addbook', name: 'AddBook', component: () => import('../views/AddBookView.vue') },
  { path: '/GetBookCount', name: 'GetBookCount', component: () => import('../views/GetBookCountView.vue') },
  { path: '/WeatherCheck', alias: '/GetWeather', name: 'GetWeather', component: () => import('../views/WeatherView.vue') },
  { path: '/CountBookAPI', name: 'CountBookAPI', component: () => import('../views/CountBookAPI.vue') }
]

export default createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })
