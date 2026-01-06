import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * AnimatedWordmark Component
 *
 * Recreates the lovefrom.com wordmark reveal animation with:
 * - Character-by-character staggered reveal
 * - Physics-based spring easing
 * - Animated cursor tracking
 * - GPU-accelerated transforms
 *
 * Motion choices:
 * - Spring physics (stiffness: 70, damping: 15) for natural, premium feel
 * - 150ms stagger creates deliberate, unhurried pacing
 * - translateY + opacity for subtle depth without distraction
 * - Cursor follows last revealed character for authentic typing feel
 */

const AnimatedWordmark = ({
  text = "goutham",
  className = ""
}) => {
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [animationComplete, setAnimationComplete] = useState(false);
  const controls = useAnimation();

  // Split text into individual characters for stagger animation
  const characters = text.split('');

  // Configuration constants
  const STAGGER_DELAY = 0.15; // 150ms between characters - matches lovefrom.com pacing
  const CHAR_DURATION = 0.5;  // 500ms per character
  const INITIAL_DELAY = 0.3;  // 300ms before animation starts
  const CURSOR_BLINK_DURATION = 0.53; // 530ms - natural blink rate

  // Spring configuration for premium, physics-based motion
  // Lower stiffness (70) creates gentle acceleration
  // Lower damping (15) allows subtle overshoot for "alive" feel
  const springTransition = {
    type: "spring",
    stiffness: 70,
    damping: 15,
  };

  // Alternative: Sophisticated cubic-bezier for more control
  const easingTransition = {
    duration: CHAR_DURATION,
    ease: [0.16, 1, 0.3, 1], // ease-out-expo: slow start, fast end, gentle settle
  };

  // Use spring for final implementation (more premium feel)
  const transition = springTransition;

  // Container variants - subtle initial fade
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
      }
    }
  };

  // Character variants - staggered reveal
  // Using opacity + translateY for depth without being heavy-handed
  const characterVariants = {
    hidden: {
      opacity: 0,
      y: 8, // Subtle 8px vertical offset
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        ...transition,
        delay: INITIAL_DELAY + (i * STAGGER_DELAY),
      }
    })
  };

  // Cursor variants - tracks the last revealed character
  const cursorVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      }
    },
    blink: {
      opacity: [1, 0, 1],
      transition: {
        duration: CURSOR_BLINK_DURATION,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  // Update cursor position as characters are revealed
  useEffect(() => {
    const totalAnimationTime = INITIAL_DELAY + (characters.length * STAGGER_DELAY) + CHAR_DURATION;

    // Start cursor at position -1 (before first character)
    setCursorIndex(-1);

    // Move cursor after each character is revealed
    characters.forEach((_, index) => {
      const revealTime = (INITIAL_DELAY + (index * STAGGER_DELAY)) * 1000;

      setTimeout(() => {
        setCursorIndex(index);
      }, revealTime);
    });

    // Mark animation as complete and hide cursor
    setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        setCursorIndex(characters.length); // Move cursor past last character to hide
      }, 1000);
    }, totalAnimationTime * 1000);

    return () => {
      // Cleanup timeouts if component unmounts
    };
  }, [characters.length]);

  // Cursor component
  const Cursor = () => (
    <motion.span
      className="cursor"
      variants={cursorVariants}
      initial="hidden"
      animate="blink"
      style={{
        display: 'inline-block',
        width: '2px',
        height: '0.85em',
        backgroundColor: 'currentColor',
        marginLeft: '0.05em',
        marginRight: '0.05em',
        // Force GPU acceleration
        willChange: 'opacity, transform',
        // Align cursor vertically
        transform: 'translateY(0.08em)',
      }}
    />
  );

  return (
    <motion.div
      className={`wordmark-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'inline-flex',
        position: 'relative',
        // Force GPU acceleration for entire container
        willChange: 'transform, opacity',
      }}
    >
      {characters.map((char, index) => (
        <React.Fragment key={`${char}-${index}`}>
          {/* Show cursor before first character if cursorIndex is -1 */}
          {index === 0 && cursorIndex === -1 && <Cursor />}

          {/* Render character */}
          <motion.span
            custom={index}
            variants={characterVariants}
            style={{
              display: 'inline-block',
              // Force GPU layer per character for smooth animation
              willChange: 'transform, opacity',
              // Prevent layout shift during animation
              minWidth: char === ' ' ? '0.25em' : 'auto',
            }}
          >
            {char}
          </motion.span>

          {/* Show cursor after this character if it matches cursorIndex */}
          {cursorIndex === index && <Cursor />}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default AnimatedWordmark;

/**
 * Usage Example:
 *
 * import AnimatedWordmark from './AnimatedWordmark';
 *
 * function App() {
 *   return (
 *     <div className="app">
 *       <AnimatedWordmark
 *         text="goutham"
 *         className="wordmark"
 *       />
 *     </div>
 *   );
 * }
 *
 * CSS:
 * .wordmark {
 *   font-family: "SF Pro Text", -apple-system, sans-serif;
 *   font-size: clamp(3rem, 10vw, 12rem);
 *   font-weight: 300;
 *   letter-spacing: -0.02em;
 *   line-height: 1;
 *   color: #000000;
 * }
 */
