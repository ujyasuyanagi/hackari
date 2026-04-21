<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/services/api'

const route = useRoute()
const router = useRouter()

const token = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

onMounted(() => {
  const urlToken = route.query.token as string
  if (!urlToken) {
    error.value = 'Ссылка недействительна или устарела'
    return
  }
  token.value = urlToken
})

const submitReset = async () => {
  error.value = ''

  if (password.value.length < 8) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  const response = await authApi.resetPassword({
    token: token.value,
    new_password: password.value,
  })

  isLoading.value = false

  if (response.error) {
    error.value = response.error as string
  } else {
    success.value = true
    setTimeout(() => {
      router.push('/auth')
    }, 3000)
  }
}
</script>

<template>
  <div class="reset-password-page">
    <div class="container">
      <div class="form-wrapper">
        <h1 class="title">Новый пароль</h1>

        <div v-if="success" class="success-state">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p class="success-text">Пароль успешно изменён!</p>
          <p class="success-subtext">Перенаправляем на страницу входа...</p>
        </div>

        <form v-else @submit.prevent="submitReset" class="form">
          <p class="description">
            Введите новый пароль для вашего аккаунта
          </p>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="input-group">
            <label for="password">Новый пароль</label>
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="Минимум 8 символов"
                required
                minlength="8"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="input-group">
            <label for="confirmPassword">Подтвердите пароль</label>
            <div class="password-input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="Повторите пароль"
                required
                minlength="8"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="isLoading || !password || !confirmPassword"
          >
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Сохранить пароль</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reset-password-page {
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

.form-wrapper {
  background: rgba($color-surface, 0.5);
  border: 1px solid rgba($color-border, 0.5);
  border-radius: 16px;
  padding: 40px;

  @media (max-width: $breakpoint-sm) {
    padding: 30px 20px;
  }
}

.title {
  font-family: $font-display;
  font-weight: 700;
  font-size: 28px;
  color: $color-text;
  text-align: center;
  margin-bottom: 32px;

  @media (max-width: $breakpoint-sm) {
    font-size: 24px;
    margin-bottom: 24px;
  }
}

.description {
  font-family: $font-body;
  font-size: 14px;
  color: $color-text-dim;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-family: $font-body;
    font-size: 13px;
    font-weight: 500;
    color: $color-text;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.password-input-wrapper {
  position: relative;

  input {
    width: 100%;
    padding: 14px 48px 14px 16px;
    font-family: $font-body;
    font-size: 15px;
    color: $color-text;
    background: $color-bg;
    border: 1px solid $color-border;
    border-radius: 10px;
    transition: all 0.2s ease;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-dim;
  transition: color 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: $color-text;
  }
}

.error-message {
  padding: 12px 16px;
  background: rgba($color-error, 0.1);
  border: 1px solid $color-error;
  border-radius: 8px;
  font-family: $font-body;
  font-size: 14px;
  color: $color-error;
  text-align: center;
}

.submit-btn {
  height: 52px;
  font-family: $font-body;
  font-size: 16px;
  font-weight: 600;
  color: $color-bg;
  background: $color-accent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-accent, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba($color-bg, 0.3);
  border-top-color: $color-bg;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: $color-accent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-bg;

  svg {
    width: 32px;
    height: 32px;
  }
}

.success-text {
  font-family: $font-display;
  font-size: 20px;
  font-weight: 600;
  color: $color-text;
  text-align: center;
}

.success-subtext {
  font-family: $font-body;
  font-size: 14px;
  color: $color-text-dim;
  text-align: center;
}
</style>
