import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'

const CameraController = ({ targetPosition, targetLookAt, duration = 2, onComplete }) => {
  const { camera } = useThree()
  const lookAtRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    if (targetPosition) {
      const tl = gsap.timeline({
        onComplete: () => onComplete?.()
      })

      tl.to(camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration,
        ease: "power2.inOut"
      })

      if (targetLookAt) {
        tl.to(lookAtRef.current, {
          x: targetLookAt[0],
          y: targetLookAt[1],
          z: targetLookAt[2],
          duration,
          ease: "power2.inOut"
        }, 0)
      }
    }
  }, [targetPosition, targetLookAt, duration, camera, onComplete])

  useFrame(() => {
    if (targetLookAt) {
      camera.lookAt(lookAtRef.current.x, lookAtRef.current.y, lookAtRef.current.z)
    }
  })

  return null
}

export default CameraController