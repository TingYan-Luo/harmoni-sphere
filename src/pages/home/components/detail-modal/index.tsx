import { Modal } from "antd";
import styles from './index.module.less';

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  data?: any;
}
/*
 * @author: tingyan.lty
 * @description: 详情弹窗
 */
export default function DetailModal(props: DetailModalProps) {
  const { open, onClose, data } = props;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      wrapClassName={styles['detail-modal']}
    >
      <div className={styles.detail}>
        <div className={styles['detail-top']}>
          <img src={data?.image} />
        </div>
        <div className={styles['detail-bottom']}>
          <h4>{data?.title}</h4>
          <p>{data?.content}</p>
        </div>
      </div>
    </Modal>
  );
}