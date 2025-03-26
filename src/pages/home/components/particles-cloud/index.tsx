import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute, Vector3, Group, Points, Mesh, Box3 } from "three";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

export default function ModelParticles () {
  const groupRef = useRef<Group>(null);

  const pointsRef = useRef<Points>(null);
  // 用于保存创建好的 BufferGeometry（粒子系统几何体）
  const geometryRef = useRef(new BufferGeometry());

  // 保存原始顶点和目标（扩散）位置
  const originalPositions = useRef<Vector3[]>([]);
  const targetPositions = useRef<Vector3[]>([]);
  // 固定大小的 Float32Array 用于更新顶点数据
  const positionsArray = useRef<Float32Array>(null);

  // 加载模型
  const { scene } = useGLTF("src/assets/Earth_Model.glb");

  useEffect(() => {
    let vertices: Vector3[] = [];

    // 遍历场景中所有 Mesh，提取顶点数据
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.geometry) {
          const posAttr = mesh.geometry.attributes.position;
          for (let i = 0; i < posAttr.count; i++) {
            const vertex = new Vector3().fromBufferAttribute(posAttr, i);
            vertices.push(vertex);
          }
        }
      }
    });

    if (vertices.length === 0) return;

    // 计算包围盒，并将顶点居中
    const bbox = new Box3().setFromPoints(vertices);
    const center = new Vector3();
    bbox.getCenter(center);
    vertices = vertices.map((v) => v.sub(center));

    // 保存原始顶点数据
    originalPositions.current = vertices;
    // 计算扩散目标：在每个原始顶点基础上加上随机偏移，形成粒子云效果
    const cloudRadius = 5;
    targetPositions.current = vertices.map((v) => {
      // 随机方向和随机长度的偏移向量
      const randVec = new Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
        .normalize()
        .multiplyScalar(Math.random() * cloudRadius);
      return v.clone().add(randVec);
    });

    // 创建固定大小的 Float32Array，初始赋值为原始顶点数据
    positionsArray.current = new Float32Array(vertices.length * 3);
    vertices.forEach((v, i) => {
      positionsArray.current![i * 3] = v.x;
      positionsArray.current![i * 3 + 1] = v.y;
      positionsArray.current![i * 3 + 2] = v.z;
    });

    // 将数组绑定到 BufferGeometry 上
    geometryRef.current.setAttribute(
      "position",
      new Float32BufferAttribute(positionsArray.current, 3)
    );

    // 启动动画
    startAnimation();
  }, [scene]);

  // 扩散和聚合动画循环
  const startAnimation = () => {
    // 动画参数对象，用于控制插值 t
    const animObj = { t: 0, drop: 0 };

    const tl = gsap.timeline({ repeat: -1 });
    // 扩散动画：t 从 0 变为 1，粒子从原始位置移动到扩散目标
    tl.to(animObj, {
      duration: 1,
      t: 1,
      ease: "power1.inOut",
      onUpdate: () => {
        originalPositions.current.forEach((orig, i) => {
          const target = targetPositions.current[i];
          // 线性插值：根据 t 值计算当前位置
          const lerped = orig.clone().lerp(target, animObj.t);
          positionsArray.current![i * 3] = lerped.x;
          positionsArray.current![i * 3 + 1] = lerped.y;
          positionsArray.current![i * 3 + 2] = lerped.z;
        });
        geometryRef.current.setAttribute(
          "position",
          new Float32BufferAttribute(positionsArray.current, 3)
        );
        geometryRef.current.attributes.position.needsUpdate = true;
      },
    });
    // 维持扩散状态（3秒）
    tl.to(animObj, {
      duration: 3,
      drop: -0.2, // 让粒子 Y 轴逐渐下降 0.5
      ease: "power1.inOut",
      onUpdate: () => {
        targetPositions.current.forEach((target, i) => {
          positionsArray.current![i * 3] = target.x;
          positionsArray.current![i * 3 + 1] = target.y + animObj.drop;
          positionsArray.current![i * 3 + 2] = target.z;
        });
        geometryRef.current.setAttribute(
          "position",
          new Float32BufferAttribute(positionsArray.current, 3)
        );
        geometryRef.current.attributes.position.needsUpdate = true;
      },
    });
    // 聚合动画：t 从 1 变回 0，粒子回到原始模型位置
    tl.to(animObj, {
      duration: 1,
      t: 0,
      drop: 0, // 回到原始 Y 轴位置
      ease: "power1.inOut",
      onUpdate: () => {
        originalPositions.current.forEach((orig, i) => {
          const target = targetPositions.current[i];
          const lerped = orig.clone().lerp(target, animObj.t);
          positionsArray.current![i * 3] = lerped.x;
          positionsArray.current![i * 3 + 1] = lerped.y;
          positionsArray.current![i * 3 + 2] = lerped.z;
        });
        geometryRef.current.setAttribute(
          "position",
          new Float32BufferAttribute(positionsArray.current, 3)
        );
        geometryRef.current.attributes.position.needsUpdate = true;
      },
    });
    // 维持聚合状态（3秒）
    tl.to(animObj, {
      duration: 3,
      t: 0, // 保持 t = 0，不变化
    });
  };

  // useFrame：每帧给整个物体组加上轻微旋转（即使在停顿状态下，页面也不会静止）
  useFrame(() => {
    if (groupRef.current) {
      // 仅在停顿状态下旋转或一直旋转（此处简单实现持续旋转）
      groupRef.current.rotation.y += 0.001;
      // 可选：加入 X 轴轻微浮动
      groupRef.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        {/* 直接使用已经创建好的 geometry */}
        <primitive object={geometryRef.current} attach="geometry" />
        <pointsMaterial attach="material" color="white" size={0.1} />
      </points>
    </group>
  );
};
