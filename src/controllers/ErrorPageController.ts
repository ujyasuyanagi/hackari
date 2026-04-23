import { gsap } from 'gsap'

/**
 * Controller for 404 error page animations and interactions
 * Implements OOP principles with encapsulated state and methods
 */
export class ErrorPageController {
  private readonly container: HTMLElement | null
  private readonly codeElement: HTMLElement | null
  private readonly messageElement: HTMLElement | null
  private readonly glitchElements: NodeListOf<HTMLElement>
  private readonly mouseHandler: (e: MouseEvent) => void
  private animationTimeline: gsap.core.Timeline | null = null
  private isDestroyed: boolean = false

  constructor(container: HTMLElement | null) {
    this.container = container
    this.codeElement = container?.querySelector('.error-page__code') ?? null
    this.messageElement = container?.querySelector('.error-page__message') ?? null
    this.glitchElements = container?.querySelectorAll('.error-page__glitch') ?? document.querySelectorAll('')

    // Bind mouse handler for 3D tilt effect
    this.mouseHandler = this.handleMouseMove.bind(this)
  }

  /**
   * Initialize all animations and event listeners
   */
  public init(): void {
    if (this.isDestroyed) return

    this.initEntranceAnimations()
    this.initGlitchEffect()
    this.initFloatingAnimation()
    this.bindEvents()
  }

  /**
   * Bind event listeners
   */
  private bindEvents(): void {
    if (this.container) {
      this.container.addEventListener('mousemove', this.mouseHandler)
    }
  }

  /**
   * Handle mouse move for 3D tilt effect
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.container || this.isDestroyed) return

    const rect = this.container.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(this.codeElement, {
      rotateX: -y * 15,
      rotateY: x * 15,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  /**
   * Initialize entrance animations for page elements
   */
  private initEntranceAnimations(): void {
    if (!this.container) return

    this.animationTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Animate 404 code
    if (this.codeElement) {
      this.animationTimeline.fromTo(
        this.codeElement,
        { scale: 0.5, opacity: 0, rotateX: -30 },
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.2 },
        0.2
      )
    }

    // Animate message
    if (this.messageElement) {
      this.animationTimeline.fromTo(
        this.messageElement,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.6
      )
    }

    // Animate description
    const description = this.container.querySelector('.error-page__description')
    if (description) {
      this.animationTimeline.fromTo(
        description,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.9
      )
    }

    // Animate actions
    const actions = this.container.querySelector('.error-page__actions')
    if (actions) {
      this.animationTimeline.fromTo(
        actions,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        1.1
      )
    }

    // Animate decorative elements
    const decorElements = this.container.querySelectorAll('.error-page__decor-line')
    this.animationTimeline.fromTo(
      decorElements,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, stagger: 0.1 },
      0.4
    )
  }

  /**
   * Initialize glitch effect on the error code
   */
  private initGlitchEffect(): void {
    if (!this.codeElement || this.isDestroyed) return

    const glitchTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
      delay: 2,
    })

    // Create random glitch movements
    for (let i = 0; i < 5; i++) {
      const xOffset = (Math.random() - 0.5) * 20
      const yOffset = (Math.random() - 0.5) * 10

      glitchTimeline
        .to(this.codeElement, {
          x: xOffset,
          opacity: 0.7,
          duration: 0.05,
          ease: 'none',
        })
        .to(this.codeElement, {
          x: -xOffset,
          opacity: 0.8,
          duration: 0.05,
          ease: 'none',
        })
    }

    glitchTimeline.to(this.codeElement, {
      x: 0,
      opacity: 1,
      duration: 0.1,
      ease: 'power2.out',
    })

    // Store reference to kill later if needed
    this.animationTimeline?.add(glitchTimeline, 0)
  }

  /**
   * Initialize floating animation for decorative elements
   */
  private initFloatingAnimation(): void {
    const floatElements = this.container?.querySelectorAll('.error-page__float')
    if (!floatElements || this.isDestroyed) return

    floatElements.forEach((el, index) => {
      gsap.to(el, {
        y: '+=15',
        duration: 2 + index * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })
  }

  /**
   * Trigger glitch effect on demand
   */
  public triggerGlitch(): void {
    if (!this.codeElement) return

    const tl = gsap.timeline()

    tl.to(this.codeElement, {
      skewX: 20,
      duration: 0.1,
      ease: 'power2.in',
    })
      .to(this.codeElement, {
        skewX: -15,
        duration: 0.1,
        ease: 'power2.inOut',
      })
      .to(this.codeElement, {
        skewX: 0,
        duration: 0.15,
        ease: 'power2.out',
      })
  }

  /**
   * Destroy the controller and cleanup resources
   */
  public destroy(): void {
    this.isDestroyed = true

    if (this.container) {
      this.container.removeEventListener('mousemove', this.mouseHandler)
    }

    if (this.animationTimeline) {
      this.animationTimeline.kill()
    }

    gsap.killTweensOf(this.codeElement)
    gsap.killTweensOf(this.messageElement)
    gsap.killTweensOf(this.glitchElements)
  }
}
