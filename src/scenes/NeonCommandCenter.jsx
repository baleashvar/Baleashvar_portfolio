import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useXP } from '../context/XPContext'

const Terminal = () => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.emissive.setHex(
        Math.sin(state.clock.elapsedTime * 2) > 0 ? 0x003366 : 0x001122
      )
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, -2]}>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshBasicMaterial color="#001122" />
      </mesh>
    </Float>
  )
}

const NeonCommandCenter = () => {
  const { addXP, unlockAchievement } = useXP()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addXP(25)
    unlockAchievement({ id: 'mission_complete', name: 'Mission Complete!' })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <Terminal />
        
        <Text
          position={[0, 2.5, -1.9]}
          fontSize={0.4}
          color="#00f5ff"
          anchorX="center"
          anchorY="middle"
        >
          CONTACT TERMINAL
        </Text>

        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#00f5ff" />
        <pointLight position={[-5, 5, 5]} intensity={1} color="#8b5cf6" />
        <pointLight position={[5, -5, 5]} intensity={1} color="#ffd700" />
      </Canvas>

      {/* Contact Form Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-black/80 border border-neon-blue rounded-lg p-8 max-w-md w-full mx-4 neon-border"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-transparent border border-neon-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:border-neon-purple outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-transparent border border-neon-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:border-neon-purple outline-none"
              required
            />
            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full bg-transparent border border-neon-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:border-neon-purple outline-none h-24 resize-none"
              required
            />
            <motion.button
              type="submit"
              className="w-full bg-transparent border-2 border-neon-gold text-neon-gold py-3 rounded neon-border hover:bg-neon-gold hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SEND MESSAGE
            </motion.button>
          </div>
        </motion.form>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/90 z-50"
          >
            <div className="text-center">
              <motion.div
                className="text-6xl font-bold text-neon-gold neon-text mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                MISSION COMPLETE!
              </motion.div>
              <div className="text-xl text-white">Message sent successfully</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NeonCommandCenter