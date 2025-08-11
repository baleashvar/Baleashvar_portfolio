import React, { useState, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { XPProvider } from './context/XPContext'
import SpaceDock from './scenes/SpaceDock'
import CyberCity from './scenes/CyberCity'
import HologramDeck from './scenes/HologramDeck'
import FloatingIslands from './scenes/FloatingIslands'
import NeonCommandCenter from './scenes/NeonCommandCenter'

const LoadingScreen = () => (
  <div className="w-full h-full flex items-center justify-center bg-black">
    <div className="text-neon-blue text-2xl neon-text animate-pulse">
      Loading...
    </div>
  </div>
)

function App() {
  const [currentScene, setCurrentScene] = useState(0)

  const scenes = [
    { component: SpaceDock, name: 'Space Dock' },
    { component: CyberCity, name: 'Cyber City' },
    { component: HologramDeck, name: 'Hologram Deck' },
    { component: FloatingIslands, name: 'Floating Islands' },
    { component: NeonCommandCenter, name: 'Command Center' }
  ]

  const nextScene = () => {
    setCurrentScene(prev => (prev + 1) % scenes.length)
  }

  const CurrentSceneComponent = scenes[currentScene].component

  return (
    <Router>
      <XPProvider>
        <div className="w-full h-screen bg-black overflow-hidden">
          <Suspense fallback={<LoadingScreen />}>
            <CurrentSceneComponent 
              onEnter={nextScene}
              onNext={nextScene}
            />
          </Suspense>
          
          {/* Global quantum effects */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-conic from-blue-900/10 via-purple-900/5 to-cyan-900/10 animate-spin" style={{ animationDuration: '60s' }} />
          </div>
          
          {/* Scene Navigation */}
          <div className="fixed bottom-4 left-4 z-50 flex space-x-2">
            {scenes.map((scene, index) => (
              <button
                key={scene.name}
                onClick={() => setCurrentScene(index)}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  index === currentScene 
                    ? 'bg-neon-blue border-neon-blue' 
                    : 'bg-transparent border-gray-600 hover:border-neon-blue'
                }`}
                title={scene.name}
              />
            ))}
          </div>
        </div>
      </XPProvider>
    </Router>
  )
}

export default App