import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useXP } from '../context/XPContext'

const SkillPedestal = ({ position, skill, onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <group position={position}>
        {/* Pedestal */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 0.3, 8]} />
          <meshBasicMaterial color="#1a1a2e" />
        </mesh>
        
        {/* Skill Icon */}
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? 1.2 : 1}
        >
          <icosahedronGeometry args={[0.8]} />
          <meshBasicMaterial color={skill.color} wireframe />
        </mesh>
        
        {/* Skill Label */}
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </group>
    </Float>
  )
}

const HologramDeck = ({ onNext }) => {
  const { addXP } = useXP()
  const [xpPopups, setXpPopups] = useState([])

  const skills = [
    { name: 'React', color: '#61dafb' },
    { name: 'Node.js', color: '#68a063' },
    { name: 'Three.js', color: '#000000' },
    { name: 'Python', color: '#3776ab' },
    { name: 'MongoDB', color: '#47a248' },
    { name: 'AWS', color: '#ff9900' }
  ]

  const handleSkillClick = (skill) => {
    addXP(5)
    const id = Date.now()
    setXpPopups(prev => [...prev, { id, skill: skill.name }])
    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== id))
    }, 2000)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
        {/* Room */}
        <mesh position={[0, 0, -5]}>
          <cylinderGeometry args={[8, 8, 0.1, 32]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>

        {/* Skills arranged in circle */}
        {skills.map((skill, index) => {
          const angle = (index / skills.length) * Math.PI * 2
          const radius = 3
          return (
            <SkillPedestal
              key={skill.name}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              skill={skill}
              onClick={() => handleSkillClick(skill)}
            />
          )
        })}

        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#8b5cf6" />
      </Canvas>

      {/* XP Popups */}
      <AnimatePresence>
        {xpPopups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neon-gold text-2xl font-bold pointer-events-none"
          >
            +5 XP
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div 
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <button
          onClick={onNext}
          className="px-6 py-3 bg-transparent border-2 border-neon-purple text-neon-purple neon-border hover:bg-neon-purple hover:text-black transition-all duration-300"
        >
          View Projects
        </button>
      </motion.div>
    </div>
  )
}

export default HologramDeck