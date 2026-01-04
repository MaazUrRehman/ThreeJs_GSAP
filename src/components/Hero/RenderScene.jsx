import { createPortal, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function RenderScene({ children, target }) {
  const { gl, camera } = useThree()
  const scene = useRef(new THREE.Scene())

  useFrame(() => {
    gl.setRenderTarget(target)
    gl.render(scene.current, camera)
    gl.setRenderTarget(null)
  }, 1)

  return createPortal(children, scene.current)
}
