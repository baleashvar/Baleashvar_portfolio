import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Environment, Cloud, Sky } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useXP } from '../context/XPContext'
import AdvancedCity from '../components/AdvancedCity'
import ParticleSystem from '../components/ParticleSystem'
import HologramMesh from '../components/HologramMaterial'
import PostProcessing from '../components/PostProcessing'
import * as THREE from 'three'

const HolographicPanel = ({ position, children, scale = 1 }) => {
  const meshRef = useRef()
  const textRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
    if (textRef.current) {
      textRef.current.material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} scale={scale}>
        <HologramMesh ref={meshRef}>
          <planeGeometry args={[6, 4]} />
        </HologramMesh>
        
        {/* Holographic frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(6.2, 4.2)]} />
          <lineBasicMaterial color="#00f5ff" />
        </lineSegments>
        
        <Text
          ref={textRef}
          position={[0, 0, 0.01]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/orbitron.woff"
        >
          {children}
        </Text>
        
        {/* Data particles around panel */}
        <ParticleSystem count={100} color="#00f5ff" />
      </group>
    </Float>
  )
}

const QuantumClouds = () => {
  return (
    <group>
      {[...Array(8)].map((_, i) => (
        <Cloud
          key={i}
          position={[
            Math.sin(i * 0.8) * 30,
            15 + Math.cos(i * 0.6) * 5,
            Math.cos(i * 0.8) * 30
          ]}
          speed={0.2}
          opacity={0.3}
          color="#00f5ff"
          segments={20}
        />
      ))}
    </group>
  )
}

const NeuralNetwork = () => {
  const networkRef = useRef()
  
  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const nodes = useMemo(() => {
    const temp = []
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 40,
          Math.random() * 20,
          (Math.random() - 0.5) * 40
        ],
        connections: Math.floor(Math.random() * 3) + 1
      })
    }
    return temp
  }, [])
  
  return (
    <group ref={networkRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <HologramMesh>
            <sphereGeometry args={[0.2, 8, 8]} />
          </HologramMesh>
          
          {/* Neural connections */}
          {[...Array(node.connections)].map((_, j) => {
            const target = nodes[(i + j + 1) % nodes.length]
            return (
              <line key={j}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      0, 0, 0,
                      target.position[0] - node.position[0],
                      target.position[1] - node.position[1],
                      target.position[2] - node.position[2]
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
              </line>
            )
          })}
        </group>
      ))}
    </group>
  )
}

const CyberCity = ({ onNext }) => {
  const { addXP, unlockAchievement } = useXP()

  useEffect(() => {
    addXP(30)
    unlockAchievement({ id: 'cyber_architect', name: 'Cyber Architect' })
    unlockAchievement({ id: 'neural_navigator', name: 'Neural Navigator' })
  }, [addXP, unlockAchievement])

  return (
    <div className="relative w-full h-full">
      <Canvas 
        camera={{ position: [0, 8, 20], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <Sky 
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          
          <AdvancedCity />
          <NeuralNetwork />
          <QuantumClouds />
          <ParticleSystem count={2000} color="#8b5cf6" />
          
          {/* Enhanced Holographic Panels */}
          <HolographicPanel position={[-8, 6, 5]} scale={1.2}>
            QUANTUM DEVELOPER\nFULL STACK ARCHITECT
          </HolographicPanel>
          <HolographicPanel position={[8, 8, -3]} scale={1.1}>
            NEURAL NETWORKS\nAI INTEGRATION
          </HolographicPanel>
          <HolographicPanel position={[0, 12, -8]} scale={1.3}>
            IMMERSIVE 3D\nREALITY ENGINEER
          </HolographicPanel>
          <HolographicPanel position={[-12, 4, -5]} scale={0.9}>
            BLOCKCHAIN\nWEB3 PIONEER
          </HolographicPanel>

          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1} 
            color="#00f5ff"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 15, 0]} intensity={3} color="#00f5ff" />
          <pointLight position={[-20, 10, 20]} intensity={2} color="#8b5cf6" />
          <pointLight position={[20, 10, -20]} intensity={2} color="#ffd700" />
          
          <fog attach="fog" args={["#000011", 20, 100]} />
          
          <PostProcessing />
        </Suspense>
      </Canvas>

      <motion.div 
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          onClick={onNext}
          className="px-8 py-4 bg-transparent border-2 border-neon-blue text-neon-blue neon-border hover:bg-neon-blue hover:text-black transition-all duration-500 text-lg font-bold"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 30px #00f5ff"
          }}
          whileTap={{ scale: 0.95 }}
        >
          ENTER NEURAL MATRIX
        </motion.button>
      </motion.div>
      
      {/* Cyberpunk overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-purple-900/30 pointer-events-none" />
    </div>
  )
}

export default CyberCity