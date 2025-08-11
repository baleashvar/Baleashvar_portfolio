import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleSystem({ count = 5000, color = '#00f5ff' }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        ],
        velocity: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ],
        scale: Math.random() * 0.5 + 0.1
      })
    }
    return temp
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      particle.position[0] += particle.velocity[0]
      particle.position[1] += particle.velocity[1]
      particle.position[2] += particle.velocity[2]
      
      // Wrap around
      if (Math.abs(particle.position[0]) > 50) particle.position[0] *= -1
      if (Math.abs(particle.position[1]) > 50) particle.position[1] *= -1
      if (Math.abs(particle.position[2]) > 50) particle.position[2] *= -1
      
      dummy.position.set(...particle.position)
      dummy.scale.setScalar(particle.scale * (1 + Math.sin(state.clock.elapsedTime + i) * 0.3))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  )
}