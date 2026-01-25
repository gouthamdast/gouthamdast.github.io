/**
 * Content Reveal - Apple-style Progressive Disclosure with GSAP
 *
 * Handles smooth, progressive reveal of content when user interacts
 * with the page. Features:
 * - Click/tap anywhere to reveal
 * - Staggered animations for list items
 * - Backdrop blur effect
 * - Spring-based easing with GSAP
 * - Toggle on/off functionality
 */

import gsap from 'gsap';

class ContentReveal {
  constructor() {
    this.overlay = document.querySelector('.content-overlay');
    this.main = document.querySelector('main');
    this.tapHint = document.querySelector('.tap-hint');
    this.isRevealed = false;
    this.animationInProgress = false;

    // Animation timing configuration
    this.staggerDelay = 0.06; // seconds between list items
    this.itemDuration = 0.4; // seconds per item

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
      gsap.to(this.tapHint, {
        opacity: 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  hideTapHint() {
    if (this.tapHint) {
      gsap.to(this.tapHint, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
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

    // Create master timeline for coordinated animation
    const tl = gsap.timeline({
      onComplete: () => {
        this.animationInProgress = false;
      }
    });

    // Phase 1: Fade out main content (wordmark)
    tl.to(this.main, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'expo.out'
    }, 0);

    // Phase 2: Show overlay with backdrop blur (slight delay)
    tl.add(() => {
      this.overlay.classList.add('visible');
    }, 0.2);

    // Phase 3: Progressive reveal of content
    tl.add(() => this.animateContentIn(), 0.4);
  }

  animateContentIn() {
    const listItems = this.overlay.querySelectorAll('.content-list li');

    // Stagger animate list items using GSAP's built-in stagger
    gsap.fromTo(listItems,
      {
        opacity: 0,
        y: 15
      },
      {
        opacity: 1,
        y: 0,
        duration: this.itemDuration,
        stagger: this.staggerDelay,
        ease: 'expo.out', // Apple-style spring easing
        delay: 0.2
      }
    );
  }

  hideContent() {
    this.animationInProgress = true;
    this.isRevealed = false;

    const listItems = this.overlay.querySelectorAll('.content-list li');

    // Create timeline for hide animation
    const tl = gsap.timeline({
      onComplete: () => {
        this.animationInProgress = false;
      }
    });

    // Reverse animation - fade out all elements quickly with stagger
    tl.to(listItems, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      stagger: 0.02, // Faster reverse stagger
      ease: 'power2.in'
    }, 0);

    // Hide overlay
    tl.add(() => {
      this.overlay.classList.remove('visible');
    }, 0.4);

    // Fade main content back in
    tl.to(this.main, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'expo.out'
    }, 0.4);

    // Show tap hint again
    tl.add(() => this.showTapHint(), 0.6);
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
 * Motion characteristics powered by GSAP:
 * - Spring-inspired easing (expo.out)
 * - 60ms stagger between list items
 * - Backdrop blur for depth
 * - Subtle scale transforms
 * - All GPU-accelerated via GSAP
 */

export default ContentReveal;
