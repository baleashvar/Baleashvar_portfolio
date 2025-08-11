import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useXP } from '../context/XPContext'

const ProjectIsland = ({ position, project, onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={1}>
      <group position={position}>
        {/* Island Base */}
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? 1.1 : 1}
        >
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color={project.color} wireframe />
        </mesh>
        
        {/* Project Title */}
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {project.title}
        </Text>
        
        {/* Tech Stack */}
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.15}
          color="#00f5ff"
          anchorX="center"
          anchorY="middle"
        >
          {project.tech}
        </Text>
      </group>
    </Float>
  )
}

const FloatingIslands = ({ onNext }) => {
  const { addXP, unlockAchievement } = useXP()

  const projects = [
    {
      title: 'E-Commerce Platform',
      tech: 'React • Node.js • MongoDB',
      color: '#ff6b6b'
    },
    {
      title: '3D Portfolio',
      tech: 'Three.js • React • GSAP',
      color: '#4ecdc4'
    },
    {
      title: 'AI Chat Bot',
      tech: 'Python • TensorFlow • Flask',
      color: '#45b7d1'
    },
    {
      title: 'Mobile App',
      tech: 'React Native • Firebase',
      color: '#96ceb4'
    }
  ]

  const handleProjectClick = (project) => {
    addXP(10)
    unlockAchievement({ id: 'project_explorer', name: 'Project Explorer' })
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        {/* Sky gradient */}
        <mesh position={[0, 0, -20]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial color="#001122" />
        </mesh>

        {/* Projects arranged in 3D space */}
        {projects.map((project, index) => (
          <ProjectIsland
            key={project.title}
            position={[
              (index % 2 ? -4 : 4),
              (Math.floor(index / 2) - 0.5) * 4,
              index * -2
            ]}
            project={project}
            onClick={() => handleProjectClick(project)}
          />
        ))}

        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
        <fog attach="fog" args={["#001122", 5, 25]} />
      </Canvas>

      <motion.div 
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={onNext}
          className="px-6 py-3 bg-transparent border-2 border-neon-gold text-neon-gold neon-border hover:bg-neon-gold hover:text-black transition-all duration-300"
        >
          Contact Me
        </button>
      </motion.div>
    </div>
  )
}

export default FloatingIslands