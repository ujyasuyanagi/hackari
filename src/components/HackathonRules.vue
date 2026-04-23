<template>
  <div class="rules-page">
    <div class="container">
      <section class="rules-deck" ref="rulesDeck">
        <div class="page-header">
          <div class="header-icon" ref="headerIcon">
            <ShieldCheck :size="44" />
          </div>
          <div class="header-copy">
            <p class="eyebrow">Слайды правил</p>
            <h1 class="page-title">Правила публикации хакатона</h1>
            <p class="page-subtitle">
              Листайте карточки, чтобы быстро просканировать требования перед публикацией
            </p>
          </div>
        </div>

        <div class="progress-bar" ref="progressBar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
          </div>
          <div class="progress-meta">
            <span>Слайд {{ currentSlideDisplay }} из {{ ruleSections.length }}</span>
            <span>{{ currentRule.title }}</span>
          </div>
        </div>

        <div class="rules-slider" ref="rulesSlider">
          <div class="slider-stage">
            <Transition :name="`slide-${direction}`" mode="out-in">
              <article class="slide-card" :key="currentSlide">
                <div class="slide-visual">
                  <span class="slide-number">{{ currentSlideLabel }}</span>
                  <div class="slide-icon">
                    <component :is="currentRule.icon" :size="34" />
                  </div>
                </div>

                <div class="slide-content">
                  <p class="slide-kicker">Ключевое правило</p>
                  <h3 class="rule-title">{{ currentRule.title }}</h3>
                  <p class="rule-description">{{ currentRule.description }}</p>
                  <ul class="rule-list">
                    <li v-for="(item, index) in currentRule.items" :key="index">{{ item }}</li>
                  </ul>
                </div>

                <div class="slide-footer">
                  <span class="slide-chip">Правило {{ currentSlideDisplay }}</span>
                  <span class="slide-chip slide-chip--muted">
                    {{ currentSlideDisplay }}/{{ ruleSections.length }}
                  </span>
                </div>
              </article>
            </Transition>
          </div>

          <div class="slider-navigation">
            <button
              class="nav-btn"
              :disabled="isFirstSlide"
              @click="prevSlide"
              aria-label="Предыдущий слайд"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div class="slide-indicators" aria-label="Навигация по слайдам">
              <button
                v-for="(section, index) in ruleSections"
                :key="section.title"
                type="button"
                class="indicator"
                :class="{ active: index === currentSlide }"
                :aria-label="`Перейти к слайду ${index + 1}`"
                @click="goToSlide(index)"
              ></button>
            </div>

            <button
              class="nav-btn"
              :disabled="isLastSlide"
              @click="nextSlide"
              aria-label="Следующий слайд"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div class="acceptance-check" ref="acceptanceCheck">
          <label class="checkbox-wrapper">
            <input
              type="checkbox"
              v-model="accepted"
              class="checkbox-input"
            />
            <span class="checkbox-custom">
              <svg v-if="accepted" class="checkbox-check" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
            <span class="checkbox-label">
              Я ознакомился с правилами и обязуюсь их соблюдать
            </span>
          </label>
        </div>

        <div class="actions" ref="actions">
          <button
            class="btn btn-secondary"
            @click="goBack"
          >
            <span class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </span>
            <span class="btn-text">Назад</span>
          </button>
          <button
            class="btn btn-primary"
            :disabled="!accepted"
            @click="proceed"
          >
            <span class="btn-text">Продолжить</span>
            <span class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Component } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { Clock3, FileText, Lock, Shield, ShieldCheck, Users } from 'lucide-vue-next'

const router = useRouter()
const accepted = ref(false)
const currentSlide = ref(0)
const direction = ref<'next' | 'prev'>('next')

const rulesDeck = ref<HTMLElement | null>(null)
const headerIcon = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const rulesSlider = ref<HTMLElement | null>(null)
const acceptanceCheck = ref<HTMLElement | null>(null)
const actions = ref<HTMLElement | null>(null)

interface RuleSection {
  icon: Component
  title: string
  description: string
  items: string[]
}

const ruleSections: RuleSection[] = [
  {
    icon: FileText,
    title: 'Актуальность информации',
    description: 'Все данные о хакатоне должны быть актуальными и соответствовать действительности.',
    items: [
      'Проверьте правильность дат проведения',
      'Укажите реальные призовые фонды',
      'Добавьте актуальные контактные данные',
    ],
  },
  {
    icon: Shield,
    title: 'Требования к содержанию',
    description: 'Хакатон должен соответствовать нашим стандартам качества.',
    items: [
      'Недопустима дискриминация по любому признаку',
      'Запрещена пропаганда наркотиков и насилия',
      'Требуется чёткое описание задач и треков',
    ],
  },
  {
    icon: Clock3,
    title: 'Сроки и дедлайны',
    description: 'Указывайте реалистичные сроки и придерживайтесь их.',
    items: [
      'Минимальный срок регистрации — 7 дней',
      'Нельзя переносить даты без уважительной причины',
      'Соблюдайте заявленные дедлайны оценки проектов',
    ],
  },
  {
    icon: Users,
    title: 'Обязательства перед участниками',
    description: 'Организатор обязуется выполнять свои обещания.',
    items: [
      'Призовой фонд должен быть выплачен в срок',
      'Предоставьте рабочую инфраструктуру',
      'Отвечайте на вопросы участников',
    ],
  },
  {
    icon: Lock,
    title: 'Публикация и редактирование',
    description: 'Важные правила о публикации хакатонов.',
    items: [
      'Хакатон публикуется сразу после создания',
      'Редактирование запрещено — проверьте данные перед сохранением',
      'Удаление возможно только до начала регистрации',
    ],
  },
]

const currentRule = computed(() => ruleSections[currentSlide.value] ?? ruleSections[0])
const currentSlideDisplay = computed(() => currentSlide.value + 1)
const currentSlideLabel = computed(() => String(currentSlideDisplay.value).padStart(2, '0'))
const progressPercent = computed(() => (currentSlideDisplay.value / ruleSections.length) * 100)
const isFirstSlide = computed(() => currentSlide.value === 0)
const isLastSlide = computed(() => currentSlide.value === ruleSections.length - 1)

const goToSlide = (index: number) => {
  if (index < 0 || index >= ruleSections.length || index === currentSlide.value) return
  direction.value = index > currentSlide.value ? 'next' : 'prev'
  currentSlide.value = index
}

const nextSlide = () => {
  if (!isLastSlide.value) {
    goToSlide(currentSlide.value + 1)
  }
}

const prevSlide = () => {
  if (!isFirstSlide.value) {
    goToSlide(currentSlide.value - 1)
  }
}

const goBack = () => {
  router.push('/organizers')
}

const proceed = () => {
  if (accepted.value) {
    localStorage.setItem('hackathon_rules_accepted', 'true')
    router.push('/organizers/profile')
  }
}

onMounted(() => {
  gsap.fromTo(rulesDeck.value,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
  )

  gsap.fromTo(headerIcon.value,
    { scale: 0.5, opacity: 0, rotate: -18 },
    { scale: 1, opacity: 1, rotate: 0, duration: 0.6, delay: 0.15, ease: 'back.out(1.7)' }
  )

  gsap.fromTo(progressBar.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.25, ease: 'power2.out' }
  )

  gsap.fromTo(rulesSlider.value,
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55, delay: 0.35, ease: 'power2.out' }
  )

  gsap.fromTo('.slide-card',
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, delay: 0.45, ease: 'power2.out' }
  )

  gsap.fromTo(acceptanceCheck.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' }
  )

  gsap.fromTo(actions.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.4, ease: 'power2.out' }
  )
})
</script>

<style scoped lang="scss">
@use '../styles/variables' as *;

.rules-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba($color-accent, 0.16), transparent 34%),
    radial-gradient(circle at bottom right, rgba($color-secondary, 0.14), transparent 30%),
    linear-gradient(180deg, #0d0d0d 0%, #080808 100%);
  padding: 2rem 1rem 3rem;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    inset: -18%;
    background: radial-gradient(circle, rgba($color-accent, 0.08) 0%, transparent 58%);
    filter: blur(60px);
    opacity: 0.75;
    pointer-events: none;
  }
}

.container {
  position: relative;
  z-index: 1;
  max-width: 920px;
  width: 100%;
  margin: 0 auto;
}

.rules-deck {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba($color-accent, 0.16), transparent 36%),
    radial-gradient(circle at bottom left, rgba($color-secondary, 0.12), transparent 34%),
    linear-gradient(180deg, rgba($color-surface, 0.9), rgba($color-surface, 0.76));
  border: 1px solid rgba($color-border, 0.85);
  border-radius: 36px;
  padding: clamp(1.4rem, 3.4vw, 2.4rem);
  box-shadow:
    0 32px 90px rgba(0, 0, 0, 0.48),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(22px);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 34%),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: auto, 28px 28px;
    opacity: 0.55;
    pointer-events: none;
  }
}

.page-header {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .header-icon {
    width: 88px;
    height: 88px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-accent;
    background: linear-gradient(135deg, rgba($color-accent, 0.2), rgba($color-secondary, 0.08));
    border: 1px solid rgba($color-accent, 0.22);
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .header-copy {
    min-width: 0;
  }

  .eyebrow {
    margin-bottom: 0.6rem;
    color: $color-accent;
    font-family: $font-mono;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .page-title {
    font-size: clamp(1.9rem, 4vw, 3rem);
    font-weight: 700;
    margin-bottom: 0.6rem;
    color: $color-text;
    font-family: $font-display;
    letter-spacing: -0.02em;
    line-height: 1.05;
  }

  .page-subtitle {
    color: $color-text-dim;
    font-size: 1.02rem;
    max-width: 52rem;
    line-height: 1.6;
    font-family: $font-body;
  }
}

.progress-bar {
  margin-bottom: 1.35rem;
  padding: 0.9rem 1rem 1rem;
  border-radius: 22px;
  border: 1px solid rgba($color-border, 0.9);
  background: rgba(255, 255, 255, 0.03);
}

.progress-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, $color-accent, #efff87);
  box-shadow: 0 0 18px rgba($color-accent, 0.34);
  transition: width 0.35s $transition-smooth;
}

.progress-meta {
  margin-top: 0.8rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: $color-text-dim;
  font-family: $font-mono;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.rules-slider {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.35rem;
}

.slider-stage {
  min-height: 390px;
}

.slide-card {
  position: relative;
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 1.5rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: 28px;
  border: 1px solid rgba($color-border, 0.9);
  background:
    radial-gradient(circle at top right, rgba($color-accent, 0.16), transparent 42%),
    radial-gradient(circle at bottom left, rgba($color-secondary, 0.08), transparent 32%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.025));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.slide-card::before {
  content: '';
  position: absolute;
  inset: auto -18% -36% auto;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($color-accent, 0.16), transparent 66%);
  pointer-events: none;
}

.slide-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.04), transparent 42%);
  pointer-events: none;
}

.slide-visual {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
}

.slide-number {
  font-family: $font-mono;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: $color-text-muted;
  text-transform: uppercase;
}

.slide-icon {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  border: 1px solid rgba($color-border, 0.9);
  background: rgba($color-bg, 0.42);
  color: $color-accent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.slide-content {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.slide-kicker {
  margin-bottom: 0.75rem;
  color: $color-accent;
  font-family: $font-mono;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.rule-title {
  font-size: clamp(1.25rem, 2.3vw, 1.7rem);
  font-weight: 700;
  margin-bottom: 0.65rem;
  color: $color-text;
  font-family: $font-display;
  line-height: 1.1;
}

.rule-description {
  color: $color-text-dim;
  font-size: 0.98rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-family: $font-body;
}

.rule-list {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    position: relative;
    padding: 0.85rem 1rem 0.85rem 2.5rem;
    border-radius: 18px;
    background: rgba($color-bg, 0.35);
    border: 1px solid rgba($color-border, 0.7);
    font-size: 0.92rem;
    color: $color-text-dim;
    line-height: 1.5;
    font-family: $font-body;

    &::before {
      content: '';
      position: absolute;
      left: 1rem;
      top: 1.15rem;
      width: 8px;
      height: 8px;
      background: $color-accent;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba($color-accent, 0.45);
    }
  }
}

.slide-footer {
  position: relative;
  z-index: 1;
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.slide-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba($color-accent, 0.25);
  background: rgba($color-accent, 0.08);
  color: $color-text;
  font-family: $font-mono;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.slide-chip--muted {
  border-color: rgba($color-border, 0.85);
  background: rgba(255, 255, 255, 0.03);
  color: $color-text-dim;
}

.slider-navigation {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.nav-btn {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 16px;
  border: 1px solid rgba($color-border, 0.9);
  background: rgba(255, 255, 255, 0.03);
  color: $color-text;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.28s $transition-smooth;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: $color-accent;
    color: $color-accent;
    box-shadow: 0 16px 30px rgba($color-accent, 0.12);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

.slide-indicators {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.indicator {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba($color-border, 0.9);
  background: rgba(255, 255, 255, 0.06);
  padding: 0;
  cursor: pointer;
  transition: all 0.28s $transition-smooth;

  &:hover {
    border-color: rgba($color-accent, 0.6);
    background: rgba($color-accent, 0.2);
  }

  &.active {
    width: 2.2rem;
    background: $color-accent;
    border-color: $color-accent;
    box-shadow: 0 0 20px rgba($color-accent, 0.4);
  }
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.45s $transition-smooth;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(36px) scale(0.985);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-36px) scale(0.985);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-36px) scale(0.985);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(36px) scale(0.985);
}

.acceptance-check {
  padding: 1.25rem;
  background: rgba($color-accent, 0.04);
  border-radius: 20px;
  border: 1px solid rgba($color-border, 0.9);
  margin-bottom: 1.25rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 2px solid $color-border;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-top: 2px;
  color: $color-bg;

  .checkbox-input:checked + & {
    background: $color-accent;
    border-color: $color-accent;
  }
}

.checkbox-check {
  width: 16px;
  height: 16px;
  fill: $color-bg;
}

.checkbox-label {
  font-size: 0.95rem;
  color: $color-text;
  line-height: 1.5;
  font-family: $font-body;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s $transition-smooth;
  cursor: pointer;
  border: 1px solid $color-border;
  font-family: $font-body;
  position: relative;
  overflow: hidden;

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &.btn-primary {
    background: linear-gradient(135deg, $color-accent, #efff87);
    color: #111111;
    border-color: transparent;
    min-width: 160px;
    justify-content: center;
    box-shadow: 0 18px 40px rgba($color-accent, 0.18);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 22px 46px rgba($color-accent, 0.22);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      box-shadow: none;
    }
  }

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.03);
    color: $color-text;
    border-color: rgba($color-border, 0.9);

    &:hover {
      transform: translateY(-2px);
      border-color: $color-text;
      background: rgba(255, 255, 255, 0.06);
    }
  }
}

@media (max-width: 720px) {
  .slide-card {
    grid-template-columns: 1fr;
  }

  .slide-visual {
    flex-direction: row;
    align-items: center;
  }

  .slider-navigation {
    gap: 0.65rem;
  }
}

@media (max-width: 540px) {
  .rules-deck {
    border-radius: 24px;
    padding: 1.2rem;
  }

  .progress-meta {
    flex-direction: column;
    gap: 0.35rem;
  }

  .slider-navigation {
    flex-wrap: wrap;
  }

  .slide-indicators {
    order: 3;
    width: 100%;
    justify-content: flex-start;
  }
}
</style>