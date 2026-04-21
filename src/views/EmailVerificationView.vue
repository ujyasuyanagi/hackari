<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/services/api'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token as string
  const userId = route.query.user_id as string

  if (!token) {
    errorMessage.value = 'Ссылка подтверждения недействительна или устарела'
    isLoading.value = false
    return
  }

  // Call the API to verify email
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/verify-email/${token}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      isSuccess.value = true
      // Redirect to auth page after 3 seconds
      setTimeout(() => {
        router.push('/auth')
      }, 3000)
    } else {
      const errorData = await response.json().catch(() => ({}))
      errorMessage.value = errorData.message || 'Ссылка подтверждения недействительна или устарела'
    }
  } catch {
    errorMessage.value = 'Ошибка подключения к серверу'
  } finally {
    isLoading.value = false
  }
})

const goToAuth = () => {
  router.push('/auth')
}
</script>

<template>
  <div class="verify-email-page">
    <div class="container">
      <div class="content-wrapper">
        <template v-if="isLoading">
          <div class="loading-state">
            <div class="spinner"></div>
            <p class="loading-text">Подтверждаем email...</p>
          </div>
        </template>

        <template v-else-if="isSuccess">
          <div class="icon success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 class="title">Email подтверждён!</h1>
          <p class="message">
            Ваш email успешно подтверждён. Теперь вы можете войти в аккаунт.
          </p>
          <p class="sub-message">Перенаправляем на страницу входа...</p>
          <button class="action-btn" @click="goToAuth">Войти</button>
        </template>

        <template v-else>
          <div class="icon error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1 class="title">Ошибка подтверждения</h1>
          <p class="message error">{{ errorMessage }}</p>
          <p class="sub-message">
            Ссылка могла устареть или быть использована ранее.
            Запросите новое письмо со страницы входа.
          </p>
          <button class="action-btn" @click="goToAuth">Перейти ко входу</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.verify-email-page {
  min-height: 100vh;
  background-color: $color-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
}

.container {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

.content-wrapper {
  background: rgba($color-surface, 0.5);
  border: 1px solid rgba($color-border, 0.5);
  border-radius: 16px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: $breakpoint-sm) {
    padding: 32px 24px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba($color-accent, 0.2);
  border-top-color: $color-accent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-family: $font-body;
  font-size: 16px;
  color: $color-text-dim;
}

.icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  svg {
    width: 36px;
    height: 36px;
  }

  &.success {
    background: rgba($color-accent, 0.15);
    color: $color-accent;
  }

  &.error {
    background: rgba($color-error, 0.15);
    color: $color-error;
  }
}

.title {
  font-family: $font-display;
  font-weight: 700;
  font-size: 26px;
  color: $color-text;
  margin-bottom: 16px;

  @media (max-width: $breakpoint-sm) {
    font-size: 22px;
  }
}

.message {
  font-family: $font-body;
  font-size: 15px;
  color: $color-text-dim;
  line-height: 1.6;
  margin-bottom: 8px;

  &.error {
    color: $color-error;
  }
}

.sub-message {
  font-family: $font-body;
  font-size: 13px;
  color: $color-text-muted;
  margin-bottom: 24px;
}

.action-btn {
  min-width: 180px;
  height: 48px;
  padding: 12px 24px;
  font-family: $font-body;
  font-size: 15px;
  font-weight: 600;
  color: $color-bg;
  background: $color-accent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-accent, 0.3);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
