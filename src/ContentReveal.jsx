import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContentReveal.css';

/**
 * ContentReveal Component - Apple-style Progressive Disclosure
 *
 * Features:
 * - Click/tap anywhere to reveal content
 * - Staggered animations with spring physics
 * - Backdrop blur effect
 * - Toggle functionality
 * - Accessible keyboard navigation
 */

const ContentReveal = ({ onToggle }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Show tap hint after wordmark animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const toggleContent = () => {
    setIsRevealed(!isRevealed);
    if (onToggle) onToggle(!isRevealed);
    if (showHint) setShowHint(false);
  };

  // Handle keyboard interaction
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        toggleContent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed]);

  // Spring physics configuration
  const springTransition = {
    type: "spring",
    stiffness: 70,
    damping: 15,
  };

  // Smooth ease-out-expo
  const smoothTransition = {
    duration: 0.4,
    ease: [0.16, 1, 0.3, 1],
  };

  // Overlay variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      WebkitBackdropFilter: 'blur(0px)',
    },
    visible: {
      opacity: 1,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }
    },
    exit: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      WebkitBackdropFilter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      }
    }
  };

  // Content item variants with stagger
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        ...smoothTransition,
        delay: 0.2 + (i * 0.06), // 60ms stagger, starting at 200ms
      }
    }),
    exit: (i) => ({
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        delay: i * 0.02, // Faster reverse
        ease: 'easeIn',
      }
    })
  };

  const disciplines = [
    'Design',
    'Architect',
    'Engineer',
  ];

  return (
    <>
      {/* Tap hint */}
      <AnimatePresence>
        {showHint && !isRevealed && (
          <motion.div
            className="tap-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Tap anywhere
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click capture overlay */}
      <div
        className="click-capture"
        onClick={toggleContent}
        style={{
          position: 'fixed',
          inset: 0,
          cursor: 'pointer',
          zIndex: isRevealed ? 100 : 10,
        }}
      />

      {/* Content overlay */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="content-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="content-text">
              {/* Disciplines list */}
              <ul className="content-list">
                {disciplines.map((discipline, index) => (
                  <motion.li
                    key={discipline}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {discipline}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContentReveal;
