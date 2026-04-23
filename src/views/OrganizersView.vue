<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OrganizersPage from '@/components/OrganizersPage.vue'
import FooterPage from '@/components/FooterPage.vue'

gsap.registerPlugin(ScrollTrigger)

const lenis = ref<Lenis | null>(null)

const handleLenisRaf = (time: number) => {
  lenis.value?.raf(time * 1000)
}

onMounted(() => {
  // Reset scroll position
  window.scrollTo(0, 0)

  lenis.value = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  })

  lenis.value.on('scroll', ScrollTrigger.update)

  gsap.ticker.add(handleLenisRaf)

  gsap.ticker.lagSmoothing(0)
})

onUnmounted(() => {
  gsap.ticker.remove(handleLenisRaf)
  lenis.value?.destroy()
  lenis.value = null
})
</script>

<template>
  <div class="organizers-view">
    <main>
      <OrganizersPage />
    </main>
    <FooterPage />
  </div>
</template>

<style scoped lang="scss">
.organizers-view {
  position: relative;
  background-color: $color-bg;
  min-height: 100vh;
}

main {
  padding-top: 0;
}
</style>

