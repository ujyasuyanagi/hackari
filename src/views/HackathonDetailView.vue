<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HackathonDetail from '@/components/HackathonDetail.vue'
import FooterPage from '@/components/FooterPage.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  id: string
}>()

const lenis = ref<Lenis | null>(null)

const handleLenisRaf = (time: number) => {
  lenis.value?.raf(time * 1000)
}

onMounted(() => {
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
  <div class="hackathon-detail-view">
    <main>
      <HackathonDetail :hackathonId="id" />
    </main>
    <FooterPage />
  </div>
</template>

<style scoped lang="scss">
.hackathon-detail-view {
  position: relative;
  background-color: var(--color-bg, #0a0a0a);
  min-height: 100vh;
}

main {
  padding-top: 0;
}
</style>
