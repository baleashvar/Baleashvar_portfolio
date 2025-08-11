import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Environment, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useXP } from '../context/XPContext'
import QuantumSkills from '../components/QuantumSkills'
import ParticleSystem from '../components/ParticleSystem'
import HologramMesh from '../components/HologramMaterial'
import PostProcessing from '../components/PostProcessing'
import * as THREE from 'three'

const QuantumChamber = () => {
  const chamberRef = useRef()
  
  useFrame((state) => {
    if (chamberRef.current) {
      chamberRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <group ref={chamberRef}>
      {/* Chamber walls */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <HologramMesh 
            key={i}
            position={[
              Math.cos(angle) * 12,
              0,
              Math.sin(angle) * 12
            ]}
            rotation={[0, angle, 0]}
          >
            <planeGeometry args={[3, 15]} />
          </HologramMesh>
        )
      })}
      
      {/* Floor pattern */}
      <mesh position={[0, -7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 15, 64]} />
        <meshPhysicalMaterial 
          color="#001122"
          metalness={0.9}
          roughness={0.1}
          emissive="#003366"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Ceiling energy field */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 15, 64]} />
        <meshBasicMaterial 
          color="#8b5cf6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

const EnergyBeams = ({ activeSkills }) => {
  const beamsRef = useRef()
  
  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.children.forEach((beam, i) => {
        beam.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3
      })
    }
  })
  
  return (
    <group ref={beamsRef}>
      {activeSkills.map((skill, i) => (
        <mesh key={skill} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 20]} />
          <meshBasicMaterial 
            color="#ffd700"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

const HologramDeck = ({ onNext }) => {
  const { addXP, unlockAchievement } = useXP()
  const [xpPopups, setXpPopups] = useState([])
  const [activeSkills, setActiveSkills] = useState([])
  const [totalInteractions, setTotalInteractions] = useState(0)

  const handleSkillClick = (skill) => {
    addXP(15)
    setTotalInteractions(prev => prev + 1)
    
    // Add skill to active list
    setActiveSkills(prev => {
      if (!prev.includes(skill.name)) {
        return [...prev, skill.name]
      }
      return prev
    })
    
    // Create XP popup
    const id = Date.now()
    setXpPopups(prev => [...prev, { 
      id, 
      skill: skill.name, 
      xp: 15,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    }])
    
    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== id))
    }, 3000)
    
    // Unlock achievements
    if (totalInteractions === 2) {
      unlockAchievement({ id: 'skill_seeker', name: 'Skill Seeker' })
    }
    if (activeSkills.length >= 5) {
      unlockAchievement({ id: 'quantum_master', name: 'Quantum Master' })
    }
    if (totalInteractions >= 10) {
      unlockAchievement({ id: 'neural_architect', name: 'Neural Architect' })
    }
  }

  return (
    <div className="relative w-full h-full">
      <Canvas 
        camera={{ position: [0, 3, 12], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          
          <QuantumChamber />
          <QuantumSkills 
            onSkillClick={handleSkillClick}
            activeSkills={activeSkills}
          />
          <EnergyBeams activeSkills={activeSkills} />
          
          {/* Ambient effects */}
          <ParticleSystem count={2000} color="#8b5cf6" />
          <Sparkles 
            count={100}
            scale={[20, 20, 20]}
            size={3}
            speed={0.4}
            color="#ffd700"
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 8, 0]} intensity={3} color="#8b5cf6" castShadow />
          <pointLight position={[5, 0, 5]} intensity={2} color="#00f5ff" />
          <pointLight position={[-5, 0, -5]} intensity={2} color="#ffd700" />
          
          {/* Volumetric lighting */}
          <spotLight
            position={[0, 15, 0]}
            angle={Math.PI / 3}
            penumbra={1}
            intensity={5}
            color="#8b5cf6"
            castShadow
          />
          
          <PostProcessing />
        </Suspense>
      </Canvas>

      {/* Enhanced XP Popups */}
      <AnimatePresence>
        {xpPopups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ 
              opacity: 0, 
              y: 0, 
              scale: 0.5,
              x: popup.position.x + '%',
              y: popup.position.y + '%'
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: -100, 
              scale: [0.5, 1.2, 1, 0.8],
              rotate: [0, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute text-neon-gold text-3xl font-bold pointer-events-none z-10"
            style={{
              textShadow: '0 0 20px #ffd700, 0 0 40px #ffd700',
              left: popup.position.x + '%',
              top: popup.position.y + '%'
            }}
          >
            +{popup.xp} QUANTUM XP
            <div className="text-sm text-neon-blue mt-1">
              {popup.skill} MASTERED
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Skill counter */}
      <motion.div 
        className="absolute top-8 left-8 bg-black/80 border border-neon-purple rounded-lg p-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-neon-purple font-bold">QUANTUM SKILLS</div>
        <div className="text-white text-sm">{activeSkills.length}/8 Activated</div>
        <div className="text-neon-gold text-xs">{totalInteractions} Neural Links</div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <motion.button
          onClick={onNext}
          className="px-8 py-4 bg-transparent border-2 border-neon-purple text-neon-purple neon-border hover:bg-neon-purple hover:text-black transition-all duration-500 text-lg font-bold"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 30px #8b5cf6"
          }}
          whileTap={{ scale: 0.95 }}
          disabled={activeSkills.length < 3}
        >
          {activeSkills.length >= 3 ? 'ENTER PROJECT DIMENSION' : `ACTIVATE ${3 - activeSkills.length} MORE SKILLS`}
        </motion.button>
      </motion.div>
      
      {/* Quantum field overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-blue-900/30 pointer-events-none" />
    </div>
  )
}

export default HologramDeck