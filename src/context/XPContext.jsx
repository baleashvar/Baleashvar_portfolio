import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const XPContext = createContext()

export const useXP = () => {
  const context = useContext(XPContext)
  if (!context) throw new Error('useXP must be used within XPProvider')
  return context
}

export const XPProvider = ({ children }) => {
  const [xp, setXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [achievements, setAchievements] = useState([])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showAchievement, setShowAchievement] = useState(null)

  const addXP = useCallback((amount) => {
    setXP(prev => {
      const newXP = prev + amount
      const newLevel = Math.floor(newXP / 100) + 1
      
      if (newLevel > level) {
        setLevel(newLevel)
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 3000)
      }
      
      return newXP
    })
  }, [level])

  const unlockAchievement = useCallback((achievement) => {
    if (!achievements.find(a => a.id === achievement.id)) {
      setAchievements(prev => [...prev, achievement])
      setShowAchievement(achievement)
      setTimeout(() => setShowAchievement(null), 4000)
    }
  }, [achievements])

  return (
    <XPContext.Provider value={{ xp, level, achievements, addXP, unlockAchievement }}>
      {children}
      
      {/* XP Counter */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 border border-neon-blue rounded-lg p-3">
        <div className="text-neon-blue text-sm font-bold">Level {level}</div>
        <div className="text-white text-xs">{xp} XP</div>
        <div className="w-24 h-2 bg-gray-800 rounded-full mt-1">
          <div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
            style={{ width: `${(xp % 100)}%` }}
          />
        </div>
      </div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="text-6xl font-bold text-neon-gold neon-text">
              LEVEL UP!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-black/90 border border-neon-gold rounded-lg p-4 max-w-xs"
          >
            <div className="text-neon-gold font-bold">Achievement Unlocked!</div>
            <div className="text-white text-sm mt-1">{showAchievement.name}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </XPContext.Provider>
  )
}