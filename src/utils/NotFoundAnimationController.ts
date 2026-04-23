import { gsap } from 'gsap'

interface AnimationConfig {
  duration?: number
  ease?: string
  stagger?: number
  delay?: number
}

interface GlitchConfig {
  intensity: number
  frequency: number
}

/**
 * Controller class for managing 404 page animations
 * Implemented using OOP principles
 */
export class NotFoundAnimationController {
  private glitchTimeline: gsap.core.Timeline | null = null
  private floatTimeline: gsap.core.Timeline | null = null
  private isActive: boolean = false
  private readonly container: HTMLElement | null
  private readonly config: AnimationConfig

  constructor(container: HTMLElement | null, config: AnimationConfig = {}) {
    this.container = container
    this.config = {
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.05,
      delay: 0.2,
      ...config,
    }
  }

  /**
   * Initialize all animations
   */
  public init(): void {
    if (!this.container) return
    this.isActive = true
    this.animateEntrance()
    this.startGlitchEffect()
    this.startFloatingAnimation()
  }

  /**
   * Animate page elements entrance
   */
  private animateEntrance(): void {
    if (!this.container) return

    const digits = this.container.querySelectorAll('.not-found__digit')
    const title = this.container.querySelector('.not-found__title')
    const subtitle = this.container.querySelector('.not-found__subtitle')
    const actions = this.container.querySelector('.not-found__actions')
    const grid = this.container.querySelector('.not-found__grid')

    const tl = gsap.timeline({ delay: this.config.delay })

    // Animate grid background
    if (grid) {
      tl.fromTo(
        grid,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        0
      )
    }

    // Animate 404 digits with stagger
    if (digits.length) {
      tl.fromTo(
        digits,
        {
          y: 100,
          opacity: 0,
          rotateX: -90,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: this.config.duration,
          stagger: this.config.stagger,
          ease: this.config.ease,
        },
        0.2
      )
    }

    // Animate title
    if (title) {
      tl.fromTo(
        title,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.6
      )
    }

    // Animate subtitle
    if (subtitle) {
      tl.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.8
      )
    }

    // Animate action buttons
    if (actions) {
      tl.fromTo(
        actions,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        1
      )
    }
  }

  /**
   * Start glitch effect on 404 digits
   */
  private startGlitchEffect(): void {
    if (!this.container) return

    const digits = this.container.querySelectorAll('.not-found__digit')
    if (!digits.length) return

    this.glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 })

    digits.forEach((digit, index) => {
      const element = digit as HTMLElement

      // Random glitch intervals
      this.glitchTimeline.add(
        gsap.to(element, {
          duration: 0.1,
          x: () => gsap.utils.random(-10, 10),
          y: () => gsap.utils.random(-5, 5),
          skewX: () => gsap.utils.random(-20, 20),
          opacity: () => gsap.utils.random(0.7, 1),
          color: () => (Math.random() > 0.5 ? '#D4FF00' : '#ffffff'),
          textShadow: () =>
            Math.random() > 0.5
              ? '2px 0 #D4FF00, -2px 0 #FF5722'
              : 'none',
          repeat: 3,
          yoyo: true,
          ease: 'steps(2)',
          delay: index * 0.05,
        }),
        0
      )

      // Reset
      this.glitchTimeline.add(
        gsap.to(element, {
          duration: 0.2,
          x: 0,
          y: 0,
          skewX: 0,
          opacity: 1,
          color: index >= 1 ? '#D4FF00' : '#ffffff',
          textShadow: 'none',
          ease: 'power2.out',
        }),
        '+=0.1'
      )
    })
  }

  /**
   * Start floating animation for decorative elements
   */
  private startFloatingAnimation(): void {
    if (!this.container) return

    const shapes = this.container.querySelectorAll('.not-found__shape')
    if (!shapes.length) return

    this.floatTimeline = gsap.timeline({ repeat: -1 })

    shapes.forEach((shape, index) => {
      const element = shape as HTMLElement
      const delay = index * 0.5
      const duration = 3 + index * 0.5

      gsap.to(element, {
        y: '+=20',
        rotation: `+=${10 + index * 5}`,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      })
    })
  }

  /**
   * Trigger manual glitch effect
   */
  public triggerGlitch(config: GlitchConfig = { intensity: 1, frequency: 0.1 }): void {
    if (!this.container) return

    const digits = this.container.querySelectorAll('.not-found__digit')

    digits.forEach((digit, index) => {
      gsap.to(digit, {
        duration: config.frequency,
        x: () => gsap.utils.random(-20 * config.intensity, 20 * config.intensity),
        skewX: () => gsap.utils.random(-30 * config.intensity, 30 * config.intensity),
        repeat: 5,
        yoyo: true,
        ease: 'steps(3)',
        delay: index * 0.03,
        onComplete: () => {
          gsap.to(digit, {
            x: 0,
            skewX: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
        },
      })
    })
  }

  /**
   * Animate element on mouse move (parallax effect)
   */
  public handleMouseMove(mouseX: number, mouseY: number): void {
    if (!this.container || !this.isActive) return

    const shapes = this.container.querySelectorAll('.not-found__shape')
    const digits = this.container.querySelectorAll('.not-found__digit')

    const xPercent = (mouseX / window.innerWidth - 0.5) * 2
    const yPercent = (mouseY / window.innerHeight - 0.5) * 2

    // Parallax for shapes
    shapes.forEach((shape, index) => {
      const depth = (index + 1) * 10
      gsap.to(shape, {
        x: xPercent * depth,
        y: yPercent * depth,
        duration: 0.5,
        ease: 'power2.out',
      })
    })

    // Subtle movement for digits
    digits.forEach((digit, index) => {
      gsap.to(digit, {
        x: xPercent * (2 - index * 0.5),
        y: yPercent * (2 - index * 0.5),
        duration: 0.8,
        ease: 'power2.out',
      })
    })
  }

  /**
   * Cleanup and destroy animations
   */
  public destroy(): void {
    this.isActive = false

    if (this.glitchTimeline) {
      this.glitchTimeline.kill()
      this.glitchTimeline = null
    }

    if (this.floatTimeline) {
      this.floatTimeline.kill()
      this.floatTimeline = null
    }

    // Kill all GSAP animations on container
    if (this.container) {
      gsap.killTweensOf(this.container.querySelectorAll('*'))
    }
  }

  /**
   * Check if controller is active
   */
  public getIsActive(): boolean {
    return this.isActive
  }
}

export default NotFoundAnimationController
