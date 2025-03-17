import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from './index.module.less';
import ParticleCloud from "./components/particles-cloud";
import { useEffect, useState } from "react";
import { MockImages } from "./mock";
import InfiniteImageCarousel from "../../components/infinite-image-carousel";

/*
 * @author: tingyan.lty
 * @description: 官网首页
 */
export default function Home() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(MockImages);
  }, []);

  return (
    <div className={styles.home}>
      <Canvas 
        className={styles.canvas} 
        style={{ height: '100vh' }} 
        camera={{ position: [0, 15, 15], fov: 40 }}
      >
        <ParticleCloud />
        <ambientLight intensity={0.5} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className={styles.images}>
        <InfiniteImageCarousel 
          images={images}
          itemHeight={100}
          itemWidth={200}
        />
        <InfiniteImageCarousel 
          images={images}
          itemHeight={100}
          itemWidth={200}
          direction="right"
        />
        <InfiniteImageCarousel 
          images={images}
          itemHeight={100}
          itemWidth={200}
        />
      </div>
    </div>
  );
}