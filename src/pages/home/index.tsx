import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ParticleEarth from "./components/earth-particles";
import styles from './index.module.less';

/*
 * @author: tingyan.lty
 * @description: 官网首页
 */
export default function Home() {
  return (
    <div className={styles.home}>
      <Canvas className={styles.canvas} style={{ height: '100vh' }} camera={{ position: [0, 15, 15], fov: 40 }}>
        <ParticleEarth />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}