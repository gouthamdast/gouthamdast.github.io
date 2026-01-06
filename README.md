# Goutham's Portfolio

A minimalist portfolio website with premium character-by-character reveal animation inspired by [lovefrom.com](https://www.lovefrom.com/).

## Features

- **Premium Animation**: Character-by-character wordmark reveal with physics-based motion
- **Minimalist Design**: Centered wordmark with clean, spacious layout
- **SF Pro Text**: Apple's San Francisco font family for elegant typography
- **Spring Physics**: Natural acceleration and deceleration (not robotic)
- **Animated Cursor**: Tracks character reveals during animation sequence
- **60fps Performance**: GPU-accelerated transforms for buttery smooth motion
- **Responsive**: Adapts beautifully to mobile, tablet, and desktop
- **Accessibility**: Respects `prefers-reduced-motion` for users with vestibular disorders

## Animation Showcase

The wordmark uses sophisticated animation techniques:
- **Staggered Reveal**: 150ms offset between characters (premium pacing)
- **Spring Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for natural feel
- **Subtle Transforms**: 8px vertical drift + opacity fade (not over-the-top)
- **Cursor Tracking**: Animated cursor follows text reveal
- **Total Duration**: ~8.4 seconds (matches lovefrom.com reference)

See [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) for detailed motion system documentation.

## Implementation Options

### Option 1: React + Framer Motion ⭐ Recommended

Best animation quality with superior spring physics.

**Quick Start:**
```bash
npm install
npm run dev
```

**Build for Production:**
```bash
npm run build
```

**Deploy to GitHub Pages:**
- Push to `main` branch
- GitHub Actions automatically builds and deploys
- See `.github/workflows/deploy.yml`

**Files:**
- `src/AnimatedWordmark.jsx` - Animation component
- `src/App.jsx` - Main app
- `index-react.html` - HTML entry

**Pros:**
- Best motion quality (exact lovefrom.com feel)
- Easy to modify and extend
- Built-in performance optimizations

**Cons:**
- Requires Node.js and build step
- Larger bundle (~100KB)

### Option 2: Vanilla JavaScript

No dependencies, works immediately.

**Quick Start:**
```bash
# Option A: Open directly
open index-vanilla.html

# Option B: Use local server
python3 -m http.server 3000
# Visit: http://localhost:3000/index-vanilla.html
```

**Deploy to GitHub Pages:**
```bash
cp index-vanilla.html index.html
git add index.html vanilla-animation.js
git commit -m "Deploy vanilla version"
git push origin main
```

**Files:**
- `vanilla-animation.js` - Animation class with Web Animations API
- `index-vanilla.html` - Complete standalone page

**Pros:**
- No build step required
- Small file size (~5KB)
- Easy to understand

**Cons:**
- Slightly less smooth physics
- More manual animation orchestration

## Tech Stack

### React Version
- React 18
- Framer Motion 11
- Vite 5 (build tool)
- SF Pro Text (system font)

### Vanilla Version
- HTML5
- CSS3
- Web Animations API
- SF Pro Text (system font)

## Performance

- **60fps**: GPU-accelerated `transform` and `opacity`
- **Optimized**: Only composited properties (no layout thrashing)
- **Lazy**: Animations triggered after initial page load
- **Accessible**: Honors `prefers-reduced-motion`

## Customization

Edit timing in `AnimatedWordmark.jsx` (React) or `vanilla-animation.js`:

```javascript
// Faster animation
staggerDelay: 100,  // ms between characters
charDuration: 400,  // ms per character

// Slower, more dramatic
staggerDelay: 200,
charDuration: 700,
```

See [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) for more options.

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS 12+
- Android 5+

## Live Demo

**https://gouthamdast.github.io**

## Project Structure

```
portfolio/
├── src/                          # React version source
│   ├── AnimatedWordmark.jsx      # Animation component
│   ├── App.jsx                   # Main app
│   ├── App.css                   # Styles
│   └── main.jsx                  # Entry point
├── index-react.html              # React HTML template
├── index-vanilla.html            # Vanilla standalone page
├── vanilla-animation.js          # Vanilla animation class
├── package.json                  # Dependencies
├── vite.config.js                # Build config
├── ANIMATION_GUIDE.md            # Motion system docs
└── .github/workflows/deploy.yml  # Auto-deployment
```

## Documentation

- **[ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md)**: Complete motion system documentation
  - Animation analysis
  - Easing functions
  - Customization guide
  - Performance optimization
  - Troubleshooting

## Design Philosophy

### Why This Animation?

1. **Premium Feel**: Slow, deliberate pacing signals confidence
2. **Natural Motion**: Spring physics feel alive, not mechanical
3. **Subtle Transforms**: Restraint = sophistication
4. **Intentional Rhythm**: Stagger creates visual cadence
5. **Memorable**: First impression that lingers

### Motion Principles

- Physics over keyframes
- Composited properties only
- Minimal but intentional
- Respects user preferences
- 60fps non-negotiable

## Credits

- **Animation Style**: Inspired by [lovefrom.com](https://www.lovefrom.com/)
- **Implementation**: Custom-built for motion quality
- **Typography**: SF Pro Text (Apple San Francisco)
- **Built by**: Goutham
