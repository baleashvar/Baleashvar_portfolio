import { EffectComposer, Bloom, ChromaticAberration, Glitch, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom 
        intensity={0.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        height={300}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.002, 0.002]}
      />
      <Glitch
        delay={[1.5, 3.5]}
        duration={[0.6, 1.0]}
        strength={[0.3, 1.0]}
        mode={GlitchMode.SPORADIC}
        active
        ratio={0.85}
      />
      <Noise opacity={0.02} />
      <Vignette
        offset={0.1}
        darkness={0.5}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}