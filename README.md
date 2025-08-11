# Baleashvar - Gamified 3D Portfolio

A cinematic, gamified personal portfolio built with React, Three.js, and GSAP, featuring Kubota-style camera transitions and immersive 3D scenes.

## 🚀 Features

- **5 Cinematic Scenes**: Space Dock, Cyber City, Hologram Deck, Floating Islands, Command Center
- **Gamification**: XP system, level progression, achievements, progress tracking
- **3D Graphics**: Three.js powered immersive environments
- **Smooth Transitions**: GSAP-based camera flythroughs
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Theme**: Neon blue/purple/gold color scheme
- **60 FPS Performance**: Optimized rendering and asset loading

## 🛠 Tech Stack

- **Frontend**: React 18, TailwindCSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: GSAP, Framer Motion
- **Routing**: React Router
- **Build Tool**: Vite
- **Deployment**: Netlify/Vercel ready

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Scene Overview

1. **Space Dock**: Starfield intro with glowing portal
2. **Cyber City**: Futuristic city with holographic about panels
3. **Hologram Deck**: Interactive skill pedestals with XP rewards
4. **Floating Islands**: 3D project showcases in space
5. **Command Center**: Holographic contact form terminal

## 🎯 Gamification Features

- **XP System**: Earn points by interacting with elements
- **Level Progression**: Visual level-up animations
- **Achievements**: Unlock badges for exploration
- **Progress Tracking**: Real-time XP counter and progress bar

## 🚀 Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy with Vercel CLI or GitHub integration
```

## 📱 Performance Optimizations

- Lazy loading for 3D assets
- Code splitting for animations and Three.js
- Mobile-optimized reduced-poly assets
- Efficient texture management
- 60 FPS target with performance monitoring

## 🎨 Customization

- Modify scenes in `src/scenes/`
- Update XP system in `src/context/XPContext.jsx`
- Customize animations in individual scene components
- Adjust camera transitions in `src/components/CameraController.jsx`

## 📄 License

MIT License - feel free to use for your own portfolio!