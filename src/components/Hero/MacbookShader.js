import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

const MacbookShaderMaterial = shaderMaterial(
  {
    baseTex: null,
    revealTex: null,
    mouse: new THREE.Vector2(0.5, 0.5),
    time: 0,
  },

  // Vertex
  `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,

  // Fragment
  `
  uniform sampler2D baseTex;
  uniform sampler2D revealTex;
  uniform vec2 mouse;
  uniform float time;
  varying vec2 vUv;

  void main(){
    float dist = distance(vUv, mouse);
    float mask = smoothstep(0.35, 0.0, dist);
    vec4 base = texture2D(baseTex, vUv);
    vec4 reveal = texture2D(revealTex, vUv);
    gl_FragColor = mix(base, reveal, mask);
  }`
)

extend({ MacbookShaderMaterial })
