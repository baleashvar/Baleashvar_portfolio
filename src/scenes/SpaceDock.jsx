import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Text3D, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useXP } from '../context/XPContext'

const Portal = () => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <torusGeometry args={[3, 0.1, 16, 100]} />
        <meshBasicMaterial color="#00f5ff" />
      </mesh>
    </Float>
  )
}

const SpaceDock = ({ onEnter }) => {
  const { addXP } = useXP()

  const handleEnter = () => {
    addXP(10)
    onEnter()
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
        <Portal />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      </Canvas>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.button
          onClick={handleEnter}
          className="text-4xl md:text-6xl font-bold text-neon-blue neon-text hover:text-neon-purple transition-colors duration-300 cursor-pointer bg-transparent border-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ENTER PORTFOLIO
        </motion.button>
      </motion.div>
    </div>
  )
}

export default SpaceDock