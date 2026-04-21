<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { PhCheckCircle, PhXCircle, PhWarning, PhInfo } from '@phosphor-icons/vue'
import { modalState, handleConfirm, handleCancel, handleOverlayClick } from '@/composables/useModal'

const getIcon = computed(() => {
  switch (modalState.type) {
    case 'success':
      return PhCheckCircle
    case 'error':
      return PhXCircle
    case 'warning':
      return PhWarning
    case 'info':
    default:
      return PhInfo
  }
})

const getIconColor = computed(() => {
  switch (modalState.type) {
    case 'success':
      return '#10b981'
    case 'error':
      return '#ef4444'
    case 'warning':
      return '#f59e0b'
    case 'info':
    default:
      return '#3b82f6'
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (modalState.showCancel) {
      handleCancel()
    } else {
      handleConfirm()
    }
  } else if (e.key === 'Enter') {
    handleConfirm()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="modalState.isOpen"
        class="alert-modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="alert-modal"
          @click.stop
        >
          <div class="alert-modal-header">
            <div class="alert-modal-icon" :style="{ color: getIconColor }">
              <component :is="getIcon" :size="40" weight="duotone" />
            </div>
            <h3 class="alert-modal-title">{{ modalState.title }}</h3>
          </div>
          
          <div class="alert-modal-body">
            <p class="alert-modal-message">{{ modalState.message }}</p>
          </div>
          
          <div class="alert-modal-footer">
            <button
              v-if="modalState.showCancel"
              class="alert-btn alert-btn-secondary"
              @click="handleCancel"
            >
              {{ modalState.cancelText }}
            </button>
            <button
              class="alert-btn alert-btn-primary"
              :class="{ 'alert-btn-full': !modalState.showCancel }"
              @click="handleConfirm"
            >
              {{ modalState.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.alert-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: 20px;
}

.alert-modal {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.alert-modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.alert-modal-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.alert-modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin: 0;
}

.alert-modal-body {
  margin-bottom: 28px;
}

.alert-modal-message {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
}

.alert-modal-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.alert-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px currentColor;
  }
}

.alert-btn-primary {
  background: #D4FF00;
  color: #0a0a0a;

  &:hover {
    background: darken(#D4FF00, 5%);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.alert-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.alert-btn-full {
  flex: 1;
}

// Vue transitions
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}
</style>
