// HeroCanvas.jsx
import { Canvas } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { useState } from 'react'
import MacBookModel14 from '../models/Macbook-14'
import MacBookModel16 from '../models/Macbook-16'

export default function HeroCanvas() {
  const [hover, setHover] = useState(false)

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <group
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          scale={hover ? 1.05 : 1}
        >
          {hover ? <MacBookModel16 /> : <MacBookModel14 />}
        </group>
      </Float>

      <Environment preset="city" />
    </Canvas>
  )
}
