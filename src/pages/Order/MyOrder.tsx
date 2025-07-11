import { useState, useEffect } from "react";
import axios from "axios";
import UserSidebar from "../../component/SideBar/Sidebar";
import styles from "./MyOrders.module.css";
import { User } from "../../types/user";

const tabs = [
    "All",
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
    "Return Refund",
];

const sampleOrders = [
    { id: 1, name: "Order #1", price: 250000, status: "To Pay", img: "https://down-tx-vn.img.susercontent.com/vn-11134513-7ras8-m5v0le0lgfsz6c@resize_ss640x400!@crop_w640_h400_cT" },
    { id: 2, name: "Order #2", price: 320000, status: "Completed", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },
    { id: 3, name: "Order #3", price: 150000, status: "Cancelled", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },    
    { id: 3, name: "Order #3", price: 150000, status: "Cancelled", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },
    { id: 1, name: "Order #1", price: 250000, status: "To Pay", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },
    { id: 2, name: "Order #2", price: 320000, status: "Completed", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },
    { id: 3, name: "Order #3", price: 150000, status: "Cancelled", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },    
    { id: 3, name: "Order #3", price: 150000, status: "Cancelled", img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rfg4-m9r6vdiv92e1de@resize_w450_nl.webp" },

];

export default function MyOrdersPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:8000/api/get_user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user info", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const filteredOrders =
        activeTab === "All"
            ? sampleOrders
            : sampleOrders.filter((o) => o.status === activeTab);

    if (loading) {
        return <div className={styles.page}>Loading user information…</div>;
    }

    if (!user) {
        return <div className={styles.page}>User not found.</div>;
    }

    return (
        <div className={styles.page}>
            <UserSidebar user={user} />

            <div className={styles.content}>
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <div
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className={styles.orders}>
                    {filteredOrders.length === 0 ? (
                        <p>No orders found</p>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <img src={order.img} alt={order.name} />
                                <div className={styles.info}>
                                    <h4>{order.name}</h4>
                                    <p>{order.price.toLocaleString()} ₫</p>
                                    <span className={styles.statusBadge}>{order.status}</span>
                                </div>
                                <button className={styles.detailBtn}>View Detail</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
