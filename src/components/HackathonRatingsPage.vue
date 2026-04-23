<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <router-link :to="`/organizers/dashboard`" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Назад к дашборду
        </router-link>
        <h1>Оценка решений</h1>
        <p v-if="hackathon" class="subtitle">{{ hackathon.title }}</p>
      </div>

      <SubmissionRatingPanel
        v-if="hackathonId"
        :hackathon-id="hackathonId"
        :can-rate="canRate"
        @rating-updated="onRatingUpdated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SubmissionRatingPanel from './SubmissionRatingPanel.vue'
import { hackathonApi, type Hackathon } from '@/services/api'

const route = useRoute()
const hackathonId = ref<string>('')
const hackathon = ref<Hackathon | null>(null)

const canRate = computed(() => {
  if (!hackathon.value) return false
  return new Date(hackathon.value.event_end) < new Date()
})

onMounted(async () => {
  hackathonId.value = route.params.id as string

  // Load hackathon info
  const res = await hackathonApi.getById(hackathonId.value)
  if (res.data) {
    hackathon.value = res.data
  }
})

function onRatingUpdated() {
  // Could show a success message here
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-color);
  padding: 7rem 2rem 2rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary-color);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
</style>
