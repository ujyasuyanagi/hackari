<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppHeader from '@/components/AppHeader.vue'
import OrganizerHeader from '@/components/OrganizerHeader.vue'
import AlertModal from '@/components/AlertModal.vue'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()

// No header on auth pages
const showAnyHeader = computed(() => {
  return !route.path.startsWith('/auth') &&
  route.path !== '/login' &&
  route.path !== '/register'
})

const isOrganizerRoute = computed(() => {
  // Organizer pages (except /organizers landing page) and hackathon creation
  return (route.path.startsWith('/organizers/') && route.path !== '/organizers') ||
  route.path.startsWith('/hackathons/create')
})

onMounted(() => {
  ScrollTrigger.refresh()
})
</script>

<template>
  <div class="app">
    <div class="grid-lines" />
    <!-- Show header only on non-auth pages -->
    <template v-if="showAnyHeader">
      <OrganizerHeader v-if="isOrganizerRoute" />
      <AppHeader v-else />
    </template>
    <router-view />
    <!-- Global Alert/Confirm Modal -->
    <AlertModal />
  </div>
</template>

<style>
.app {
  position: relative;
  background-color: var(--color-bg, #0a0a0a);
  min-height: 100vh;
}

.grid-lines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(212, 255, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 255, 0, 0.02) 1px, transparent 1px);
  background-size: 100px 100px;
  z-index: 0;
}
</style>
