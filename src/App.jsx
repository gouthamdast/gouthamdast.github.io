import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedWordmark from './AnimatedWordmark';
import ContentReveal from './ContentReveal';
import './App.css';

/**
 * Main App Component
 *
 * Minimalist portfolio featuring premium animated wordmark
 * with Apple-style progressive content reveal
 */

function App() {
  const [isContentRevealed, setIsContentRevealed] = useState(false);

  const mainVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }
    },
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  return (
    <div className="app">
      <motion.main
        className="main"
        variants={mainVariants}
        initial="visible"
        animate={isContentRevealed ? 'hidden' : 'visible'}
      >
        <AnimatedWordmark
          text="goutham"
          className="wordmark"
        />
      </motion.main>

      <ContentReveal onToggle={setIsContentRevealed} />
    </div>
  );
}

export default App;
