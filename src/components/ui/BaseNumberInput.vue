<script setup lang="ts">
interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: -Infinity,
  max: Infinity,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const decrement = () => {
  const newValue = +(props.modelValue - props.step).toFixed(10)
  emit('update:modelValue', Math.max(props.min, newValue))
}

const increment = () => {
  const newValue = +(props.modelValue + props.step).toFixed(10)
  emit('update:modelValue', Math.min(props.max, newValue))
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = parseFloat(target.value)
  if (isNaN(value)) value = props.min
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, value)))
}
</script>

<template>
  <div class="base-number-input">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="number-input-wrapper">
      <button
        type="button"
        class="number-btn decrement"
        @click="decrement"
        :disabled="disabled || modelValue <= min"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"/>
        </svg>
      </button>
      <input
        :value="modelValue"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        class="number-input"
        @input="onInput"
      />
      <button
        type="button"
        class="number-btn increment"
        @click="increment"
        :disabled="disabled || modelValue >= max"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-number-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 12px;
  font-weight: 500;
  color: $color-text-dim;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.number-input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.number-input {
  width: 60px;
  padding: 8px 4px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-primary);
  font-family: $font-body;
  font-size: 14px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: $color-accent;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Hide default spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
}

.number-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--surface-dark);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;

  &:hover:not(:disabled) {
    background: $color-accent;
    color: white;
    border-color: $color-accent;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
