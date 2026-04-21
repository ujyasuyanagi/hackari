<template>
  <div class="terms-page">
    <div class="container">
      <div class="page-card" ref="pageCard">
        <div class="page-header">
          <div class="header-icon" ref="headerIcon">
            <ShieldCheck :size="48" />
          </div>
          <h1 class="page-title">Условия платформы</h1>
          <p class="page-subtitle">
            Прежде чем стать организатором, примите базовые правила работы на платформе
          </p>
        </div>

        <div class="progress-bar" ref="progressBar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
          <span class="progress-text">{{ acceptedCount }} из {{ terms.length }}</span>
        </div>

        <div class="terms-content" ref="termsContent">
          <div
            v-for="(term, index) in terms"
            :key="index"
            class="term-card"
            :class="{
              'is-accepted': term.accepted,
              'is-active': isActive(index),
              'is-disabled': !canAccept(index)
            }"
            :style="{ animationDelay: index * 0.1 + 's' }"
          >
            <div class="term-number">
              <span class="num">0{{ index + 1 }}</span>
            </div>
            <div class="term-body">
              <h3 class="term-title">{{ term.title }}</h3>
              <p class="term-description">{{ term.description }}</p>
              <div v-if="term.details" class="term-details">
                <span v-for="(detail, dIndex) in term.details" :key="dIndex" class="detail-item">
                  {{ detail }}
                </span>
              </div>
            </div>
            <button
              class="accept-btn"
              :class="{ 'is-accepted': term.accepted }"
              :disabled="!canAccept(index) || term.accepted"
              @click="acceptTerm(index)"
            >
              <span v-if="term.accepted" class="btn-icon">
                <Check :size="18" />
              </span>
              <span v-else class="btn-icon">
                <Circle :size="18" />
              </span>
              <span class="btn-text">
                {{ term.accepted ? 'Принято' : 'Принять' }}
              </span>
            </button>
          </div>
        </div>

        <div class="summary-section" ref="summarySection" v-if="allAccepted">
          <div class="summary-card">
            <div class="summary-icon">
              <PartyPopper :size="32" />
            </div>
            <h3 class="summary-title">Всё готово!</h3>
            <p class="summary-text">
              Вы приняли все условия. Теперь можно создать профиль организатора и начать проводить хакатоны.
            </p>
          </div>
        </div>

        <div class="full-terms" ref="fullTerms">
          <a href="#" class="terms-link" @click.prevent="showFullTerms">
            <FileText :size="16" />
            <span>Полные условия использования платформы для организаторов</span>
            <ExternalLink :size="14" class="link-icon" />
          </a>
          <p class="terms-note">
            Нажимая "Продолжить", вы подтверждаете, что ознакомлены с полным текстом соглашения
          </p>
        </div>

        <div class="actions" ref="actions">
          <button class="btn btn-secondary" @click="goBack">
            <ArrowLeft :size="18" />
            <span>Назад</span>
          </button>
          <button
            class="btn btn-primary"
            :disabled="!allAccepted"
            @click="proceed"
          >
            <span>Продолжить</span>
            <ArrowRight :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Мок-диалог полных условий -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Условия использования платформы для организаторов</h3>
              <button class="modal-close" @click="closeModal">
                <X :size="20" />
              </button>
            </div>
            <div class="modal-body">
              <div class="mock-document">
                <div class="doc-header">
                  <div class="doc-logo">H</div>
                  <h4>Публичная оферта для организаторов</h4>
                  <span class="doc-version">v 2.1 от 15.04.2026</span>
                </div>
                <div class="doc-section" v-for="n in 5" :key="n">
                  <h5>Раздел {{ n }}. {{ sectionTitles[n - 1] }}</h5>
                  <div class="doc-paragraphs">
                    <div v-for="m in 4" :key="m" class="doc-line" :style="{ width: Math.random() * 40 + 60 + '%' }" />
                  </div>
                </div>
                <div class="doc-footer">
                  <span class="mock-label">[Мок документа]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import {
  ShieldCheck,
  Check,
  Circle,
  PartyPopper,
  FileText,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-vue-next'

const router = useRouter()
const showModal = ref(false)
const pageCard = ref<HTMLElement | null>(null)
const headerIcon = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const termsContent = ref<HTMLElement | null>(null)
const fullTerms = ref<HTMLElement | null>(null)
const actions = ref<HTMLElement | null>(null)
const summarySection = ref<HTMLElement | null>(null)

const sectionTitles = [
  'Общие положения',
  'Права и обязанности организатора',
  'Процесс проведения хакатона',
  'Выплата призов',
  'Ответственность сторон'
]

interface Term {
  title: string
  description: string
  details?: string[]
  accepted: boolean
}

const terms = ref<Term[]>([
  {
    title: 'Честность и прозрачность',
    description: 'Публикуете только реальную информацию о хакатонах',
    details: ['Призовые фонды соответствуют заявленным', 'Даты проведения реальны', 'Условия участия не меняются в последний момент'],
    accepted: false
  },
  {
    title: 'Уважение к участникам',
    description: 'Относитесь к участникам как к партнерам, а не как к ресурсу',
    details: ['Отвечаете на вопросы в разумный срок', 'Не допускаете дискриминации', 'Соблюдаете обещанные сроки'],
    accepted: false
  },
  {
    title: 'Связь с нами',
    description: 'Поддерживаете актуальные контактные данные',
    details: ['Email для связи работает', 'Соцсети обновляются', 'Быстрая реакция на обращения платформы'],
    accepted: false
  },
  {
    title: 'Качество контента',
    description: 'Создаете понятные и полные описания хакатонов',
    details: ['Четкие критерии оценки', 'Понятные задачи и треки', 'Реалистичные требования к участникам'],
    accepted: false
  },
  {
    title: 'Выплата призов',
    description: 'Гарантируете выплату призов в срок и в полном объеме',
    details: ['В течение 30 дней после объявления победителей', 'Полная сумма без скрытых вычетов', 'Прозрачная процедура оценки'],
    accepted: false
  }
])

const acceptedCount = computed(() => terms.value.filter(t => t.accepted).length)
const allAccepted = computed(() => acceptedCount.value === terms.value.length)
const progressPercent = computed(() => (acceptedCount.value / terms.value.length) * 100)

const isActive = (index: number) => {
  if (index === 0) return true
  return terms.value[index - 1]?.accepted
}

const canAccept = (index: number) => {
  for (let i = 0; i < index; i++) {
    if (!terms.value[i].accepted) return false
  }
  return true
}

const acceptTerm = (index: number) => {
  if (!canAccept(index)) return
  terms.value[index].accepted = true

  // Анимация при принятии
  gsap.fromTo(
    `.term-card:nth-child(${index + 1})`,
    { scale: 1 },
    { scale: [1.02, 1], duration: 0.3, ease: 'power2.out' }
  )
}

const goBack = () => {
  router.push('/organizers')
}

const proceed = () => {
  if (allAccepted.value) {
    localStorage.setItem('organizer_terms_accepted', 'true')
    router.push('/organizers/profile')
  }
}

const showFullTerms = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

onMounted(() => {
  // Проверяем, приняты ли уже условия
  const alreadyAccepted = localStorage.getItem('organizer_terms_accepted')
  if (alreadyAccepted === 'true') {
    // Заполняем все принятые
    terms.value.forEach(t => t.accepted = true)
  }

  // Анимации
  gsap.fromTo(pageCard.value,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
  )

  gsap.fromTo(headerIcon.value,
    { scale: 0, rotate: -180 },
    { scale: 1, rotate: 0, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
  )

  gsap.fromTo(progressBar.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
  )

  gsap.fromTo('.term-card',
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'power2.out' }
  )

  gsap.fromTo(fullTerms.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.9, ease: 'power2.out' }
  )

  gsap.fromTo(actions.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 1, ease: 'power2.out' }
  )
})
</script>

<style scoped lang="scss">
@use '../styles/variables' as *;

.terms-page {
  min-height: 100vh;
  background: $color-bg;
  padding: 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.container {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

.page-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 2.5rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;

  .header-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: transparent;
    border: 2px solid $color-accent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-accent;
  }

  .page-title {
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: $color-text;
    font-family: $font-display;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    color: $color-text-dim;
    font-size: 1rem;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.5;
    font-family: $font-body;
  }
}

.progress-bar {
  position: relative;
  height: 4px;
  background: $color-border;
  margin-bottom: 2rem;
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background: $color-accent;
    transition: width 0.5s $transition-smooth;
  }

  .progress-text {
    position: absolute;
    right: 0;
    top: -24px;
    font-size: 0.75rem;
    color: $color-text-dim;
    font-weight: 500;
    font-family: $font-mono;
  }
}

.terms-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.term-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: $color-bg;
  border: 1px solid $color-border;
  border-radius: 8px;
  transition: all 0.3s $transition-smooth;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: transparent;
    transition: background 0.3s $transition-smooth;
  }

  &.is-accepted {
    border-color: $color-accent;
    background: rgba($color-accent, 0.05);

    &::before {
      background: $color-accent;
    }
  }

  &.is-active {
    border-color: $color-text-dim;
  }

  &.is-disabled:not(.is-accepted) {
    opacity: 0.5;
  }
}

.term-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s $transition-smooth;

  .num {
    font-family: $font-mono;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-dim;
  }

  .is-accepted & {
    background: $color-accent;
    border-color: $color-accent;

    .num {
      color: $color-bg;
    }
  }

  .is-active & {
    border-color: $color-text;

    .num {
      color: $color-text;
    }
  }
}

.term-body {
  flex: 1;
  min-width: 0;
}

.term-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: $color-text;
  font-family: $font-display;
}

.term-description {
  font-size: 0.9rem;
  color: $color-text-dim;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-family: $font-body;
}

.term-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .detail-item {
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
    background: $color-surface;
    border-radius: 4px;
    color: $color-text-dim;
    border: 1px solid $color-border;
    font-family: $font-body;
  }
}

.accept-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: transparent;
  color: $color-text-dim;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s $transition-smooth;
  align-self: flex-start;
  text-transform: lowercase;
  font-family: $font-body;

  &:hover:not(:disabled) {
    border-color: $color-accent;
    color: $color-accent;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.is-accepted {
    background: $color-accent;
    border-color: $color-accent;
    color: $color-bg;
  }
}

.summary-section {
  margin-bottom: 2rem;
  animation: slideUp 0.5s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.summary-card {
  text-align: center;
  padding: 2rem;
  background: rgba($color-accent, 0.05);
  border: 1px solid $color-accent;
  border-radius: 8px;

  .summary-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    background: $color-accent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-bg;
  }

  .summary-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: $color-text;
    font-family: $font-display;
  }

  .summary-text {
    font-size: 0.95rem;
    color: $color-text-dim;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
    font-family: $font-body;
  }
}

.full-terms {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: $color-bg;
  border-radius: 8px;
  border: 1px dashed $color-border;
}

.terms-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: $color-text;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: $font-body;

  &:hover {
    color: $color-accent;

    .link-icon {
      transform: translate(2px, -2px);
    }
  }

  .link-icon {
    transition: transform 0.2s ease;
    color: $color-accent;
  }
}

.terms-note {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: $color-text-muted;
  font-family: $font-body;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s $transition-smooth;
  cursor: pointer;
  border: 1px solid $color-border;
  text-transform: lowercase;
  font-family: $font-body;
  position: relative;
  overflow: hidden;
  background: transparent;

  &.btn-primary {
    color: $color-accent;
    border-color: $color-accent;
    min-width: 160px;

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

    &:hover:not(:disabled) {
      color: $color-bg;

      &::before {
        transform: scaleX(1);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      border-color: $color-border;
    }
  }

  &.btn-secondary {
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
}

// Modal styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($color-bg, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid $color-border;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: $color-text;
    font-family: $font-display;
  }
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid $color-border;
  border-radius: 8px;
  color: $color-text-dim;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $color-secondary;
    color: $color-secondary;
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.mock-document {
  background: $color-bg;
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 2rem;

  .doc-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid $color-border;

    .doc-logo {
      width: 48px;
      height: 48px;
      background: $color-accent;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-bg;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      font-family: $font-display;
    }

    h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: $color-text;
      margin-bottom: 0.25rem;
      font-family: $font-display;
    }

    .doc-version {
      font-size: 0.75rem;
      color: $color-text-muted;
      font-family: $font-mono;
    }
  }

  .doc-section {
    margin-bottom: 1.5rem;

    h5 {
      font-size: 0.9rem;
      font-weight: 600;
      color: $color-text;
      margin-bottom: 0.75rem;
      font-family: $font-display;
    }
  }

  .doc-paragraphs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .doc-line {
    height: 12px;
    background: $color-border;
    border-radius: 6px;
    opacity: 0.5;
  }

  .doc-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid $color-border;
    text-align: center;

    .mock-label {
      font-size: 0.75rem;
      color: $color-text-muted;
      font-family: $font-mono;
      padding: 0.375rem 0.75rem;
      background: $color-surface;
      border-radius: 4px;
    }
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .page-card {
    padding: 1.5rem;
  }

  .term-card {
    flex-direction: column;
    gap: 1rem;
  }

  .accept-btn {
    width: 100%;
    justify-content: center;
  }

  .term-details {
    .detail-item {
      font-size: 0.7rem;
    }
  }
}
</style>
