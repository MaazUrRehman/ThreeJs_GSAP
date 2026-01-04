// 'use client'

// import { Canvas } from '@react-three/fiber'
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
// import { Suspense, useState, useRef, useEffect } from 'react'
// import MacBookModel14 from "../models/Macbook-14";
// import MacBookModel16 from "../models/Macbook-16";
// import GeometricPattern from './GeometricPattern'
// import * as THREE from 'three'

// export default function HeroSection() {
//   const [hover, setHover] = useState(false)
//   const orbitControlsRef = useRef()
//   const animationIdRef = useRef()
//   const directionRef = useRef(1) // 1 for forward, -1 for backward
//   const currentAngleRef = useRef(0)

//   useEffect(() => {
//     const animate = () => {
//       if (orbitControlsRef.current) {
//         const speed = 0.001 // Adjust speed here
//         const maxAngle = Math.PI / 12 // 30 degrees in radians

//         // Update current angle
//         currentAngleRef.current += speed * directionRef.current

//         // Reverse direction when hitting limits
//         if (currentAngleRef.current >= maxAngle) {
//           currentAngleRef.current = maxAngle
//           directionRef.current = -1

//         } else if (currentAngleRef.current <= -maxAngle) {
//           currentAngleRef.current = -maxAngle
//           directionRef.current = 1

//         }

//         // Apply the rotation
//         orbitControlsRef.current.setAzimuthalAngle(currentAngleRef.current)
//         orbitControlsRef.current.update()
//       }

//       animationIdRef.current = requestAnimationFrame(animate)
//     }

//     animate()


//     return () => cancelAnimationFrame(animationIdRef.current)
//   }, [])

//   return (
//     <section className="h-screen w-full relative overflow-hidden bg-black">

//       {/* Use SVG Pattern */}
//       <GeometricPattern />

//       {/* Canvas container with 80% width, centered */}
//       <div className="absolute left-1/2 top-1/2 mt-25 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[100%] z-10">
//         <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} className="w-full h-full">
//           <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />

//           {/* Enhanced lighting */}
//           <ambientLight intensity={1.2} />
//           <directionalLight
//             position={[5, 5, 5]}
//             intensity={1.5}
//             color="#ffffff"
//           />
//           <directionalLight
//             position={[-5, 5, -5]}
//             intensity={1.5}
//             color="#ffffff"
//           />
//           <directionalLight
//             position={[5, 5, -5]}
//             intensity={1.5}
//             color="#ffffff"
//           />
//           <directionalLight
//             position={[0, 8, 0]}
//             intensity={0.8}
//             color="#ffffff"
//           />
//           <pointLight
//             position={[-3, 2, 3]}
//             intensity={0.6}
//             color="#f8f9fa"
//           />


//           <Suspense fallback={null}>
//             {hover ? (
//               <MacBookModel16
//                 scale={[0.25, 0.25, 0.25]}
//                 position={[0, -0.5, 0]}
//                 onPointerEnter={() => setHover(true)}
//                 onPointerLeave={() => setHover(false)}
//               />
//             ) : (
//               <MacBookModel14
//                 scale={[0.20, 0.20, 0.20]}
//                 position={[0, -0.5, 0]}
//                 onPointerEnter={() => setHover(true)}
//                 onPointerLeave={() => setHover(false)}
//               />
//             )}
//           </Suspense>




//           <OrbitControls
//             ref={orbitControlsRef}
//             enableZoom={false}
//             enablePan={false}
//             autoRotate={false} // Disable default autoRotate
//             minAzimuthAngle={-Math.PI / 18} // -30 degrees
//             maxAzimuthAngle={Math.PI / 18}  // +30 degrees
//             minPolarAngle={Math.PI / 3}    // 60 degrees from top
//             maxPolarAngle={2 * Math.PI / 3} // 120 degrees from top
//             enableDamping={true}
//             dampingFactor={0.05}
//           />
//         </Canvas>
//       </div>




//     </section>
//   )
// }






'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import MacBookModel14 from "../models/Macbook-14";
import GeometricPattern from './GeometricPattern'
import * as THREE from 'three'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// Screen Only Shader Material (OVERLAY - doesn't affect model)
const ScreenShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uScroll: { value: 0 },
    tDiffuse: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Mouse influence (subtle)
      vec2 mouseDir = uv - uMouse;
      float mouseDist = length(mouseDir);
      float mouseWave = sin(mouseDist * 8.0 - uTime * 1.5) * 0.02;
      
      // Scroll compression
      vec3 pos = position;
      pos.z += mouseWave * uScroll * 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uProgress;
    uniform float uScroll;
    uniform sampler2D tDiffuse;
    
    void main() {
      vec2 uv = vUv;
      
      // Get screen texture
      vec4 screenColor = texture2D(tDiffuse, uv);
      
      // Edge glow effect
      float edge = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x) *
                   smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
      
      // Add subtle scanlines
      float scanline = sin(uv.y * 600.0 + uTime * 1.5) * 0.015;
      
      // Progress-based fade
      float fadeProgress = smoothstep(0.0, 1.0, uProgress);
      float alpha = mix(0.0, 0.8, fadeProgress); // Reduced opacity for overlay
      
      // Apply effects
      vec3 finalColor = screenColor.rgb * (1.0 + edge * 0.2 + scanline);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  transparent: true,
});

// Enhanced MacBook Component - FIXED VERSION
function EnhancedMacBook({ mousePos, scrollProgress }) {
  const groupRef = useRef()
  const screenRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [screenTexture, setScreenTexture] = useState(null)
  const [showScreenOverlay, setShowScreenOverlay] = useState(false)
  const [progress, setProgress] = useState(0)

  // Track materials to ensure they don't become transparent
  const materialsRef = useRef([])

  // Handle hover
  const handleHover = (hovered) => {
    setIsHovered(hovered)
    
    if (hovered) {
      setShowScreenOverlay(true)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval)
            return 1
          }
          return prev + 0.05
        })
      }, 16) // ~60fps
    } else {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(interval)
            setShowScreenOverlay(false)
            return 0
          }
          return prev - 0.05
        })
      }, 16)
    }
  }

  // Create screen texture (for overlay)
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Create a tech/UI pattern for screen
    const gradient = ctx.createLinearGradient(0, 0, 512, 512)
    gradient.addColorStop(0, '#000000')
    gradient.addColorStop(0.5, '#1a1a1a')
    gradient.addColorStop(1, '#000000')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    // Add Apple logo
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 100px -apple-system, system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('', 256, 256)
    
    // Add some UI lines
    ctx.strokeStyle = '#4cc9f0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(100, 180)
    ctx.lineTo(412, 180)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(100, 256)
    ctx.lineTo(412, 256)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(100, 332)
    ctx.lineTo(412, 332)
    ctx.stroke()
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    setScreenTexture(texture)
  }, [])

  // Auto rotation with THREE.MathUtils.lerp for smoothness
  useFrame((state) => {
    if (groupRef.current) {
      // Smooth left-right rotation (20 degrees)
      const targetAngle = Math.sin(state.clock.elapsedTime * 0.3) * (Math.PI / 9) // 20 degrees
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetAngle,
        0.05
      )
    }

    // Update shader uniforms for screen overlay
    if (screenRef.current?.material && showScreenOverlay) {
      screenRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
      screenRef.current.material.uniforms.uProgress.value = progress
      screenRef.current.material.uniforms.uScroll.value = scrollProgress
      
      if (mousePos.current) {
        screenRef.current.material.uniforms.uMouse.value.set(
          mousePos.current.x,
          mousePos.current.y
        )
      }
    }
  })

  // Fixed: Ensure MacBook model's materials are always opaque
  useEffect(() => {
    const ensureMaterialsOpaque = () => {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat && mat.transparent !== undefined) {
                  mat.transparent = false
                  mat.opacity = 1.0
                  if (mat.emissive) mat.emissive.set(0x000000)
                }
              })
            } else if (child.material && child.material.transparent !== undefined) {
              child.material.transparent = false
              child.material.opacity = 1.0
              if (child.material.emissive) child.material.emissive.set(0x000000)
            }
          }
        })
      }
    }

    // Check periodically to ensure materials stay opaque
    const interval = setInterval(ensureMaterialsOpaque, 100)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Original MacBook 14 - PERMANENTLY VISIBLE */}
      <group 
        ref={groupRef}
        position={[0, -0.5, 0]}
        onPointerEnter={() => handleHover(true)}
        onPointerLeave={() => handleHover(false)}
      >
        <Suspense fallback={null}>
          <MacBookModel14
            scale={[0.20, 0.20, 0.20]}
            rotation={[0, 0, 0]}
          />
        </Suspense>
      </group>

      {/* Screen overlay effect - separate from model */}
      {showScreenOverlay && screenTexture && (
        <mesh 
          ref={screenRef} 
          position={[0, -0.18, 0.02]} 
          rotation={[0, groupRef.current?.rotation.y || 0, 0]}
        >
          <planeGeometry args={[1.78, 1.15, 16, 16]} />
          <primitive 
            object={ScreenShaderMaterial.clone()} 
            attach="material"
            uniforms-tDiffuse-value={screenTexture}
            uniforms-uProgress-value={progress}
          />
        </mesh>
      )}
    </>
  )
}

// Simple floating particles
function TechParticles() {
  const pointsRef = useRef()
  const count = 300
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002
    }
  })
  
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = 8 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    
    colors[i3] = Math.random() * 0.4 + 0.6
    colors[i3 + 1] = Math.random() * 0.6 + 0.4
    colors[i3 + 2] = Math.random() * 0.8 + 0.2
  }
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroSection() {
  const mousePos = useRef({ x: 0.5, y: 0.5 })
  const scrollProgress = useRef(0)
  const containerRef = useRef()

  // Mouse move handler
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height
    }
  }

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      scrollProgress.current = Math.min(scrollY / windowHeight, 1)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="h-screen w-full relative overflow-hidden bg-black">

      {/* SVG Pattern Background */}
      <GeometricPattern />

      {/* Canvas container with 80% width, centered */}
      <div 
        ref={containerRef}
        className="absolute left-1/2 top-1/2 mt-25 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[100%] z-10"
        onMouseMove={handleMouseMove}
      >
        <Canvas 
          dpr={[1, 1.5]} 
          gl={{ 
            antialias: true, 
            powerPreference: 'high-performance',
            alpha: true 
          }} 
          className="w-full h-full"
        >
          <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />

          {/* ORIGINAL LIGHTING SETUP (like your original code) */}
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={1.5}
            color="#ffffff"
          />
          <directionalLight
            position={[5, 5, -5]}
            intensity={1.5}
            color="#ffffff"
          />
          <directionalLight
            position={[0, 8, 0]}
            intensity={0.8}
            color="#ffffff"
          />
          <pointLight
            position={[-3, 2, 3]}
            intensity={0.6}
            color="#f8f9fa"
          />
          
          {/* Additional rim light for better edges */}
          <directionalLight
            position={[0, 3, -5]}
            intensity={0.5}
            color="#4cc9f0"
          />

          {/* Tech Particles Background */}
          <TechParticles />

          {/* Enhanced MacBook - FIXED VERSION */}
          <Suspense fallback={null}>
            <EnhancedMacBook 
              mousePos={mousePos}
              scrollProgress={scrollProgress.current}
            />
          </Suspense>

          {/* Orbit Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={false}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={2 * Math.PI / 3}
            enableDamping={true}
            dampingFactor={0.05}
          />

          {/* Post-processing */}
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.05}
            />
            <Noise
              premultiply
              blendFunction={BlendFunction.OVERLAY}
              opacity={0.01}
            />
            <Vignette
              darkness={0.3}
              offset={0.2}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Custom cursor */}
      <div 
        className={`fixed w-8 h-8 rounded-full border pointer-events-none z-50 mix-blend-difference transition-all duration-150`}
        style={{
          left: `${mousePos.current.x * 100}%`,
          top: `${mousePos.current.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          borderColor: '#ffffff',
          opacity: 0.7
        }}
      />
    </section>
  )
}