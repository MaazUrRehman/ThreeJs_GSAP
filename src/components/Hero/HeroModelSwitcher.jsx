'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import MacBookModel14 from "../models/Macbook-14"
import MacBookModel16 from "../models/Macbook-16"

const ModelSwitcher = ({ 
  isHovered = false,
  scrollProgress = 0,
  mousePosition = { x: 0, y: 0 }
}) => {
  const group14Ref = useRef()
  const group16Ref = useRef()
  const materials14Ref = useRef([])
  const materials16Ref = useRef([])
  const [isReady, setIsReady] = useState(false)

  // Initialize materials
  useEffect(() => {
    const collectMaterials = (group, materialsArray) => {
      if (!group) return
      
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = true
              materialsArray.push(mat)
            })
          } else {
            child.material.transparent = true
            materialsArray.push(child.material)
          }
        }
      })
    }

    if (group14Ref.current && group16Ref.current) {
      collectMaterials(group14Ref.current, materials14Ref.current)
      collectMaterials(group16Ref.current, materials16Ref.current)
      setIsReady(true)
    }

    return () => {
      materials14Ref.current = []
      materials16Ref.current = []
    }
  }, [])

  // Animation logic using useFrame (Three.js animation loop)
  useFrame((state, delta) => {
    if (!isReady) return

    const time = state.clock.elapsedTime
    
    // Calculate blend factor based on hover and scroll
    let blendFactor = 0
    if (isHovered) {
      blendFactor = THREE.MathUtils.lerp(blendFactor, 1, delta * 5)
    } else {
      blendFactor = THREE.MathUtils.lerp(blendFactor, 0, delta * 3)
    }
    
    // Add scroll influence
    blendFactor = THREE.MathUtils.clamp(blendFactor + scrollProgress * 0.3, 0, 1)

    // Mouse influence on position
    const mouseInfluence = new THREE.Vector3(
      (mousePosition.x - 0.5) * 0.5,
      (mousePosition.y - 0.5) * 0.3,
      0
    )

    // Animate MacBook 14
    if (group14Ref.current) {
      // Position based on blend factor (left to center)
      const targetPos14 = new THREE.Vector3(
        -2 + blendFactor * 2 + mouseInfluence.x * 0.5,
        mouseInfluence.y * 0.3,
        0
      )
      
      group14Ref.current.position.lerp(targetPos14, delta * 3)
      
      // Rotation
      group14Ref.current.rotation.y = Math.sin(time * 0.3) * 0.1 + blendFactor * -0.3
      group14Ref.current.rotation.x = Math.sin(time * 0.2) * 0.05
      
      // Scale based on blend factor
      const scale14 = 0.15 - blendFactor * 0.05
      group14Ref.current.scale.setScalar(scale14)
      
      // Opacity
      const opacity14 = 1 - blendFactor * 0.8
      materials14Ref.current.forEach(mat => {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity14, delta * 4)
        mat.needsUpdate = true
      })
    }

    // Animate MacBook 16
    if (group16Ref.current) {
      // Position based on blend factor (right to center)
      const targetPos16 = new THREE.Vector3(
        2 - blendFactor * 2 + mouseInfluence.x * 0.5,
        mouseInfluence.y * 0.3,
        0
      )
      
      group16Ref.current.position.lerp(targetPos16, delta * 3)
      
      // Rotation
      group16Ref.current.rotation.y = Math.sin(time * 0.3 + 0.5) * 0.1 + blendFactor * 0.3
      group16Ref.current.rotation.x = Math.sin(time * 0.2 + 0.3) * 0.05
      
      // Scale based on blend factor
      const scale16 = 0.1 + blendFactor * 0.1
      group16Ref.current.scale.setScalar(scale16)
      
      // Opacity
      const opacity16 = blendFactor
      materials16Ref.current.forEach(mat => {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity16, delta * 4)
        mat.needsUpdate = true
      })
    }
  })

  return (
    <>
      {/* MacBook 14 */}
      <group ref={group14Ref} position={[-2, 0, 0]} scale={0.15}>
        <MacBookModel14 />
      </group>

      {/* MacBook 16 */}
      <group ref={group16Ref} position={[2, 0, 0]} scale={0.1}>
        <MacBookModel16 />
      </group>

      {/* Visual effect lines connecting the models */}
      <LineConnector 
        group14Ref={group14Ref}
        group16Ref={group16Ref}
        isHovered={isHovered}
        scrollProgress={scrollProgress}
      />
    </>
  )
}

// Optional: Connecting lines between models
const LineConnector = ({ group14Ref, group16Ref, isHovered, scrollProgress }) => {
  const lineRef = useRef()
  
  useFrame(() => {
    if (!group14Ref.current || !group16Ref.current || !lineRef.current) return
    
    // Get positions
    const pos14 = new THREE.Vector3()
    const pos16 = new THREE.Vector3()
    
    group14Ref.current.getWorldPosition(pos14)
    group16Ref.current.getWorldPosition(pos16)
    
    // Create line geometry
    const points = []
    const segments = 10
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const point = new THREE.Vector3().lerpVectors(pos14, pos16, t)
      
      // Add wave effect
      const wave = Math.sin(t * Math.PI) * 0.2 * (isHovered ? 1 : 0.3)
      point.y += wave
      
      points.push(point)
    }
    
    lineRef.current.geometry.setFromPoints(points)
  })

  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.3 * (isHovered ? 1 : 0.5) + scrollProgress * 0.2
  })

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <primitive object={lineMaterial} attach="material" />
    </line>
  )
}

export default ModelSwitcher