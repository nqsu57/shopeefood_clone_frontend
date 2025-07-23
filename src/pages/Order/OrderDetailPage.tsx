import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./OrderDetail.module.css";
import { Order, OrderItem } from "../../types/order";
import { User } from "../../types/user";
import UserSidebar from '../../component/SideBar/Sidebar';

function OrderDetailPage() {
    const { id } = useParams(); // orderID
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/get_user", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error("Lỗi lấy thông tin user", err);
            });
    }, []);


    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `http://localhost:8000/api/orders/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setOrder(res.data);
            } catch (err) {
                setError("Không thể tải chi tiết đơn hàng.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;
    if (!order) return <p>Không tìm thấy đơn hàng.</p>;

    return (
        <div className={styles.container}>
            <UserSidebar user={user} />
            <div className={styles.mainContent}>
                <h2>Chi tiết đơn hàng |  #{order.orderID}</h2>

                <div className={styles.stepper}>
                    {["Đặt hàng", "Chuẩn bị", "Giao hàng", "Hoàn tất"].map((step, index) => (
                        <div
                            key={index}
                            className={`${styles.step} ${step === order.status ? styles.active : ""
                                }`}
                        >
                            {step}
                        </div>
                    ))}
                </div>

                <div className={styles.content}>
                    {/* Left: Info */}
                    <div className={styles.infoBox}>
                        <div className={styles.infoSection}>
                            <h4>Từ:</h4>
                            <p><strong>{order.restaurant}</strong></p>
                            <p>{order.restaurantAddress}</p>
                        </div>
                        <div className={styles.infoSection}>
                            <h4>Đến:</h4>
                            <p>{user?.default_address?.address_line}, {user?.default_address?.ward.name}, {user?.default_address?.district.name}, {user?.default_address?.province.name}</p>
                            <p>{user?.default_address?.recipient_name} - {user?.default_address?.phone_number}</p>
                        </div>
                    </div>

                    {/* Right: Order details */}
                    <div className={styles.detailsBox}>
                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.itemRow}>
                                <img
                                    src={item.image}
                                    alt={item.foodName}
                                    className={styles.itemImage}
                                />
                                <div>
                                    <p>
                                        <strong>{item.foodName}</strong>
                                    </p>
                                    {item.size && <p>Size: {item.size}</p>}
                                    {item.toppings && item.toppings.length > 0 && (
                                        <p>Topping: {item.toppings.join(", ")}</p>
                                    )}
                                    <p>Số lượng: {item.quantity}</p>
                                    <p>Giá: {item.price.toLocaleString()}₫</p>
                                </div>
                            </div>
                        ))}

                        <div className={styles.priceSection}>
                            <p>
                                Tạm tính: <span>{(order.total - order.shippingFee).toLocaleString()}₫</span>
                            </p>
                            <p>
                                Phí giao hàng: <span>{order.shippingFee.toLocaleString()}₫</span>
                            </p>
                            <hr />
                            <p>
                                <strong>Tổng cộng:</strong>{" "}
                                <span><strong>{order.total.toLocaleString()}₫</strong></span>
                            </p>
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    ← Quay lại
                </button>
            </div>
        </div>
    );
}

export default OrderDetailPage;
