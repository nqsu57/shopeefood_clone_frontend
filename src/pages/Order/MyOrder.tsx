import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSidebar from '../../component/SideBar/Sidebar';
import { AiOutlineShop } from "react-icons/ai";
import styles from './MyOrders.module.css';
import { useNavigate } from 'react-router-dom';

type OrderItem = {
    foodName: string;
    image: string;
    size?: string;
    toppings?: string[];
    quantity: number;
    price: number; // thêm price cho từng món
};

type Order = {
    orderID: string;
    restaurant: string;
    createdAt: string;
    status: string;
    total: number;
    items: OrderItem[];
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

const groupOrders = (rawData: any[]): Order[] => {
    const map = new Map<number, Order>();

    rawData.forEach(item => {
        if (!map.has(item.orderID)) {
            map.set(item.orderID, {
                orderID: item.orderID,
                restaurant: item.restaurant,
                createdAt: item.createdAt,
                status: item.status,
                total: item.total,
                items: []
            });
        }

        map.get(item.orderID)!.items.push({
            foodName: item.foodName,
            image: item.image,
            size: item.size,
            toppings: item.toppings,
            quantity: item.quantity,
            price: item.price
        });
    });

    return Array.from(map.values());
};

function MyOrder() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("All");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:8000/api/get_user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch {
                setError('Không thể tải thông tin người dùng.');
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
                    const response = await axios.get(`http://localhost:8000/api/my-orders${query}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // const grouped = groupOrders(response.data);
                    setOrders(response.data);
                    console.log("Data từ API:", response.data);
                } catch {
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
            <UserSidebar user={user} />
            <div className={styles.mainContent}>
                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        {tabs.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={activeTab === tab.value ? styles.activeTab : styles.tab}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {orders.length === 0 ? (
                    <p className={styles.noOrders}>Không có đơn hàng nào.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.orderID} className={styles.orderCard}>
                            <div className={styles.header}>
                                <span> <AiOutlineShop className={styles.iconShop} />{order.restaurant} | #{order.orderID}</span>
                                <div className={styles.headerRight}>
                                    <span className={styles.status}>{order.status}</span>
                                    <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                                </div>

                            </div>

                            {order.items.length === 0 ? (
                                <p className={styles.noOrders}>The order does not have any items yet</p>
                            ) : (
                                <div className={styles.content}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className={styles.contentRow}>
                                            <div className={styles.contentLeft}>
                                                <div className={styles.image}>
                                                    <img
                                                        src={item.image || ""}
                                                        alt={item.foodName || ""}
                                                    />
                                                </div>
                                                <div className={styles.details}>
                                                    <p><strong>{item.foodName || ""}</strong></p>
                                                    {item.size && <p><strong>- Size:</strong> {item.size}</p>}
                                                    {item.toppings && item.toppings.length > 0 && (
                                                        <p><strong>- Topping:</strong> {item.toppings.join(', ')}</p>
                                                    )}
                                                    <p><strong>- Quantity:</strong> {item.quantity}</p>
                                                    <p><strong>- Price:</strong> {(item.price ?? 0).toLocaleString()}đ</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.footer}>
                                <button className={styles.detailButton}
                                    onClick={() => navigate(`/order/${order.orderID}`)} >
                                    Xem chi tiết
                                </button>
                                <div className={styles.totalBlock}>
                                    <p>
                                        <strong>Thành tiền:</strong>
                                        <span>{(order.total ?? 0).toLocaleString()}₫</span>
                                    </p>
                                </div>


                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyOrder;
