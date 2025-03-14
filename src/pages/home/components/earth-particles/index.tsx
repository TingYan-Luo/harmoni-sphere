import { useFrame, useLoader } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from 'three'

export default function ParticleEarth() {
  // 加载模型
  const gltf = useLoader(GLTFLoader, 'src/assets/Earth_Model.glb')
  const pointsRef = useRef(null)
  const originalPositions = useRef([])
  const [phase, setPhase] = useState('exploded') // 'exploded' | 'gathered'

  // 提取顶点数据生成粒子系统
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const scales = []

    // 遍历模型几何体收集顶点
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        const vertices = child.geometry.attributes.position?.array
        if (!vertices) return;
        for (let i = 0; i < vertices.length; i += 3) {
          positions.push(vertices[i], vertices[i + 1], vertices[i + 2])
          scales.push(1) // 初始化缩放系数
        }
      }
    })

    // 存储原始位置用于动画
    originalPositions.current = [...positions]
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1))
    
    return geometry
  }, [gltf])

  // 动画逻辑
  useFrame(() => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position?.array
    if (!positions) return;
    const scales = pointsRef.current.geometry.attributes.scale.array
    
    for (let i = 0; i < positions.length; i += 3) {
      const original = [
        originalPositions.current[i],
        originalPositions.current[i + 1],
        originalPositions.current[i + 2]
      ]

      // 根据相位计算目标位置
      let targetX, targetY, targetZ
      if (phase === 'gathered') {
        targetX = original[0]
        targetY = original[1]
        targetZ = original[2]
      } else {
        targetX = original[0] + Math.sin(i) * 6
        targetY = original[1] + Math.cos(i) * 8
        targetZ = original[2] + Math.sin(1.5 + i) * 10
      }

      // 平滑过渡
      positions[i] += (targetX - positions[i]) * 0.1
      positions[i + 1] += (targetY - positions[i + 1]) * 0.1
      positions[i + 2] += (targetZ - positions[i + 2]) * 0.1
      
      // 粒子大小变化
      scales[i/3] = phase === 'gathered' ? 0.8 : 0.3
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.scale.needsUpdate = true
  })

  // 自动切换状态
  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(prev => prev === 'gathered' ? 'exploded' : 'gathered')
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <points ref={pointsRef} geometry={particles}>
      <pointsMaterial 
        size={0.2}
        color="#4a90e2"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}
