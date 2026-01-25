/**
 * GSAP-Powered Wordmark Animation - LoveFrom Style
 *
 * Character-by-character reveal animation using GSAP
 * for premium, smooth animations with spring physics.
 *
 * Animation characteristics:
 * - Staggered character reveal (150ms offset)
 * - Spring-inspired easing with GSAP
 * - Animated cursor tracking
 * - GPU-accelerated transforms
 */

import gsap from 'gsap';

class AnimatedWordmark {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || element.textContent;
    this.staggerDelay = options.staggerDelay || 0.15; // seconds between characters
    this.charDuration = options.charDuration || 0.5; // seconds per character
    this.initialDelay = options.initialDelay || 0.3; // seconds before start
    this.cursorBlinkDuration = options.cursorBlinkDuration || 0.53; // seconds
    this.showCursor = options.showCursor !== false;

    // GSAP timeline for coordinated animations
    this.timeline = gsap.timeline({ paused: true });

    this.init();
  }

  init() {
    // Clear element and prepare for animation
    this.element.textContent = '';
    gsap.set(this.element, {
      display: 'inline-flex',
      position: 'relative'
    });

    // Create character spans
    this.characters = this.text.split('').map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;

      gsap.set(span, {
        display: 'inline-block',
        opacity: 0,
        y: 8,
        minWidth: char === ' ' ? '0.25em' : 'auto'
      });

      this.element.appendChild(span);
      return { element: span, index };
    });

    // Create cursor if enabled
    if (this.showCursor) {
      this.cursor = document.createElement('span');
      this.cursor.className = 'animated-cursor';

      gsap.set(this.cursor, {
        display: 'inline-block',
        width: '2px',
        height: '0.85em',
        backgroundColor: 'currentColor',
        marginLeft: '0.05em',
        opacity: 0,
        y: '0.08em',
        scale: 0.8
      });

      this.element.appendChild(this.cursor);
    }

    // Start animation after initial delay
    setTimeout(() => this.animate(), this.initialDelay * 1000);
  }

  animate() {
    // Master timeline for all animations
    const tl = gsap.timeline();

    // Show cursor at the start
    if (this.showCursor && this.cursor) {
      // Position cursor before first character
      this.element.insertBefore(this.cursor, this.characters[0].element);

      tl.to(this.cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      }, 0);

      // Start cursor blink after it appears
      tl.add(() => this.startCursorBlink(), 0.2);
    }

    // Animate each character with stagger
    this.characters.forEach(({ element, index }) => {
      const startTime = index * this.staggerDelay;

      tl.to(element, {
        opacity: 1,
        y: 0,
        duration: this.charDuration,
        ease: 'expo.out', // GSAP's spring-inspired easing
        onStart: () => {
          if (this.showCursor && this.cursor) {
            this.updateCursorPosition(index);
          }
        }
      }, startTime);
    });

    // Hide cursor after animation completes
    if (this.showCursor && this.cursor) {
      const hideTime = (this.characters.length * this.staggerDelay) + this.charDuration + 1;

      tl.add(() => this.stopCursorBlink(), hideTime);
      tl.to(this.cursor, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, hideTime);
    }

    return tl;
  }

  updateCursorPosition(charIndex) {
    // Move cursor to appear after the currently revealed character
    const nextIndex = charIndex + 1;

    if (nextIndex < this.characters.length) {
      // Insert cursor before the next character
      this.element.insertBefore(this.cursor, this.characters[nextIndex].element);
    } else {
      // Last character - append cursor at the end
      this.element.appendChild(this.cursor);
    }
  }

  startCursorBlink() {
    // Create infinite blink animation with GSAP
    this.blinkAnimation = gsap.to(this.cursor, {
      opacity: 0,
      duration: this.cursorBlinkDuration / 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }

  stopCursorBlink() {
    if (this.blinkAnimation) {
      this.blinkAnimation.kill();
    }
  }

  // Public method to replay animation
  replay() {
    this.stopCursorBlink();
    gsap.killTweensOf([this.element, ...this.characters.map(c => c.element), this.cursor]);
    this.init();
  }
}

/**
 * Auto-initialize for elements with data-animated-wordmark attribute
 *
 * Usage:
 * <h1 class="wordmark" data-animated-wordmark>goutham</h1>
 */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-animated-wordmark]');

  elements.forEach(element => {
    new AnimatedWordmark(element, {
      staggerDelay: 0.15,
      charDuration: 0.5,
      initialDelay: 0.3,
      showCursor: true
    });
  });
});

/**
 * Manual initialization example:
 *
 * const wordmark = document.querySelector('.wordmark');
 * const animation = new AnimatedWordmark(wordmark, {
 *   text: 'goutham',
 *   staggerDelay: 0.15,
 *   charDuration: 0.5,
 *   initialDelay: 0.3,
 *   showCursor: true
 * });
 *
 * // Replay animation
 * animation.replay();
 */

// Export for module usage
export default AnimatedWordmark;
