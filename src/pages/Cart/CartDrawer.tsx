import { useEffect, useState } from 'react';
import styles from './CartDrawer.module.css';
import { CartItemOut } from "../../types/cart";
import { IoClose } from "react-icons/io5";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const [cartItems, setCartItems] = useState<CartItemOut[]>([]);

  const updateQuantity = (itemId: number, newQty: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };
  

  // const totalAmount = cartItems.reduce(
  //   (sum, item) => sum + calculateItemTotal(item),
  //   0
  // );

  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost:8000/api/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Cart API response:", data);
        setCartItems(data);
      })
      .catch((err) => console.error('Failed to load cart', err));
  }, [isOpen]);


  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>Giỏ hàng</h2>
          <IoClose size={24} onClick={onClose} className={styles.closeIcon} />
        </div>
        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <p>Giỏ hàng trống</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <img src={item.food.image} alt={item.food.name} />
                <div className={styles.content}>
                  <h4>{item.food.name}</h4>
                  <p>Số lượng: {item.quantity}</p>
                  {/* <p>Size: {item.selected_size?.name}</p> */}
                  {/* <p>Topping: {item.toppings.map(t => t.name).join(", ")}</p> */}
                  <p>
                    Topping: {(item.toppings_list || []).map((t) => t.name).join(", ") || "Không có"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.footer}>
          <strong>
            Tổng cộng:{" "}
            {/* {cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0).toLocaleString()}₫ */}
          </strong>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
