import styles from './index.module.less';

/*
 * @author: tingyan.lty
 * @description: 
 */
export default function FooterGrass() {
  return (
    <div className={styles['grass']}>
      <div className={`${styles['grass-1']} ${styles['grass-1-1']}`}></div>
      <div className={`${styles['grass-1']} ${styles['grass-1-2']}`}></div>
      <div className={`${styles['grass-1']} ${styles['grass-1-3']}`}></div>
      <div className={`${styles['grass-2']} ${styles['grass-2-1']}`}></div>
      <div className={`${styles['grass-2']} ${styles['grass-2-2']}`}></div>
      <div className={`${styles['grass-2']} ${styles['grass-2-3']}`}></div>
      <div className={`${styles['grass-3']} ${styles['grass-3-1']}`}></div>
      <div className={`${styles['grass-3']} ${styles['grass-3-2']}`}></div>
      <div className={styles['flower-1']}></div>
      <div className={styles['flower-2']}></div>
      <div className={styles['flower-3']}></div>
      <div className={styles['flower-4']}></div>
    </div>
  )
}