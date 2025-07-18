import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MyOrders.module.css';

type Order = {
    orderId: number;
    restaurant: string;
    foodName: string;
    image: string;
    size: string;
    toppings: string[];
    quantity: number;
    total: number;
    status: string;
    createdAt: string; // Giả định backend trả về field này
};

type User = {
    userId: number;
    username: string;
    email: string;
};

const tabs = [
    { label: "Tất cả", value: "All" },
    { label: "Chờ thanh toán", value: "To Pay" },
    { label: "Vận chuyển", value: "To Ship" },
    { label: "Chờ giao hàng", value: "To Receive" },
    { label: "Hoàn thành", value: "Completed" },
    { label: "Đã huỷ", value: "Cancelled" },
    { label: "Trả hàng/Hoàn tiền", value: "Return Refund" },
];

function MyOrder() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("All");

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:8000/api/get_user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (error) {
                setError('Không thể tải thông tin người dùng.');
                console.error('Failed to fetch user info', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (user && !loading) {
            const fetchOrders = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const query = activeTab !== "All" ? `?status=${encodeURIComponent(activeTab)}` : "";

                    const response = await axios.get(`http://localhost:8000/orders${query}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setOrders(response.data);
                } catch (err) {
                    console.error("Không thể tải đơn hàng:", err);
                    setError("Không thể tải danh sách đơn hàng.");
                }
            };
            fetchOrders();
        }
    }, [user, loading, activeTab]);

    if (loading) return <p className={styles.loading}>Đang tải...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Đơn hàng của tôi</h1>

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={activeTab === tab.value ? styles.activeTab : styles.tab}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {orders.length === 0 ? (
                <p className={styles.noOrders}>Không có đơn hàng nào.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.orderId} className={styles.orderCard}>
                        <div className={styles.header}>
                            <span>{order.restaurant} | #{order.orderId}</span>
                            <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.image}>
                                <img src={order.image} alt="Food" />
                            </div>
                            <div className={styles.details}>
                                <p><strong>Tên món ăn:</strong> {order.foodName}</p>
                                <p><strong>- Size:</strong> {order.size}</p>
                                <p><strong>- Topping:</strong> {order.toppings.join(', ')}</p>
                                <p><strong>- Số lượng:</strong> {order.quantity}</p>
                                <p><strong>Tổng:</strong> {order.total.toLocaleString()}đ</p>
                                <p><strong>Trạng thái:</strong> <span className={styles.status}>● {order.status}</span></p>
                            </div>
                        </div>
                        <button className={styles.createButton}>Tạo lại đơn hàng</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyOrder;
