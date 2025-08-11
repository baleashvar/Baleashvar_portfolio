import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Text3D, Float, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useXP } from '../context/XPContext'
import ParticleSystem from '../components/ParticleSystem'
import HologramMesh from '../components/HologramMaterial'
import PostProcessing from '../components/PostProcessing'
import * as THREE from 'three'

const Portal = () => {
  const meshRef = useRef()
  const innerRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -state.clock.elapsedTime * 0.8
      innerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={[0, 0, -5]}>
        {/* Outer portal ring */}
        <HologramMesh ref={meshRef}>
          <torusGeometry args={[4, 0.2, 16, 100]} />
        </HologramMesh>
        
        {/* Inner energy sphere */}
        <mesh ref={innerRef}>
          <Sphere args={[2, 32, 32]}>
            <MeshDistortMaterial
              color="#00f5ff"
              transparent
              opacity={0.3}
              distort={0.5}
              speed={2}
              roughness={0}
            />
          </Sphere>
        </mesh>
        
        {/* Portal particles */}
        <ParticleSystem count={1000} color="#00f5ff" />
        
        {/* Energy rings */}
        {[...Array(5)].map((_, i) => (
          <HologramMesh key={i} position={[0, 0, i * 0.5]}>
            <torusGeometry args={[3 + i * 0.3, 0.05, 8, 64]} />
          </HologramMesh>
        ))}
      </group>
    </Float>
  )
}

const QuantumField = () => {
  const fieldRef = useRef()
  
  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = state.clock.elapsedTime * 0.1
      fieldRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })
  
  return (
    <group ref={fieldRef}>
      {[...Array(20)].map((_, i) => (
        <HologramMesh 
          key={i} 
          position={[
            Math.sin(i * 0.5) * 15,
            Math.cos(i * 0.3) * 10,
            Math.sin(i * 0.8) * 20
          ]}
        >
          <octahedronGeometry args={[0.5]} />
        </HologramMesh>
      ))}
    </group>
  )
}

const SpaceDock = ({ onEnter }) => {
  const { addXP } = useXP()

  const handleEnter = () => {
    addXP(25)
    onEnter()
  }

  return (
    <div className="relative w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <Stars radius={500} depth={100} count={50000} factor={10} saturation={0} fade />
          
          <Portal />
          <QuantumField />
          <ParticleSystem count={3000} color="#8b5cf6" />
          
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00f5ff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
          <spotLight 
            position={[0, 20, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2} 
            color="#ffd700"
            castShadow
          />
          
          <PostProcessing />
        </Suspense>
      </Canvas>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        <motion.button
          onClick={handleEnter}
          className="text-4xl md:text-6xl font-bold text-neon-blue neon-text hover:text-neon-purple transition-colors duration-500 cursor-pointer bg-transparent border-none relative z-10"
          whileHover={{ 
            scale: 1.1,
            textShadow: "0 0 20px #00f5ff, 0 0 40px #00f5ff, 0 0 80px #00f5ff"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: [0, -15, 0],
            textShadow: [
              "0 0 10px #00f5ff",
              "0 0 30px #00f5ff, 0 0 60px #8b5cf6",
              "0 0 10px #00f5ff"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ENTER QUANTUM REALM
        </motion.button>
      </motion.div>
      
      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-900/10 to-black/50 pointer-events-none" />
    </div>
  )
}

export default SpaceDock