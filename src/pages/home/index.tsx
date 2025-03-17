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
  const [activeId, setActiveId] = useState<string>();

  const onImageClick = (id: string, src: string) => {
    console.log('🚀 ~ onImageClick ~ src:', src);
    setActiveId(id);
  };

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
          id="first"
          activeId={activeId}
          active={activeId?.startsWith('first')}
          images={images}
          itemHeight={100}
          itemWidth={200}
          onItemClick={onImageClick}
        />
        <InfiniteImageCarousel 
          id="second"
          activeId={activeId}
          active={activeId?.startsWith('second')}
          images={images}
          itemHeight={100}
          itemWidth={200}
          direction="right"
          onItemClick={onImageClick}
        />
        <InfiniteImageCarousel 
          id="thrid"
          active={activeId?.startsWith('thrid')}
          activeId={activeId}
          images={images}
          itemHeight={100}
          itemWidth={200}
          onItemClick={onImageClick}
        />
      </div>
    </div>
  );
}