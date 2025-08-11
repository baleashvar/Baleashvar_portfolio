import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useXP } from '../context/XPContext'

const Building = ({ position, height, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, height, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

const HolographicPanel = ({ position, children }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.7} />
      </mesh>
      <Text
        position={[position[0], position[1], position[2] + 0.01]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {children}
      </Text>
    </Float>
  )
}

const CyberCity = ({ onNext }) => {
  const { addXP, unlockAchievement } = useXP()

  useEffect(() => {
    addXP(15)
    unlockAchievement({ id: 'city_explorer', name: 'City Explorer' })
  }, [addXP, unlockAchievement])

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 5, 15], fov: 75 }}>
        {/* City Buildings */}
        {Array.from({ length: 20 }, (_, i) => (
          <Building
            key={i}
            position={[(i % 5 - 2) * 4, Math.random() * 3, (Math.floor(i / 5) - 2) * 4]}
            height={2 + Math.random() * 4}
            color={i % 2 ? "#1a1a2e" : "#16213e"}
          />
        ))}
        
        {/* Holographic Panels */}
        <HolographicPanel position={[-3, 3, 0]}>
          Full Stack Developer
        </HolographicPanel>
        <HolographicPanel position={[3, 4, -2]}>
          React & Node.js Expert
        </HolographicPanel>
        <HolographicPanel position={[0, 5, -4]}>
          3D Web Experiences
        </HolographicPanel>

        <ambientLight intensity={0.3} />
        <pointLight position={[0, 10, 0]} intensity={2} color="#00f5ff" />
        <fog attach="fog" args={["#000", 10, 50]} />
      </Canvas>

      <motion.div 
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={onNext}
          className="px-6 py-3 bg-transparent border-2 border-neon-blue text-neon-blue neon-border hover:bg-neon-blue hover:text-black transition-all duration-300"
        >
          Continue Journey
        </button>
      </motion.div>
    </div>
  )
}

export default CyberCity