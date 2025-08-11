import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const HologramMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00f5ff'),
    intensity: 1.0,
    opacity: 0.8
  },
  // Vertex shader
  `
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      vec3 pos = position;
      float wave = sin(pos.y * 10.0 + time * 2.0) * 0.1 * intensity;
      pos.x += wave;
      pos.z += wave * 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vec2 uv = vUv;
      
      float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;
      float glitch = step(0.98, sin(time * 50.0)) * 0.1;
      uv.x += glitch * (sin(time * 100.0) * 0.01);
      
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = 1.0 - dot(vNormal, viewDirection);
      fresnel = pow(fresnel, 2.0);
      
      vec3 finalColor = color + scanline;
      float alpha = opacity * fresnel;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

export default function HologramMesh({ children, ...props }) {
  const materialRef = useRef()
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime
    }
  })

  return (
    <mesh {...props}>
      {children}
      <hologramMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

export { HologramMaterial }