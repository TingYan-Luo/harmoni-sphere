import React, { useEffect, useRef } from 'react';
import './index.less';

type IProps = {
  images?: string[];
  itemWidth?: number;
  itemHeight?: number;
  baseSpeed?: number;
  acceleration?: number;
  direction?: 'left' | 'right';
}

const rootCls = 'infinite-image-carousel';

export default function InfiniteImageCarousel(props: IProps) {
  const {
    images = [],
    itemWidth = 200,
    itemHeight = 200,
    baseSpeed = 1, // 基础速度（像素/帧）
    acceleration = 0.05, // 每帧加/减速度
    direction = 'left',
  } = props
  const containerRef = useRef<HTMLDivElement>(null);
  // 使用 ref 保存当前动画速度和目标速度，避免频繁触发 re-render
  const currentSpeedRef = useRef(direction === 'left' ? baseSpeed : -baseSpeed);
  const targetSpeedRef = useRef(direction === 'left' ? baseSpeed : -baseSpeed);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // 初始将 scrollLeft 置为0
    container.scrollLeft = direction === 'left' ? 0 : container.clientWidth / 2;

    let lastTimestamp = null;
    const step = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // 平滑调整当前速度向目标速度靠拢
      if (currentSpeedRef.current < targetSpeedRef.current) {
        currentSpeedRef.current = Math.min(
          targetSpeedRef.current,
          currentSpeedRef.current + acceleration
        );
      } else if (currentSpeedRef.current > targetSpeedRef.current) {
        currentSpeedRef.current = Math.max(
          targetSpeedRef.current,
          currentSpeedRef.current - acceleration
        );
      }

      // 更新滚动位置（delta/16 用于将帧间差值归一化，近似60fps）
      container.scrollLeft += currentSpeedRef.current * (delta / 16);

      // 当滚动到一半时重置 scrollLeft 实现无限循环
      if (direction === 'left' && container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2;
      }
      if (direction === 'right' && container.scrollLeft <= 0) {
        container.scrollLeft += container.scrollWidth / 2;
      }

      animationFrameId.current = requestAnimationFrame(step);
    };

    animationFrameId.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [acceleration]);

  // 鼠标进入时设置目标速度为0，实现缓慢减速
  const handleMouseEnter = () => {
    targetSpeedRef.current = 0;
  };

  // 鼠标离开后设置目标速度恢复到 baseSpeed，实现缓慢加速
  const handleMouseLeave = () => {
    targetSpeedRef.current = direction === 'left' ? baseSpeed : -baseSpeed;
  };

  // 为实现无限循环，将图片列表复制一次
  const duplicatedImages = [...images, ...images];

  return (
    <div
      className={rootCls}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${rootCls}-list`}>
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className={`${rootCls}-list-item`}
            style={{
              width: itemWidth,
              height: itemHeight,
            }}
          >
            <img
              src={src}
              alt={`img-${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* {src} */}
          </div>
        ))}
      </div>
    </div>
  );
};
