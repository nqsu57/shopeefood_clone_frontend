import { useEffect, useState } from 'react';
import styles from './CartDrawer.module.css';
import { CartItemOut } from "../../types/cart";
import { IoClose } from "react-icons/io5";
import { calculateTotalPrice } from '../../types/utils';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const [cartItems, setCartItems] = useState<CartItemOut[]>([]);
  const [clearCartConfirm, setClearCartConfirm] = useState<boolean>(false);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error("Lỗi khi tải giỏ hàng");
      const data = await res.json();
      console.log("Cart API response:", data);
      setCartItems(data);
    } catch (err) {
      console.error('Failed to load cart', err);
      toast.error("Không thể tải giỏ hàng. Vui lòng thử lại.");
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cart/confirm-clear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi xóa giỏ hàng");
      setCartItems([]);
      toast.success(data.message || "Xóa giỏ hàng thành công!");
      setClearCartConfirm(false);
    } catch (err) {
      console.error('Failed to clear cart', err);
      toast.error("Không thể xóa giỏ hàng. Vui lòng thử lại.");
    }
  };

  const updateQuantity = async (cartItemId: number, newQty: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật số lượng");
      await fetchCart();
      toast.success("Cập nhật số lượng thành công!");
    } catch (err) {
      console.error('Failed to update quantity', err);
      toast.error("Không thể cập nhật số lượng. Vui lòng thử lại.");
    }
  };

  const calculateItemTotal = (item: CartItemOut) => {
    const basePrice = (item.selected_size?.price ?? item.food.price) as number;
    const toppingIds = item.toppings?.map(t => t.id) ?? [];
    const toppings = item.toppings ?? [];
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

  const handleRemove = async (itemId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error("Lỗi khi xóa món");
      await fetchCart();
      toast.success("Xóa món thành công!");
    } catch (err) {
      console.error('Failed to remove item', err);
      toast.error("Không thể xóa món. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCart();
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
            cartItems.map((item) => {
              const toppings = item.toppings ?? [];
              return (
                <div key={item.id} className={styles.item}>
                  <div className={styles.quantityControl}>
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
                      className={styles.quantityInput}
                    />
                    <button onClick={() => handleIncrease(item)}>+</button>
                  </div>
                  <img src={item.food.image} alt={item.food.name} />
                  <div className={styles.content}>
                    <h4>{item.food.name}</h4>
                    {item.selected_size && (
                      <p>Size: {item.selected_size.name}</p>
                    )}
                    <p>
                      {toppings.length > 0
                        ? toppings.map(t => t.name).join(", ")
                        : ""}
                    </p>
                    {item.note && <p>📝 {item.note}</p>}
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
                    <div className={styles.item_total_display}>
                      <RiDeleteBin6Line
                        className={styles.deleteItem}
                        onClick={() => handleRemove(item.id)}
                      />
                      {calculateItemTotal(item) > 0 && (
                        <p>
                          {calculateItemTotal(item).toLocaleString()}₫
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.contentFooter}>
            <p>Tạm tính:</p>
            <p>{totalAmount.toLocaleString()}₫</p>
          </div>
          {cartItems.length > 0 ? (
            <Link to="/order" className={styles.redirectOrder}   onClick={() => {onClose(); }}>
              Đặt hàng
            </Link>
          ) : (
            <button className={styles.redirectOrder} disabled>
              Đặt hàng
            </button>
          )}
          {cartItems.length > 0 && (
            <button
              className={styles.clearCartBtn}
              onClick={() => setClearCartConfirm(true)}
            >
              Xóa giỏ hàng
            </button>
          )}
        </div>
        {clearCartConfirm && (
          <div className={styles.confirmModal}>
            <h3>Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?</h3>
            <button onClick={clearCart}>Xóa giỏ hàng</button>
            <button onClick={() => setClearCartConfirm(false)}>Hủy</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;