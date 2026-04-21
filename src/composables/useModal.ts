import { reactive, nextTick } from 'vue'
import { gsap } from 'gsap'

export interface ModalOptions {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

interface ModalState extends ModalOptions {
  isOpen: boolean
  resolve: ((value: boolean) => void) | null
}

const modalState = reactive<ModalState>({
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  confirmText: 'OK',
  cancelText: 'Отмена',
  showCancel: false,
  resolve: null,
})

const animateModalOpen = () => {
  nextTick(() => {
    const overlay = document.querySelector('.alert-modal-overlay') as HTMLElement
    const modal = document.querySelector('.alert-modal') as HTMLElement
    if (!overlay || !modal) return

    // Animate overlay
    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    )

    // Animate modal with back.out easing like team modal
    gsap.fromTo(modal,
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.2)' }
    )
  })
}

const animateModalClose = (callback: () => void) => {
  const overlay = document.querySelector('.alert-modal-overlay') as HTMLElement
  const modal = document.querySelector('.alert-modal') as HTMLElement

  if (!overlay || !modal) {
    callback()
    return
  }

  // Animate out with timeline
  const tl = gsap.timeline({
    onComplete: callback
  })

  tl.to(modal, { y: 20, opacity: 0, scale: 0.98, duration: 0.2, ease: 'power2.in' })
  tl.to(overlay, { opacity: 0, duration: 0.15, ease: 'power2.in' }, '<')
}

const closeModal = () => {
  animateModalClose(() => {
    modalState.isOpen = false
  })
}

export const handleConfirm = () => {
  if (modalState.resolve) {
    modalState.resolve(true)
  }
}

export const handleCancel = () => {
  if (modalState.resolve) {
    modalState.resolve(false)
  }
}

export const handleOverlayClick = () => {
  if (modalState.showCancel) {
    handleCancel()
  } else {
    handleConfirm()
  }
}

export const useModal = () => {
  const alert = (options: Omit<ModalOptions, 'showCancel'> | string): Promise<void> => {
    return new Promise((resolve) => {
      const opts = typeof options === 'string' ? { title: 'Внимание', message: options } : options

      Object.assign(modalState, {
        isOpen: true,
        title: opts.title,
        message: opts.message,
        type: opts.type || 'info',
        confirmText: opts.confirmText || 'OK',
        cancelText: 'Отмена',
        showCancel: false,
        resolve: (value: boolean) => {
          closeModal()
          if (value) resolve()
        },
      })

      animateModalOpen()
    })
  }

  const confirm = (options: Omit<ModalOptions, 'showCancel'> | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const opts = typeof options === 'string' ? { title: 'Подтверждение', message: options } : options

      Object.assign(modalState, {
        isOpen: true,
        title: opts.title,
        message: opts.message,
        type: opts.type || 'warning',
        confirmText: opts.confirmText || 'Подтвердить',
        cancelText: opts.cancelText || 'Отмена',
        showCancel: true,
        resolve: (value: boolean) => {
          closeModal()
          resolve(value)
        },
      })

      animateModalOpen()
    })
  }

  return {
    modalState,
    alert,
    confirm,
  }
}

// Export global state for use in components
export { modalState }
