import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

// import { OrbitControls } from "@react-three/drei";

import InfiniteImageCarousel from "../../components/infinite-image-carousel";
import ParticleCloud from "./components/particles-cloud";
import FooterGrass from "./components/footer-grass";
import DetailModal from "./components/detail-modal";

import SpeciesList from "./stastic/species-list.json";
import TextEn from './stastic/text-en.json';
import TextZh from './stastic/text-zh.json';
import Websites from './stastic/websites.json';
import githubLogo from '../../assets/github-mark.png';

import styles from './index.module.less';

/*
 * @author: tingyan.lty
 * @description: 官网首页
 */
export default function Home() {
  const [images, setImages] = useState([]);
  const [activeId, setActiveId] = useState<string>();
  const [texts, setTexts] = useState<Record<string, any>>({});
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [detail, setDetail] = useState<any>();
  const getImagesList = async () => {
    setImages(SpeciesList);
  };
  const onImageClick = (id: string, data: any) => {
    console.log('🚀 ~ onImageClick ~ data:', data);
    const isActive = activeId !== id;
    if (isActive) {
      const index = images.findIndex(item => item.id === id);
      setActiveId(id);
      setDetail({
        ...data,
        title: language === 'zh' ? data.name : data.scientificName,
        content: language === 'zh' ? data.desc_zh : data.desc,
        index,
      });
    } else {
      setActiveId(undefined);
      setDetail(undefined);
    }
  };

  const goGithub = () => {
    window.open('https://github.com/TingYan-Luo/harmoni-sphere');
  };

  useEffect(() => {
    setLanguage('en');
    getImagesList();
    setTexts(language === 'zh' ? TextZh : TextEn);
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.main}>
        <div className={styles['main-title']}>
          <h1 className={styles['main-title-1']}>
            {texts.main?.title[0]}
            <p className={styles['main-title-desc']}>{texts.main?.desc}</p>
          </h1>
          <h1 className={styles['main-title-2']}>{texts.main?.title[1]}</h1>
        </div>
        <Canvas 
          className={styles.canvas} 
          style={{ height: '100vh' }} 
          camera={{ position: [0, 15, 15], fov: window.document.body.clientWidth > 768 ? 40 : 80 }}
        >
          <ParticleCloud />
          <ambientLight intensity={0.5} />
          {/* <OrbitControls enableZoom={false} /> */}
        </Canvas>
      </div>
      <div className={styles.images}>
        <div className={styles.tip}>
          {texts.animals?.tip}
        </div>
        <div className={styles['images-title']}>
          <h3 className={styles['images-title-text']}>
            {texts.animals?.title}
          </h3>
          <div className={styles['images-title-action']}>
            {`-> ${texts.animals?.action}`}
          </div>
        </div>
        <div className={styles['images-list']}>
          <InfiniteImageCarousel 
            id="first"
            activeId={activeId}
            active={activeId?.startsWith('first')}
            images={images.slice(0, 10)}
            itemHeight={200}
            itemWidth={300}
            onItemClick={onImageClick}
          />
          <InfiniteImageCarousel 
            id="second"
            activeId={activeId}
            active={activeId?.startsWith('second')}
            images={images.slice(10, 20)}
            itemHeight={200}
            itemWidth={300}
            direction="right"
            onItemClick={onImageClick}
          />
          <InfiniteImageCarousel 
            id="thrid"
            active={activeId?.startsWith('thrid')}
            activeId={activeId}
            images={images.slice(20)}
            itemHeight={200}
            itemWidth={300}
            onItemClick={onImageClick}
          />
        </div>
        <DetailModal open={!!detail} onClose={() => setDetail(undefined)} data={detail} />
      </div>
      <div className={styles.about}>
        <div className={styles.tip}>
          {texts.about?.tip}
        </div>
        {texts.about?.title?.map(item => <h3>{item}</h3>)}
        <p>{texts.about?.desc}</p>
        <div className={styles.websites}>
          {
            Websites.map(item => (
              <div key={item.id} className={styles['websites-item']} onClick={() => window.open(item.url)}>
                <img 
                  className={styles['websites-item-img']} 
                  src={item.thumbnail} 
                  alt={language === 'zh' ? item.website_zh : item.website} 
                />
                <div className={styles['websites-item-content']}>
                  <div className={styles['websites-item-title']}>
                    {language === 'zh' ? item.website_zh : item.website}
                  </div>
                  <div className={styles['websites-item-desc']}>
                    {language === 'zh' ? item.introduction_zh : item.introduction}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.sun}></div>
      </div>
      <div className={styles.footer}>
        <div className={styles['footer-text']}>
          {texts.end}
          <div className={styles['footer-text-bird']} />
        </div>
        <p className={styles['footer-contact']}>
          {texts.contact}
          <img src={githubLogo} onClick={goGithub} />
        </p>
        <FooterGrass />
      </div>
    </div>
  );
}