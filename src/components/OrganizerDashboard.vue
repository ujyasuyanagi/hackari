<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="dashboard-header" ref="header">
        <div class="header-content">
          <div class="header-title">
            <h1>Дашборд организатора</h1>
            <p class="header-subtitle">Управляйте вашими хакатонами</p>
          </div>
          <div class="header-actions">
            <router-link to="/organizers/profile" class="btn btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Редактировать профиль
            </router-link>
            <router-link to="/hackathons/create" class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Создать хакатон
            </router-link>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="stats-cards" ref="stats">
          <div class="stat-card">
            <div class="stat-icon published">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ hackathons.length }}</span>
              <span class="stat-label">Всего хакатонов</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon draft">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ upcomingCount }}</span>
              <span class="stat-label">Предстоящих</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon participants">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ totalParticipants }}</span>
              <span class="stat-label">Всего участников</span>
            </div>
          </div>
        </div>

        <div class="content-section" ref="content">
          <div class="section-header">
            <h2>Мои хакатоны</h2>
          </div>

          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <span>Загрузка...</span>
          </div>

          <div v-else-if="hackathons.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3>У вас пока нет хакатонов</h3>
            <p>Создайте свой первый хакатон и начните принимать заявки от участников</p>
            <router-link to="/hackathons/create" class="btn btn-primary">
              Создать хакатон
            </router-link>
          </div>

          <div v-else class="hackathons-list">
            <div
              v-for="hackathon in hackathons"
              :key="hackathon.id"
              class="hackathon-card"
            >
              <div class="hackathon-image">
                <img
                  v-if="hackathon.banner_url"
                  :src="hackathon.banner_url"
                  :alt="hackathon.title"
                />
                <div v-else class="hackathon-placeholder">H</div>
                <span
                  class="hackathon-status"
                  :class="hackathon.is_published ? 'published' : 'draft'"
                >
                  {{ hackathon.is_published ? 'Опубликован' : 'Черновик' }}
                </span>
              </div>
              <div class="hackathon-content">
                <h3 class="hackathon-title">{{ hackathon.title }}</h3>
                <div class="hackathon-meta">
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ formatDate(hackathon.event_start) }} - {{ formatDate(hackathon.event_end) }}
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    {{ hackathon.participant_count }} участников
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {{ hackathon.team_count }} команд
                  </span>
                </div>
              </div>
              <div class="hackathon-actions">
                <router-link
                  :to="`/hackathons/${hackathon.id}`"
                  class="btn btn-icon"
                  title="Посмотреть"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'
import { organizerApi, hackathonApi } from '@/services/api'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const header = ref<HTMLElement | null>(null)
const stats = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

const hackathons = ref<{
  id: string
  title: string
  banner_url?: string
  is_published: boolean
  event_start: string
  event_end: string
  participant_count: number
  team_count: number
}[]>([])
const isLoading = ref(true)

const upcomingCount = computed(() => {
  const now = new Date()
  return hackathons.value.filter(h => new Date(h.event_start) > now).length
})

const totalParticipants = computed(() => {
  return hackathons.value.reduce((sum, h) => sum + (h.participant_count || 0), 0)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

onMounted(async () => {
  gsap.fromTo(header.value,
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
  )

  gsap.fromTo(stats.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' }
  )

  gsap.fromTo(content.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' }
  )

  // Load organizer's hackathons
  isLoading.value = true
  const response = await hackathonApi.list()
  if (response.data) {
    // Filter only hackathons from this organizer
    // For now, show all hackathons
    hackathons.value = response.data.hackathons
  }
  isLoading.value = false
})
</script>

<style scoped lang="scss">
@use '../styles/variables' as *;

.dashboard-page {
  min-height: 100vh;
  background: $color-bg;
  padding: 7rem 2rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid $color-surface;

  .header-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .header-title {
    h1 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-family: $font-display;
      color: $color-text;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      color: $color-text-dim;
      font-size: 1rem;
      font-family: $font-body;
    }
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      width: 100%;
      justify-content: flex-start;
    }
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s $transition-smooth;
  cursor: pointer;
  border: 1px solid $color-border;
  text-decoration: none;
  text-transform: lowercase;
  font-family: $font-body;
  position: relative;
  overflow: hidden;

  &.btn-primary {
    background: transparent;
    color: $color-accent;
    border-color: $color-accent;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: $color-accent;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s $transition-smooth;
      z-index: -1;
    }

    &:hover {
      color: $color-bg;

      &::before {
        transform: scaleX(1);
      }
    }
  }

  &.btn-outline {
    background: transparent;
    color: $color-text;
    border-color: $color-border;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: $color-surface;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s $transition-smooth;
      z-index: -1;
    }

    &:hover {
      border-color: $color-text;

      &::before {
        transform: scaleX(1);
      }
    }
  }

  &.btn-icon {
    padding: 0.5rem;
    background: transparent;
    border-color: $color-border;
    color: $color-text-dim;

    &:hover {
      border-color: $color-accent;
      color: $color-accent;
    }
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  transition: border-color 0.3s $transition-smooth;

  &:hover {
    border-color: $color-accent;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.published {
      background: rgba($color-accent, 0.1);
      color: $color-accent;
    }

    &.draft {
      background: rgba($color-secondary, 0.1);
      color: $color-secondary;
    }

    &.participants {
      background: rgba($color-text-dim, 0.1);
      color: $color-text-dim;
    }
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: $color-text;
    font-family: $font-display;
  }

  .stat-label {
    font-size: 0.875rem;
    color: $color-text-dim;
    font-family: $font-body;
  }
}

.content-section {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 1.5rem;

  .section-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid $color-border;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: $color-text;
      font-family: $font-display;
    }
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: $color-text-dim;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 2px solid $color-border;
    border-top-color: $color-accent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;

  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-muted;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text;
    margin-bottom: 0.5rem;
    font-family: $font-display;
  }

  p {
    color: $color-text-dim;
    margin-bottom: 1.5rem;
    max-width: 400px;
    font-family: $font-body;
  }
}

.hackathons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hackathon-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba($color-accent, 0.02);
  border: 1px solid $color-border;
  border-radius: 8px;
  transition: all 0.3s $transition-smooth;

  &:hover {
    border-color: $color-accent;
    background: rgba($color-accent, 0.04);
  }
}

.hackathon-image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hackathon-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg;
    border: 1px solid $color-border;
    color: $color-text;
    font-size: 1.5rem;
    font-weight: 700;
    font-family: $font-display;
  }
}

.hackathon-status {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: $font-mono;

  &.published {
    background: rgba($color-accent, 0.9);
    color: $color-bg;
  }

  &.draft {
    background: rgba($color-secondary, 0.9);
    color: white;
  }
}

.hackathon-content {
  flex: 1;
  min-width: 0;
}

.hackathon-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: $font-display;
}

.hackathon-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: $font-body;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: $color-text-dim;

    svg {
      color: $color-accent;
    }
  }
}

.hackathon-actions {
  display: flex;
  align-items: center;
}
</style>
