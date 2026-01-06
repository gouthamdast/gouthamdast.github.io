/**
 * Content Reveal - Apple-style Progressive Disclosure
 *
 * Handles smooth, progressive reveal of content when user interacts
 * with the page. Features:
 * - Click/tap anywhere to reveal
 * - Staggered animations for list items
 * - Backdrop blur effect
 * - Spring-based easing
 * - Toggle on/off functionality
 */

class ContentReveal {
  constructor() {
    this.overlay = document.querySelector('.content-overlay');
    this.main = document.querySelector('main');
    this.tapHint = document.querySelector('.tap-hint');
    this.isRevealed = false;
    this.animationInProgress = false;

    // Animation timing configuration
    this.staggerDelay = 60; // ms between list items
    this.itemDuration = 400; // ms per item
    this.easing = 'cubic-bezier(0.16, 1, 0.3, 1)'; // Apple-style ease-out-expo

    this.init();
  }

  init() {
    // Wait for wordmark animation to complete before enabling interaction
    setTimeout(() => {
      this.setupInteraction();
      this.showTapHint();
    }, 2500); // After wordmark animation
  }

  setupInteraction() {
    // Click anywhere to toggle content
    document.body.addEventListener('click', (e) => {
      // Prevent double-triggering during animation
      if (this.animationInProgress) return;

      this.toggleContent();
    });

    // Also support keyboard interaction (Space/Enter)
    document.body.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.animationInProgress) return;
        e.preventDefault();
        this.toggleContent();
      }
    });
  }

  showTapHint() {
    // Fade in the tap hint
    if (this.tapHint) {
      this.tapHint.style.opacity = '0.4';
    }
  }

  hideTapHint() {
    if (this.tapHint) {
      this.tapHint.style.opacity = '0';
    }
  }

  toggleContent() {
    if (this.isRevealed) {
      this.hideContent();
    } else {
      this.revealContent();
    }
  }

  revealContent() {
    this.animationInProgress = true;
    this.isRevealed = true;
    this.hideTapHint();

    // Phase 1: Fade out main content (wordmark)
    this.main.animate(
      [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.95)' }
      ],
      {
        duration: 400,
        easing: this.easing,
        fill: 'forwards'
      }
    );

    // Phase 2: Show overlay with backdrop blur (slight delay)
    setTimeout(() => {
      this.overlay.classList.add('visible');

      // Phase 3: Progressive reveal of content
      this.animateContentIn();
    }, 200);
  }

  animateContentIn() {
    const listItems = this.overlay.querySelectorAll('.content-list li');

    // Stagger animate list items
    listItems.forEach((item, index) => {
      const delay = 200 + (index * this.staggerDelay);

      item.animate(
        [
          { opacity: 0, transform: 'translateY(15px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: this.itemDuration,
          delay: delay,
          easing: this.easing,
          fill: 'forwards'
        }
      );
    });

    // Mark animation as complete
    const lastItemDelay = 200 + ((listItems.length - 1) * this.staggerDelay);
    setTimeout(() => {
      this.animationInProgress = false;
    }, lastItemDelay + this.itemDuration);
  }

  hideContent() {
    this.animationInProgress = true;
    this.isRevealed = false;

    const listItems = this.overlay.querySelectorAll('.content-list li');

    // Reverse animation - fade out all elements quickly
    listItems.forEach((element, index) => {
      element.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' }
        ],
        {
          duration: 300,
          delay: index * 20, // Faster reverse stagger
          easing: 'ease-in',
          fill: 'forwards'
        }
      );
    });

    // Hide overlay
    setTimeout(() => {
      this.overlay.classList.remove('visible');

      // Fade main content back in
      this.main.animate(
        [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        {
          duration: 400,
          easing: this.easing,
          fill: 'forwards'
        }
      );

      this.showTapHint();
      this.animationInProgress = false;
    }, 400);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContentReveal();
  });
} else {
  new ContentReveal();
}

/**
 * Usage Notes:
 *
 * This script creates an Apple-style progressive disclosure experience:
 * 1. User sees animated wordmark first
 * 2. "Tap anywhere" hint appears
 * 3. On tap/click, wordmark fades out with subtle scale
 * 4. Content overlay fades in with backdrop blur
 * 5. Content reveals progressively with stagger
 * 6. Click again to reverse and return to wordmark
 *
 * Motion characteristics:
 * - Spring-inspired easing (ease-out-expo)
 * - 60ms stagger between list items
 * - Backdrop blur for depth
 * - Subtle scale transforms
 * - All GPU-accelerated
 */
