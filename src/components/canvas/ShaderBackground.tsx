"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const PARTICLE_COUNT = 300

// Generate static particle data once at module load — keeps component pure
function buildParticleData() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const phases = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    positions[i3]     = (Math.random() - 0.5) * 10
    positions[i3 + 1] = (Math.random() - 0.5) * 6
    positions[i3 + 2] = (Math.random() - 0.5) * 4

    const t = Math.random()
    colors[i3]     = 0.1 + t * 0.15
    colors[i3 + 1] = 0.7 + t * 0.3
    colors[i3 + 2] = 0.7 + (1 - t) * 0.3

    phases[i] = Math.random() * Math.PI * 2
  }

  return { positions, colors, phases }
}

const particleData = buildParticleData()

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const positionAttrRef = useRef<THREE.BufferAttribute>(null)

  useFrame(({ clock }) => {
    if (!positionAttrRef.current) return
    const t = clock.getElapsedTime()
    const arr = positionAttrRef.current.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const phase = particleData.phases[i]
      const speed = 0.08 + (i % 5) * 0.008

      arr[i3]     += Math.sin(t * speed + phase) * 0.002
      arr[i3 + 1] += Math.cos(t * speed + phase * 1.3) * 0.002
    }

    positionAttrRef.current.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={positionAttrRef}
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function ShaderBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ParticleField />
      </Canvas>
    </div>
  )
}
