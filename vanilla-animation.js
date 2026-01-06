/**
 * Vanilla JavaScript Animation - LoveFrom Style
 *
 * Recreates premium character-by-character reveal animation
 * without dependencies. Uses Web Animations API for 60fps performance.
 *
 * Animation characteristics:
 * - Staggered character reveal (150ms offset)
 * - Spring-inspired easing curve
 * - Animated cursor tracking
 * - GPU-accelerated transforms
 */

class AnimatedWordmark {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || element.textContent;
    this.staggerDelay = options.staggerDelay || 150; // ms between characters
    this.charDuration = options.charDuration || 500; // ms per character
    this.initialDelay = options.initialDelay || 300; // ms before start
    this.cursorBlinkDuration = options.cursorBlinkDuration || 530; // ms
    this.showCursor = options.showCursor !== false;

    // Spring-inspired easing: ease-out-expo
    // Approximates spring physics without complex calculations
    this.easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

    this.init();
  }

  init() {
    // Clear element and prepare for animation
    this.element.textContent = '';
    this.element.style.display = 'inline-flex';
    this.element.style.position = 'relative';
    this.element.style.willChange = 'transform, opacity';

    // Create character spans
    this.characters = this.text.split('').map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(8px)';
      span.style.willChange = 'transform, opacity';
      span.style.minWidth = char === ' ' ? '0.25em' : 'auto';

      this.element.appendChild(span);
      return { element: span, index };
    });

    // Create cursor if enabled
    if (this.showCursor) {
      this.cursor = document.createElement('span');
      this.cursor.className = 'animated-cursor';
      this.cursor.style.display = 'inline-block';
      this.cursor.style.width = '2px';
      this.cursor.style.height = '0.85em';
      this.cursor.style.backgroundColor = 'currentColor';
      this.cursor.style.marginLeft = '0.05em';
      this.cursor.style.opacity = '0';
      this.cursor.style.transform = 'translateY(0.08em) scale(0.8)';
      this.cursor.style.willChange = 'opacity, transform';

      this.element.appendChild(this.cursor);
    }

    // Start animation after initial delay
    setTimeout(() => this.animate(), this.initialDelay);
  }

  animate() {
    // Show cursor immediately at the start
    if (this.showCursor && this.cursor) {
      // Position cursor before first character
      this.element.insertBefore(this.cursor, this.characters[0].element);

      this.cursor.animate(
        [
          { opacity: 0, transform: 'translateY(0.08em) scale(0.8)' },
          { opacity: 1, transform: 'translateY(0.08em) scale(1)' }
        ],
        {
          duration: 200,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );

      // Start cursor blink
      setTimeout(() => {
        this.startCursorBlink();
      }, 200);
    }

    // Animate each character with stagger
    this.characters.forEach(({ element, index }) => {
      const delay = index * this.staggerDelay;

      setTimeout(() => {
        // Use Web Animations API for 60fps GPU-accelerated animation
        element.animate(
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          {
            duration: this.charDuration,
            easing: this.easing,
            fill: 'forwards'
          }
        );

        // Move cursor to track character reveals
        if (this.showCursor && this.cursor) {
          this.updateCursorPosition(index);
        }
      }, delay);
    });

    // Hide cursor after animation completes
    if (this.showCursor && this.cursor) {
      const totalDuration = (this.characters.length * this.staggerDelay) + this.charDuration + 1000;
      setTimeout(() => {
        this.stopCursorBlink();
        this.cursor.animate(
          [
            { opacity: 1 },
            { opacity: 0 }
          ],
          {
            duration: 300,
            easing: 'ease-out',
            fill: 'forwards'
          }
        );
      }, totalDuration);
    }
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
    // Create blink animation
    this.blinkAnimation = this.cursor.animate(
      [
        { opacity: 1 },
        { opacity: 0 },
        { opacity: 1 }
      ],
      {
        duration: this.cursorBlinkDuration,
        iterations: Infinity,
        easing: 'ease-in-out'
      }
    );
  }

  stopCursorBlink() {
    if (this.blinkAnimation) {
      this.blinkAnimation.cancel();
    }
  }

  // Public method to replay animation
  replay() {
    this.stopCursorBlink();
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
      staggerDelay: 150,
      charDuration: 500,
      initialDelay: 300,
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
 *   staggerDelay: 150,
 *   charDuration: 500,
 *   initialDelay: 300,
 *   showCursor: true
 * });
 *
 * // Replay animation
 * animation.replay();
 */

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimatedWordmark;
}
