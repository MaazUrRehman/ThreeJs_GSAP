import { createPortal, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function OffscreenScene({ children, setTexture }) {
  const { gl, camera } = useThree()
  const scene = useRef(new THREE.Scene())
  const target = useRef(new THREE.WebGLRenderTarget(1024, 1024))

  useFrame(() => {
    gl.setRenderTarget(target.current)
    gl.clear()
    gl.render(scene.current, camera)
    gl.setRenderTarget(null)
    setTexture(target.current.texture)
  })

  return createPortal(children, scene.current)
}
