import { useEffect, useState } from 'react';
import styles from './CartDrawer.module.css';
import { CartItemOut } from "../../types/cart";
import { IoClose } from "react-icons/io5";
import { calculateTotalPrice } from '../../types/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const [cartItems, setCartItems] = useState<CartItemOut[]>([]);

  const updateQuantity = async (cartItemId: number, newQty: number) => {
  await fetch(`http://localhost:8000/api/cart/${cartItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ quantity: newQty }),
  });
};

  const calculateItemTotal = (item: CartItemOut) => {
    const basePrice = (item.selected_size?.price ?? item.food.price) as number;
    const toppingIds = item.toppings_list?.map(t => t.id) ?? [];
    const toppings = item.toppings_list ?? [];

    return calculateTotalPrice(basePrice, toppingIds, toppings, item.quantity);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  const handleIncrease = (item: CartItemOut) => {
    const newQty = item.quantity + 1;
    updateQuantity(item.id, newQty);
  };

  const handleDecrease = (item: CartItemOut) => {
    const newQty = Math.max(0, item.quantity - 1);
    updateQuantity(item.id, newQty);
  };

  const handleQuantityInput = (item: CartItemOut, value: number) => {
    const newQty = isNaN(value) ? 0 : Math.max(0, value);
    updateQuantity(item.id, newQty);
  };

  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost:8000/api/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Cart API response:", data);
        setCartItems(data);
      })
      .catch((err) => console.error('Failed to load cart', err));
  }, [isOpen]);

  const handleRemove = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    // Gọi API xoá trên backend:
    fetch(`http://localhost:8000/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  };
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
            cartItems.map((item) => {
              const toppings = item.toppings_list ?? [];
              return (
                <div key={item.id} className={styles.item}>
                  <div className={styles.quantityControl}>
                    {/* <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button> */}
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 0}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => handleQuantityInput(item, parseInt(e.target.value))}
                      // onChange={(e) => {
                      //   let value = e.target.value;
                      //   if (value.startsWith('0') && value.length > 1) {
                      //     // Loại bỏ ký tự '0' ở đầu
                      //     value = value.replace(/^0+/, '');
                      //   }
                      //   handleQuantityInput(item, parseInt(value));
                      // }}
                      className={styles.quantityInput}
                    />

                    <button onClick={() => handleIncrease(item)}>+</button>
                  </div>
                  <img src={item.food.image} alt={item.food.name} />
                  <div className={styles.content}>
                    <h4>{item.food.name}</h4>
                    {/* <p>Số lượng: {item.quantity}</p> */}
                    {item.selected_size && (
                      <p>Size: {item.selected_size.name}</p>
                    )}
                    {/* <p>Topping: {item.toppings.map(t => t.name).join(", ")}</p> */}
                    <p>
                      {toppings.length > 0
                        ? toppings.map(t => t.name).join(", ")
                        : "Không có"
                      }
                    </p>
                  </div>
                  <div className={styles.basePrice}>
                    {item.quantity === 0 && (
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemove(item.id)}
                      >
                        Xoá
                      </button>
                    )}
                    {calculateItemTotal(item) > 0 && (
                      <p>
                        {calculateItemTotal(item).toLocaleString()}₫
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={styles.footer}>
          <strong>
            Tạm tính: {totalAmount.toLocaleString()}₫
          </strong>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
