import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useParams } from "react-router-dom";
import * as motion from "motion/react-client"

import InfiniteImageCarousel from "@/components/infinite-image-carousel";
import ParticleCloud from "./components/particles-cloud";
import FooterGrass from "./components/footer-grass";
import DetailModal from "./components/detail-modal";

import githubLogo from '@/assets/github-mark.png';
import SpeciesList from "./stastic/species-list.json";
import TextEn from './stastic/text-en.json';
import TextZh from './stastic/text-zh.json';
import Websites from './stastic/websites.json';

import styles from './index.module.less';

/*
 * @author: tingyan.lty
 * @description: 官网首页
 */
export default function Home() {
  const [images, setImages] = useState([]);
  const [texts, setTexts] = useState<Record<string, any>>({});
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [detail, setDetail] = useState<any>();
  const small = useMemo(() => {
    return window.document.body.clientWidth < 768;
  }, [])

  const params = useParams();
  const { language: urlLang } = params;
  const getImagesList = async () => {
    setImages(SpeciesList);
  };
  const onImageClick = (id: string, data: any) => {
    const index = images.findIndex(item => item.id === id);
    setDetail({
      ...data,
      id,
      title: language === 'zh' ? data.name : data.scientificName,
      content: language === 'zh' ? data.desc_zh : data.desc,
      index,
    });
  };

  const goGithub = () => {
    window.open('https://github.com/TingYan-Luo/harmoni-sphere');
  };

  useEffect(() => {
    const l: any = urlLang || 'en';
    setLanguage(l);
    getImagesList();
    setTexts(l === 'zh' ? TextZh : TextEn);
  }, [urlLang]);

  return (
    <motion.div className={styles.home} initial="offscreen" whileInView="onscreen" viewport={{ amount: 0.8 }}>
      <div className={styles.main}>
        <div className={styles['main-title']}>
          <motion.h1 
            className={styles['main-title-1']} 
            initial={{ left: -100, opacity: 0 }} 
            whileInView={{ left: small ? 32 : 90, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {texts.main?.title[0]}
            <p className={styles['main-title-desc']}>{texts.main?.desc}</p>
          </motion.h1>
          <motion.h1 
            className={styles['main-title-2']}
            initial={{ right:-100, opacity: 0 }} 
            whileInView={{ right: small ? 32 : 90, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {texts.main?.title[1]}
          </motion.h1>
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
        <motion.div 
          className={styles['images-title']}
          initial={{ opacity: 0, transform: 'translateY(50px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.6 }}
        >
          <h3 className={styles['images-title-text']}>
            {texts.animals?.title}
          </h3>
          <div className={styles['images-title-action']}>
            {`-> ${texts.animals?.action}`}
          </div>
        </motion.div>
        <div className={styles['images-list']}>
          <InfiniteImageCarousel 
            id="first"
            activeId={detail?.id}
            active={detail?.id?.startsWith('first')}
            images={images.slice(0, 10)}
            itemHeight={200}
            itemWidth={300}
            onItemClick={onImageClick}
          />
          <InfiniteImageCarousel 
            id="second"
            activeId={detail?.id}
            active={detail?.id?.startsWith('second')}
            images={images.slice(10, 20)}
            itemHeight={200}
            itemWidth={300}
            direction="right"
            onItemClick={onImageClick}
          />
          <InfiniteImageCarousel 
            id="thrid"
            active={detail?.id?.startsWith('thrid')}
            activeId={detail?.id}
            images={images.slice(20)}
            itemHeight={200}
            itemWidth={300}
            onItemClick={onImageClick}
          />
        </div>
        <DetailModal 
          open={!!detail} 
          onClose={() => setDetail(undefined)} 
          data={detail} 
        />
      </div>
      <div className={styles.about}>
        <div className={styles.tip}>
          {texts.about?.tip}
        </div>
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(50px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.6 }}
        >
          {texts.about?.title?.map(item => <h3>{item}</h3>)}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, transform: 'translateY(50px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {texts.about?.desc}
        </motion.p>
        <div className={styles.websites}>
          {
            Websites.map(item => (
              <motion.div 
                key={item.id} 
                className={styles['websites-item']} 
                onClick={() => window.open(item.url)}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
              >
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
              </motion.div>
            ))
          }
        </div>
      </div>
      <div className={styles.sun}></div>
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
    </motion.div>
  );
}