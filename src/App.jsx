import React from 'react';
import AnimatedWordmark from './AnimatedWordmark';
import './App.css';

/**
 * Main App Component
 *
 * Minimalist portfolio featuring premium animated wordmark
 * inspired by lovefrom.com
 */

function App() {
  return (
    <div className="app">
      <main className="main">
        <AnimatedWordmark
          text="goutham"
          className="wordmark"
        />
      </main>
    </div>
  );
}

export default App;
