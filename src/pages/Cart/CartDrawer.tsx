import styles from './CartDrawer.module.css';
import { useEffect, useState } from 'react';

interface CartDrawerProps {
  onClose: () => void;
}

const CartDrawer = ({ onClose }: CartDrawerProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300); // đợi animation xong mới ẩn
  };

  return (
    <div className={`${styles.drawer} ${visible ? styles.slideIn : styles.slideOut}`}>
      <div className={styles.header}>
        <h2>🛒 Giỏ hàng</h2>
        <button onClick={handleClose}>✖</button>
      </div>
      <div className={styles.content}>
        <p>🧋 Trà sữa full topping</p>
        <p>1 món x 35,000₫</p>
      </div>
      <div className={styles.footer}>
        <strong>Tổng cộng: 35,000₫</strong>
      </div>
    </div>
  );
};

export default CartDrawer;
