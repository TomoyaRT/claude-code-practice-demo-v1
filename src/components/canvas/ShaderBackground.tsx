"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const FIREFLY_COUNT = 120

interface Firefly {
  position: THREE.Vector3
  velocity: THREE.Vector3
  opacity: number
  targetOpacity: number
  blinkSpeed: number
  blinkTimer: number
  blinkInterval: number
  size: number
  colorR: number
  colorG: number
  colorB: number
}

function buildFireflies(): Firefly[] {
  const flies: Firefly[] = []
  for (let i = 0; i < FIREFLY_COUNT; i++) {
    const bright = Math.random() > 0.3
    flies.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 3
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.003,
        0
      ),
      opacity: Math.random() * 0.5,
      targetOpacity: bright ? 0.7 + Math.random() * 0.3 : 0,
      blinkSpeed: 0.6 + Math.random() * 1.4,
      blinkTimer: 0,
      blinkInterval: 0.5 + Math.random() * 3.0,
      size: 0.025 + Math.random() * 0.05,
      colorR: 0.55 + Math.random() * 0.25,
      colorG: 0.85 + Math.random() * 0.15,
      colorB: 0.2 + Math.random() * 0.3,
    })
  }
  return flies
}

function FireflyField() {
  const pointsRef = useRef<THREE.Points>(null)
  const fireflies = useMemo(() => buildFireflies(), [])

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(FIREFLY_COUNT * 3)
    const colors = new Float32Array(FIREFLY_COUNT * 3)
    const sizes = new Float32Array(FIREFLY_COUNT)

    fireflies.forEach((fly, i) => {
      positions[i * 3] = fly.position.x
      positions[i * 3 + 1] = fly.position.y
      positions[i * 3 + 2] = fly.position.z
      colors[i * 3] = fly.colorR * fly.opacity
      colors[i * 3 + 1] = fly.colorG * fly.opacity
      colors[i * 3 + 2] = fly.colorB * fly.opacity
      sizes[i] = fly.size
    })

    return { positions, colors, sizes }
  }, [fireflies])

  useFrame((_, delta) => {
    if (!pointsRef.current) return

    const posAttr = pointsRef.current.geometry.attributes[
      "position"
    ] as THREE.BufferAttribute
    const colorAttr = pointsRef.current.geometry.attributes[
      "color"
    ] as THREE.BufferAttribute

    const posArr = posAttr.array as Float32Array
    const colorArr = colorAttr.array as Float32Array

    fireflies.forEach((fly, i) => {
      // Drift
      fly.position.x += fly.velocity.x
      fly.position.y += fly.velocity.y

      // Soft bounce at edges
      if (Math.abs(fly.position.x) > 6) fly.velocity.x *= -1
      if (Math.abs(fly.position.y) > 3.5) fly.velocity.y *= -1

      // Smoothly move opacity toward target
      const diff = fly.targetOpacity - fly.opacity
      fly.opacity += diff * Math.min(fly.blinkSpeed * delta, 1)

      // Schedule next blink event when timer expires
      fly.blinkTimer += delta
      if (fly.blinkTimer >= fly.blinkInterval) {
        fly.blinkTimer = 0
        fly.blinkInterval = 0.3 + Math.random() * 3.5
        if (fly.targetOpacity > 0.3) {
          fly.targetOpacity = 0
        } else {
          if (Math.random() > 0.35) {
            fly.targetOpacity = 0.6 + Math.random() * 0.4
          }
        }
      }

      // Write positions
      posArr[i * 3] = fly.position.x
      posArr[i * 3 + 1] = fly.position.y
      posArr[i * 3 + 2] = fly.position.z

      // Write colors pre-multiplied by opacity
      colorArr[i * 3] = fly.colorR * fly.opacity
      colorArr[i * 3 + 1] = fly.colorG * fly.opacity
      colorArr[i * 3 + 2] = fly.colorB * fly.opacity
    })

    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
        <FireflyField />
      </Canvas>
    </div>
  )
}
